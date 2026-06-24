# Documentación de Base de Datos

## 1. Justificación de Índices (Requisito 3)
Para garantizar que el sistema mantenga un rendimiento óptimo con millones de filas, se implementaron dos índices estratégicos:
* `idx_lineas_pedido_fk`: Actúa sobre las llaves foráneas en la tabla intermedia. Evita escaneos completos (*Full Table Scan*) al realizar los `JOIN` recurrentes entre pedidos y productos.
* `idx_pedidos_fecha`: Permite que la base de datos ordene y filtre cronológicamente de forma casi instantánea, acelerando el cálculo del `CASE WHEN` para los trimestres fiscales.

## 2. Corrección del Esquema - La "Trampa" (Requisito 4)
* **El Riesgo:** En el diseño original, si el precio de un producto cambiaba en la tabla `productos`, el total de todas las ventas históricas de ese producto se recalculaba con el precio nuevo. Esto destruiría la consistencia contable de la empresa en auditorías de trimestres pasados.
* **Solución Aplicada:** Se modificó la tabla existente mediante `ALTER TABLE` para incluir la columna `precio_historico` en `lineas_pedido`. De esta forma, al registrarse la transacción, el precio del momento queda "congelado" en la línea de pedido. Se utilizó un valor `DEFAULT 0.0` para asegurar la compatibilidad con registros preexistentes.