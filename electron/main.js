const {
    app,
    BrowserWindow,
    clipboard,
    ipcMain } = require('electron')
const path = require("path");
const fs = require("fs");
const { PythonShell } = require('python-shell')

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
    win.loadFile('index.html').then(() => function () {
        console.log("start...")
    })
    win.webContents.openDevTools(); // open Dev Tools when app start
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
        if (png.toString().trim().length === 0) {
            // Screenshots not acquired
            console.log("Screentshots not acquired")

            // TODO return failed message
        } else {
            console.log("get the capture image")
            fs.writeFile(path.resolve(__dirname + '/cap.png'), png, function (err) {
                if (err) {
                    console.log(err)
                }
            })

            // TODO call the back-end interface to get the recognition content
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
    PythonShell.run('app.py', options, function (err, results) {
        console.log(err)
        if (err) throw err;
        console.log('result: %j', results)
    })

    console.log("server start.")
    // let port = "4242"
    // let script = path.join("../server", "app.py")

    // let cmd = "python " + script
    // pyProc = require('child_process').spawn("python -V")
    // if (pyProc != null) {
    //     console.log("child process start successfully")
    // } else {
    //     console.log("child process start failed")
    // }
}

// stop the zerorpc when app was closed
const stopServer = () => {
    pyProc.kill()
    pyProc = null
}


