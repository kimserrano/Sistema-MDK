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


let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800, // Tamaño personalizado
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Permite la integración con Node.js
            contextIsolation: false // Asegura la compatibilidad con el código actual

        }
    });
    mainWindow.removeMenu();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/nuevoProducto.html'),
        protocol: 'file',
        slashes: true

    }));

    
    mainWindow.webContents.openDevTools();
});


