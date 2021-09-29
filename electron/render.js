const {desktopCapturer, shell} = require('electron')
const {screen} = require('electron').remote

const fs = require('fs')
const os = require('os')
const path = require('path')

const render = document.getElementById('screen-shot')
const screenshotMsg = document.getElementById('render-path')

render.addEventListener('click', (event) => {
    screenshotMsg.textContent = 'Gathering screens...'
    const thumbSize = determineScreenShotSize()
    let options = {types: ['screen'], thumbnailSize: thumbSize}

    desktopCapturer.getSources(options, (error, sources) => {
        if (error) return console.log(error)

        sources.forEach((source) => {
            if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
                const screenshotPath = path.join(os.tmpdir(), 'render.png')

                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                    if (error) return console.log(error)
                    shell.openExternal(`file://${screenshotPath}`)

                    screenshotMsg.textContent = `Saved screenshot to: ${screenshotPath}`
                })
            }
        })
    })
})

function determineScreenShotSize() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}