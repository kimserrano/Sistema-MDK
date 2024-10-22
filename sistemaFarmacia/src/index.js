const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const { electron } = require('process');
require('./dbConexion/database');



// quitar en producción
// es para ir viendo el cambio en el codigo en tiempo real
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
})
//

let mainWindow, holaWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        
        webPreferences: {
            
            nodeIntegration: true, // Asegurarse de que esté habilitado
            contextIsolation: false, // Asegúrate de que esté en falso para usar ipcRenderer
        }
    });
    mainWindow.removeMenu();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file',
        slashes: true
    }));

    ipcMain.on('open-hola-window', () => {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/SeleccionMedicinas.html'),
            protocol: 'file',
            slashes: true
        }));
    });
    
    mainWindow.webContents.openDevTools();
});



