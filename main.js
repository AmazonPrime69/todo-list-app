const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win  // Global reference to window object

// Create window function
function createWindow(){
    win = new BrowserWindow({width: 1000, height: 800, icon: __dirname+'/img/icon.png', webPreferences: { nodeIntegration: true }})  // Create window object

    // Load html file
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }))
    

    // Open devtools (development only)
    //win.webContents.openDevTools()

    // Close window
    win.on('close', () => {
        win = null
    })
}

// Create the actuall window
app.on('ready', createWindow)

// Quit when all windows are closed properly
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})