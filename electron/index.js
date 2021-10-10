// 引入 ipcRenderer 模块 用于从渲染进程到主进程的异步通信 你可以使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主进程 也可以接收主进程回复的消息
const {ipcRenderer} = require('electron');

document.getElementById('capture').onclick = () => {
    // TODO 设置按钮内容为识别中，按钮不可按，处理完成后恢复


    // 向主进程发送一个名为 capture 消息
    ipcRenderer.send('asynchronous-message', 'capture');
};
