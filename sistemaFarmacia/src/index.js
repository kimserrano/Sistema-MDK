const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const ProductoNegocio = require('./negocio/productoNegocio');
const ClienteNegocio = require('./negocio/clienteNegocio');
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
        pathname: path.join(__dirname, 'views/clientes.html'),
        protocol: 'file',
        slashes: true

    }));
    
    
    mainWindow.webContents.openDevTools();
});

ipcMain.handle('get-clientes', async () => {
    try {
        return await ClienteNegocio.obtenerClientes();
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
    }
});

ipcMain.handle('search-clientes', async (event, searchQuery) => {
    try {
        return await ClienteNegocio.buscarClientePorNombre(searchQuery);
    } catch (error) {
        console.error('Error al buscar clientes:', error);
        throw error;
    }
});

ipcMain.handle('get-historial', async (event, telefono) => {
    try {
        return await ClienteNegocio.getHistorialCompras(telefono);
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        throw error;
    }
});

ipcMain.on('open-historial', (event, telefono) => {
    const historialWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    historialWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/historia.html'),
        protocol: 'file',
        slashes: true
    }));

    historialWindow.webContents.once('did-finish-load', () => {
        historialWindow.webContents.send('cargar-historial', telefono);
    });

});
