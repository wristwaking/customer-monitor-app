const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { config } = require("dotenv");
const path = require('path');
config()
let dir = process.cwd();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 960,
        height: 715,
        resizable: false,
        frame: false,
        transparent: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: true,
            webSecurity: false
        }
    })
    mainWindow.webContents.loadFile(path.join(__dirname, 'pages', 'main', 'main.html'));
    return mainWindow
}

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    mainWindow = createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('close-app', (event, params) => {
    mainWindow.close()
})

ipcMain.on('search-record', (event, params) => {
    shell.openPath(path.join(dir, "weixinbot", "客服消息日志"))
})

ipcMain.on('search-status', (event, params) => {
    shell.openPath(path.join(dir, "weixinbot", "客服统计数据"))
})

ipcMain.on('open-status', (event, params) => {
    shell.openPath(path.join(dir, "weixinbot"))
})

ipcMain.on('resize-app', (event, params) => {
    mainWindow.minimize()
})



