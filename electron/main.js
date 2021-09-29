const {app, BrowserWindow, Menu, electron, ipcMain, globalShortcut, desktopCapturer} = require('electron')
const path = require("path");

var win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        // alwaysOnTop: true,
        // skipTaskbar: true
    })
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    } else {
        console.log("please colse previous window first")
    }
})

app.on('ready', () => {
})
