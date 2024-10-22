const { app, BrowserWindow, Menu } = require('electron');
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
    mainWindow = new BrowserWindow({});
    mainWindow.removeMenu();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file',
        slashes: true
    }))


});


// src/main.js o donde necesites usar la clase Cajero

const CajeroNegocio = require('./negocio/CajeroNegocio');

async function agregarCajero(nombre) {
    try {
        // Llamada a la capa de negocio
        await CajeroNegocio.agregarCajero(nombre);
    } catch (error) {
        console.error('Error al agregar el cajero desde el index:', error);
    }
}

// Ejemplo de uso: agregar un cajero llamado "Juan Pérez"
agregarCajero('kk').catch(console.error);
