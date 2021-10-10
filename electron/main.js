const {
    app,
    BrowserWindow,
    clipboard,
    ipcMain
} = require('electron')
const path = require("path");
const fs = require("fs");
const {PythonShell} = require('python-shell')
const axios = require("axios");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 650,
        height: 350,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        // alwaysOnTop: true,
        // skipTaskbar: true
        maximizable: false,
        resizable: false
    })
    win.loadFile('index.html').then(() => function () {
        console.log("start...")
    })
    //win.webContents.openDevTools(); // open Dev Tools when app start
    win.menuBarVisible = false
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
    startServer()
})

app.on('will-quit', () => {
    stopServer()
})

// 接收渲染进程的异步信息
ipcMain.on('asynchronous-message', function (event, arg) {
    console.log(arg); // 打印的结果为刚才我们定义的名为 'winSize' 的字段
    if (arg === 'winSize') {
        win.setSize(800, 500); // 改变窗口大小
        win.center(); // 使窗口居中
    } else if (arg === 'capture') {
        // get capture image
        let png = clipboard.readImage().toPNG();
        console.log("********************")

        // images check
        if (png.toString().trim().length === 0) {
            // Screenshots not acquired
            console.log("Screenshots not acquired")

            event.reply('asynchronous-reply', 'fp-error');
        } else {
            console.log("get the capture image")
            fs.writeFile(path.resolve(__dirname + '/cap.png'), png, function (err) {
                if (err) {
                    console.log(err)
                }
            })

            event.reply('asynchronous-reply', 'fp');
        }
    }
});

let pyProc = null

// start zerorpc server to process OCR
const startServer = () => {
    // new ways to use python-shell to start flask server
    let options = {
        mode: 'text',
        pythonPath: 'D:/ProgramData/Miniconda3/envs/python3/python.exe',
        scriptPath: '../server',
    }
    pyProc = PythonShell.run('app.py', options, function (err, results) {
        console.log(err)
        if (err) throw err;
        console.log('result: %j', results)
    })

    console.log("server start.")
}

// stop the zerorpc when app was closed
const stopServer = () => {
    console.log("kill the python process")
    pyProc.kill()
    pyProc = null
}


