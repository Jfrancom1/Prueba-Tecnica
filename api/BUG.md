# Reporte de Bug: 
## 1. Descripción del Bug Original
El sistema permitía que un usuario confirmara el pago de una reserva incluso después de haber superado el límite de tiempo establecido (10 segundos). Esto ocurría porque el sistema dependía de un mecanismo pasivo de validación temporal al momento de ejecutar la función `confirmar()`. Como consecuencia, las reservas no expiraban en tiempo real dentro del flujo de confirmación, permitiendo transacciones fuera de los términos de la regla de negocio.

## 2. Causa Raíz
La función `confirmar()` validaba únicamente la existencia de la reserva en el mapa de memoria (`reservas`), pero omitía verificar la estampa de tiempo (`timestamp`) de su creación. Al no calcular la diferencia entre la hora actual (`Date.now()`) y la hora de registro de la reserva (`reserva.creada`), el sistema procesaba solicitudes retrasadas como válidas.

## 3. Solución Implementada
* **Cálculo de Delta de Tiempo:** Se modificó la función `confirmar()` para realizar una operación síncrona que calcula el tiempo transcurrido desde la creación de la reserva: `const tiempoTranscurrido = Date.now() - reserva.creada;`.
* **Validación e Invalidación Inmediata:** Si `tiempoTranscurrido` supera el `tiempoExpiracion` configurado, la reserva se elimina inmediatamente del mapa de memoria mediante `reservas.delete(reservaId)` y se lanza un error con el mensaje `'Reserva expirada o inexistente'`.
* **Mantenimiento de Sincronía:** En estricto cumplimiento de los requerimientos de diseño, toda la validación se mantuvo de forma síncrona en memoria, evitando el uso de abstracciones asíncronas (`async/await`) que habrían roto la predictibilidad del reloj del sistema y la ejecución de las pruebas unitarias.

## 4. Estrategia de Pruebas Unitarias
Se diseñó una suite de pruebas utilizando Jest para simular y validar el comportamiento del tiempo de forma controlada mediante temporizadores falsos (`jest.useFakeTimers()`):

* **Caso Exitoso (Dentro del tiempo):** Se verificó que una confirmación realizada a los 9 segundos es aprobada correctamente por el sistema.
* **Caso Fallido (Expirado):** Se adelantó el reloj virtual de Jest por 11 segundos usando `jest.advanceTimersByTime(11000)` para asegurar que la función `confirmar()` falle de manera controlada y devuelva el error esperado, bloqueando la operación del cliente moroso.