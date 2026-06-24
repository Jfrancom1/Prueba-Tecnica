const reservas = new Map(); // El cuaderno donde anotamos las reservas
let tiempoExpiracion = 10000; // El límite de tiempo permitido (10 segundos)

// Anotar la hora de creación
function reservar(productoId, usuarioId) {
    const reservaId = Math.random().toString(36).slice(2); // Creamos un ID único para la reserva
    
    // Guardamos la reserva anotando la hora exacta en la que se creó con Date.now()
    reservas.set(reservaId, { productoId:productoId, usuarioId:usuarioId, creada: Date.now() }); 
    
    return reservaId; //para saber el numero de reserva
}

// Calcular el tiempo mediante una resta al momento de confirmar
function confirmar(reservaId) {
    const reserva = reservas.get(reservaId); // Buscamos la reserva en el cuaderno
    
    if (!reserva) {
        throw new Error('Reserva expirada o inexistente');
    }

    // Restamos
    const tiempoTranscurrido = Date.now() - reserva.creada;

    // Si el resultado de la resta es mayor a 10 segundos, la borramos y lanzamos error
    if (tiempoTranscurrido > tiempoExpiracion) {
        reservas.delete(reservaId); // esta viejita
        throw new Error('Reserva expirada o inexistente');
    }

    // Si la resta dio menos de 10 segundos, todo está perfecto y se confirma el pago
    return { ok: true, reservaId };
}