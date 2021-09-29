const {
    app,
    BrowserWindow,
    clipboard,
    nativeImage,
    Menu,
    electron,
    ipcMain,
    globalShortcut,
    desktopCapturer
} = require('electron')
const path = require("path");
const fs = require("fs");

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
    win.loadFile('index.html').then(r => function () {
        console.log("start...")
    })
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


function getCaptureImg() {
    let pngs = clipboard.readImage().toPNG()
    let imgData = new Buffer(pngs, 'base64')
    let imgs = 'data:image/png;base64'
}

// 接收渲染进程的异步信息
ipcMain.on('asynchronous-message', function (event, arg) {
    console.log(arg); // 打印的结果为刚才我们定义的名为 'winSize' 的字段
    if (arg === 'winSize') {
        win.setSize(800, 500); // 改变窗口大小
        win.center(); // 使窗口居中
    } else if (arg === 'capture') {
        // get capture image
        let png = clipboard.readImage().toPNG();
        console.log(png)
        fs.writeFile(path.resolve(__dirname + '/cap.png'), png, function (err) {
            if (err) {
                console.log(err)
            }
        })
    }
});
