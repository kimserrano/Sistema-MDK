const productoNegocio = require('../src/negocio/productoNegocio');
const ProductoDAO = require('../src/dao/productoDAO');
const Producto = require('../src/dominio/producto');

jest.mock('../src/dao/productoDAO'); // Mockear el ProductoDAO

describe('ProductoNegocio', () => {
    const mockProductoDAO = new ProductoDAO();

    beforeEach(() => {
        productoNegocio.productoDAO = mockProductoDAO; // Asignar el mock al servicio
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
    });

    describe('validarFecha', () => {
        it('debería validar correctamente una fecha en formato YYYY-MM-DD', () => {
            expect(productoNegocio.validarFecha('2024-10-22')).toBe(true);
            expect(productoNegocio.validarFecha('22-10-2024')).toBe(false);
        });
    });

    describe('validarNumeroPositivo', () => {
        it('debería validar correctamente números positivos', () => {
            expect(productoNegocio.validarNumeroPositivo(10)).toBe(true);
            expect(productoNegocio.validarNumeroPositivo(-5)).toBe(false);
            expect(productoNegocio.validarNumeroPositivo(0)).toBe(false);
            expect(productoNegocio.validarNumeroPositivo('10')).toBe(false);
        });
    });

    describe('validarTexto', () => {
        it('debería validar correctamente texto con longitud especificada', () => {
            expect(productoNegocio.validarTexto('Nombre', 3, 50)).toBe(true);
            expect(productoNegocio.validarTexto('No', 3, 50)).toBe(false);
            expect(productoNegocio.validarTexto('Texto de prueba', 5, 10)).toBe(false);
            expect(productoNegocio.validarTexto('Validar', 3, 7)).toBe(true);
        });
    });

    describe('crearProducto', () => {
        it('debería lanzar un error si el nombre del producto es inválido', async () => {
            await expect(productoNegocio.crearProducto({ nombre: 'No', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('El nombre del producto es inválido (entre 3 y 50 caracteres).');
        });

        it('debería lanzar un error si el lote es inválido', async () => {
            await expect(productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'No', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('El lote es inválido (entre 3 y 30 caracteres).');
        });

        it('debería lanzar un error si la cantidad es un número negativo', async () => {
            await expect(productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'Lote123', cantidad: -5, precio: 10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('La cantidad debe ser un número positivo.');
        });

        it('debería lanzar un error si el precio es un número negativo', async () => {
            await expect(productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'Lote123', cantidad: 5, precio: -10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('El precio debe ser un número positivo.');
        });

        it('debería lanzar un error si la fecha de vencimiento es inválida', async () => {
            await expect(productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '22-10-2024' }))
                .rejects.toThrow('La fecha de vencimiento es inválida. Debe tener el formato YYYY-MM-DD.');
        });

        it('debería lanzar un error si el producto ya existe', async () => {
            mockProductoDAO.verificarProductoExistente.mockResolvedValue(true); // Simular que el producto existe
            await expect(productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('El producto con este nombre ya existe.');
        });

        it('debería crear un nuevo producto correctamente', async () => {
            mockProductoDAO.verificarProductoExistente.mockResolvedValue(false); // Simular que el producto no existe
            mockProductoDAO.crearProducto.mockResolvedValue('Producto creado'); // Simular que se crea el producto

            const result = await productoNegocio.crearProducto({ nombre: 'NombreValido', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' });
            expect(result).toBe('Producto creado');
            expect(mockProductoDAO.crearProducto).toHaveBeenCalled(); // Verificar que se haya llamado al método crearProducto
        });
    });


    describe('obtenerProductoPorId', () => {
        it('debería lanzar un error si el ID es inválido', async () => {
            await expect(productoNegocio.obtenerProductoPorId(null)).rejects.toThrow('ID de producto inválido.');
            await expect(productoNegocio.obtenerProductoPorId(-1)).rejects.toThrow('ID de producto inválido.');
            await expect(productoNegocio.obtenerProductoPorId(0)).rejects.toThrow('ID de producto inválido.');
        });

        it('debería obtener un producto por ID correctamente', async () => {
            const productoEsperado = { nombre: 'Producto 1', lote: 'Lote 1', cantidad: 10, precio: 100, fechaVencimiento: '2024-12-31' };
            const idProducto = 1;

            // Simula la implementación de obtenerProductoPorId
            mockProductoDAO.obtenerProductoPorId.mockResolvedValue(productoEsperado);

            const productoObtenido = await productoNegocio.obtenerProductoPorId(idProducto);

            expect(productoObtenido).toEqual(productoEsperado);
            expect(mockProductoDAO.obtenerProductoPorId).toHaveBeenCalledWith(idProducto); // Verifica que se llamó con el ID correcto
        });

        it('debería lanzar un error si ocurre un problema al obtener el producto', async () => {
            const idProducto = 1;
            const mensajeError = 'Producto no encontrado';
            mockProductoDAO.obtenerProductoPorId.mockRejectedValue(new Error(mensajeError));

            await expect(productoNegocio.obtenerProductoPorId(idProducto)).rejects.toThrow('Error al obtener el producto: ' + mensajeError);
        });
    });

    describe('obtenerProductosPorCriterio', () => {
        it('debería lanzar un error si el criterio de búsqueda es inválido', async () => {
            await expect(productoNegocio.obtenerProductosPorCriterio(null)).rejects.toThrow('Criterio de búsqueda inválido.');
            await expect(productoNegocio.obtenerProductosPorCriterio('')).rejects.toThrow('Criterio de búsqueda inválido.');
        });
    
        it('debería obtener productos correctamente cuando se proporciona un criterio válido', async () => {
            const criterio = 'Producto1';
            const productosEsperados = [
                { nombre: 'Producto1', lote: 'Lote1', cantidad: 10, precio: 100, fechaVencimiento: '2024-12-31' },
            ];
    
            // Simula la implementación de obtenerProductosPorCriterio
            mockProductoDAO.obtenerProductosPorCriterio.mockResolvedValue(productosEsperados);
    
            const productosObtenidos = await productoNegocio.obtenerProductosPorCriterio(criterio);
    
            expect(productosObtenidos).toEqual(productosEsperados);
            expect(mockProductoDAO.obtenerProductosPorCriterio).toHaveBeenCalledWith(criterio); // Verifica que se llamó con el criterio correcto
        });
    
        it('debería lanzar un error si ocurre un problema al obtener los productos', async () => {
            const criterio = 'Producto1';
            const mensajeError = 'Error en la base de datos';
    
            // Simula un error en obtenerProductosPorCriterio
            mockProductoDAO.obtenerProductosPorCriterio.mockRejectedValue(new Error(mensajeError));
    
            await expect(productoNegocio.obtenerProductosPorCriterio(criterio)).rejects.toThrow('Error al obtener los productos: ' + mensajeError);
        });
    });
    describe('actualizarProducto', () => {
        it('debería lanzar un error si el ID es inválido', async () => {
            await expect(productoNegocio.actualizarProducto(null, {})).rejects.toThrow('ID de producto inválido.');
            await expect(productoNegocio.actualizarProducto(-1, {})).rejects.toThrow('ID de producto inválido.');
            await expect(productoNegocio.actualizarProducto(0, {})).rejects.toThrow('ID de producto inválido.');
        });

        it('debería lanzar un error si el nombre del producto es inválido', async () => {
            await expect(productoNegocio.actualizarProducto(1, { nombre: 'No', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' }))
                .rejects.toThrow('El nombre del producto es inválido (entre 3 y 50 caracteres).');
        });

        it('debería actualizar un producto correctamente', async () => {
            const productoActualizado = { nombre: 'NombreValido', lote: 'Lote123', cantidad: 5, precio: 10, fechaVencimiento: '2024-10-22' };
            mockProductoDAO.verificarProductoExistente.mockResolvedValue(false); // Simula que el producto no existe
            mockProductoDAO.actualizarProducto.mockResolvedValue('Producto actualizado'); // Simula la actualización exitosa

            const resultado = await productoNegocio.actualizarProducto(1, productoActualizado);
            expect(resultado).toBe('Producto actualizado');
            expect(mockProductoDAO.actualizarProducto).toHaveBeenCalledWith(1, expect.any(Object)); // Verifica que se llamó con el ID correcto
        });
    });


    describe('eliminarProducto', () => {
        it('debería lanzar un error si el ID es inválido', async () => {
            await expect(productoNegocio.eliminarProducto(null)).rejects.toThrow();
            await expect(productoNegocio.eliminarProducto(-1)).rejects.toThrow();
            await expect(productoNegocio.eliminarProducto(0)).rejects.toThrow();
        });

        it('debería eliminar un producto correctamente', async () => {
            mockProductoDAO.eliminarProducto.mockResolvedValue('Producto eliminado'); // Simula la eliminación exitosa

            const resultado = await productoNegocio.eliminarProducto(1);
            expect(resultado).toBe('Producto eliminado');
            expect(mockProductoDAO.eliminarProducto).toHaveBeenCalledWith(1); // Verifica que se llamó con el ID correcto
        });

        it('debería lanzar un error si hay un problema al eliminar el producto', async () => {
            mockProductoDAO.eliminarProducto.mockRejectedValue(new Error()); // Simula un error en la eliminación

            await expect(productoNegocio.eliminarProducto(1)).rejects.toThrow();
        });
    });


    describe('reducirInventario', () => {
        it('debería lanzar un error si el ID es inválido', async () => {
            await expect(productoNegocio.reducirInventario(null, 5)).rejects.toThrow();
            await expect(productoNegocio.reducirInventario(-1, 5)).rejects.toThrow();
            await expect(productoNegocio.reducirInventario(0, 5)).rejects.toThrow();
        });

        it('debería lanzar un error si la cantidad a reducir es inválida', async () => {
            await expect(productoNegocio.reducirInventario(1, -5)).rejects.toThrow();
            await expect(productoNegocio.reducirInventario(1, 0)).rejects.toThrow();
        });

        it('debería lanzar un error si la cantidad a reducir excede el inventario disponible', async () => {
            // Simular producto existente con cantidad 10
            const mockProducto = { id: 1, nombre: 'Producto1', lote: 'Lote1', cantidad: 10, fechaVencimiento: '2024-10-22', precio: 20 };
            jest.spyOn(productoNegocio, 'obtenerProductoPorId').mockResolvedValue(mockProducto);

            await expect(productoNegocio.reducirInventario(1, 15)).rejects.toThrow();
        });

        it('debería reducir el inventario correctamente', async () => {
            // Simular producto existente con cantidad 10
            const mockProducto = { id: 1, nombre: 'Producto1', lote: 'Lote1', cantidad: 10, fechaVencimiento: '2024-10-22', precio: 20 };
            jest.spyOn(productoNegocio, 'obtenerProductoPorId').mockResolvedValue(mockProducto);

            const nuevaCantidad = mockProducto.cantidad - 5; // Reducir 5 unidades
            const productoActualizado = new Producto(mockProducto.nombre, mockProducto.lote, nuevaCantidad, mockProducto.fechaVencimiento, mockProducto.precio);

            mockProductoDAO.actualizarProducto = jest.fn().mockResolvedValue('Inventario reducido');

            const resultado = await productoNegocio.reducirInventario(1, 5);
            expect(resultado).toBe('Inventario reducido');
            expect(mockProductoDAO.actualizarProducto).toHaveBeenCalledWith(1, productoActualizado); // Verificar que se llamó con el producto actualizado
        });

        it('debería lanzar un error si hay un problema al reducir el inventario', async () => {
            // Simular producto existente con cantidad 10
            const mockProducto = { id: 1, nombre: 'Producto1', lote: 'Lote1', cantidad: 10, fechaVencimiento: '2024-10-22', precio: 20 };
            jest.spyOn(productoNegocio, 'obtenerProductoPorId').mockResolvedValue(mockProducto);
            mockProductoDAO.actualizarProducto.mockRejectedValue(new Error('Error en la base de datos')); // Simular error en la actualización

            await expect(productoNegocio.reducirInventario(1, 5)).rejects.toThrow();
        });
    });




    // diego 

    describe('obtenerTodosLosProductos', () => {
        it('debería obtener todos los productos correctamente', async () => {
            const productosEsperados = [
                { nombre: 'Producto 1', lote: 'Lote 1', cantidad: 10, precio: 100, fechaVencimiento: '2024-12-31' },
                { nombre: 'Producto 2', lote: 'Lote 2', cantidad: 5, precio: 50, fechaVencimiento: '2025-01-15' },
            ];

            // Simula la implementación de consultarTodos
            mockProductoDAO.consultarTodos.mockResolvedValue(productosEsperados);

            const productosObtenidos = await productoNegocio.obtenerTodosLosProductos();

            expect(productosObtenidos).toEqual(productosEsperados);
            expect(mockProductoDAO.consultarTodos).toHaveBeenCalled(); // Verifica que se llamó al método
        });

        it('debería lanzar un error si ocurre un problema al obtener los productos', async () => {
            const mensajeError = 'Error en la base de datos';
            mockProductoDAO.consultarTodos.mockRejectedValue(new Error(mensajeError));

            await expect(productoNegocio.obtenerTodosLosProductos()).rejects.toThrow('Error al obtener los productos: ' + mensajeError);
        });
    });


    // de alerta
    describe('aplicarDescuentos', () => {
        it('debería aplicar un descuento del 20% para un producto que vence hoy', async () => {
            const hoy = new Date();
            const productos = [
                { nombre: 'Producto 1', fechaVencimiento: hoy, descuento: 0, precioOriginal: 100, precio: 100 }
            ];

            mockProductoDAO.actualizarPrecios.mockResolvedValue('Producto actualizado');

            await productoNegocio.aplicarDescuentos(productos);

            expect(productos[0].precio).toBe(80);
            expect(productos[0].descuento).toBe(20);
            expect(mockProductoDAO.actualizarPrecios).toHaveBeenCalledWith([productos[0]]);
        });

        it('debería aplicar un descuento del 15% para un producto que vence en menos de 7 días', async () => {
            const fechaProxima = new Date();
            fechaProxima.setDate(fechaProxima.getDate() + 5);
            const productos = [
                { nombre: 'Producto 2', fechaVencimiento: fechaProxima, descuento: 0, precioOriginal: 100, precio: 100 }
            ];

            mockProductoDAO.actualizarPrecios.mockResolvedValue('Producto actualizado');

            await productoNegocio.aplicarDescuentos(productos);

            expect(productos[0].precio).toBe(85);
            expect(productos[0].descuento).toBe(15);
            expect(mockProductoDAO.actualizarPrecios).toHaveBeenCalledWith([productos[0]]);
        });

        it('debería aplicar un descuento del 10% para un producto que vence en menos de 15 días', async () => {
            const fechaProxima = new Date();
            fechaProxima.setDate(fechaProxima.getDate() + 10);
            const productos = [
                { nombre: 'Producto 3', fechaVencimiento: fechaProxima, descuento: 0, precioOriginal: 100, precio: 100 }
            ];

            mockProductoDAO.actualizarPrecios.mockResolvedValue('Producto actualizado');

            await productoNegocio.aplicarDescuentos(productos);

            expect(productos[0].precio).toBe(90);
            expect(productos[0].descuento).toBe(10);
            expect(mockProductoDAO.actualizarPrecios).toHaveBeenCalledWith([productos[0]]);
        });

        it('no debería aplicar descuento si el producto ya tiene el descuento correcto', async () => {
            const fechaProxima = new Date();
            fechaProxima.setDate(fechaProxima.getDate() + 5);
            const productos = [
                { nombre: 'Producto 4', fechaVencimiento: fechaProxima, descuento: 15, precioOriginal: 100, precio: 85 }
            ];

            await productoNegocio.aplicarDescuentos(productos);

            expect(mockProductoDAO.actualizarPrecios).not.toHaveBeenCalled();
        });

        it('debería omitir productos ya caducados', async () => {
            const fechaPasada = new Date();
            fechaPasada.setDate(fechaPasada.getDate() - 1);
            const productos = [
                { nombre: 'Producto 5', fechaVencimiento: fechaPasada, descuento: 0, precioOriginal: 100, precio: 100 }
            ];

            await productoNegocio.aplicarDescuentos(productos);

            expect(mockProductoDAO.actualizarPrecios).not.toHaveBeenCalled();
        });
    });


});
