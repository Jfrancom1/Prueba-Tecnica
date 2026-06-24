// 1. Traemos las funciones que queremos probar desde pagos.js
const { reservar, confirmar, configurarTiempoExpiracion, reservas } = require('./pagos');

describe('Pruebas de la API de Pagos', () => {
    
    // Antes de cada prueba, limpiamos todo y activamos el reloj
    beforeEach(() => {
        reservas.clear(); // Borra la lista para empezar desde cero
        configurarTiempoExpiracion(10000); // 10 segundos
        jest.useFakeTimers(); // Congela el tiempo real y activa el reloj de mentira
    });

    // PRUEBA 1: El cliente compra rápido (dentro de los 10 segundos)
    test('Debe aprobar la compra si el cliente paga a tiempo', () => {
        // El cliente aparta el producto
        const id = reservar('producto-1', 'usuario-1');
        
        // Adelantamos nuestro reloj
        jest.advanceTimersByTime(5000); 
        
        // El cliente paga. Como pasaron 5 segundos (menor a 10), debe funcionar
        const resultado = confirmar(id);
        
        // Exigimos que el resultado sea exitoso (true)
        expect(resultado.ok).toBe(true);
    });

    // PRUEBA 2: El cliente se tarda demasiado (más de 10 segundos)
    test('Debe cancelar la compra si el cliente se pasa del tiempo', () => {
        // El cliente aparta el producto
        const id = reservar('producto-1', 'usuario-1');
        
        // Adelantamos el reloj
        jest.advanceTimersByTime(11000); 
        
        // Intentamos pagar tarde. Exigimos que el sistema falle y lance un Error
        expect(() => confirmar(id)).toThrow('Reserva expirada o inexistente');
    });
});