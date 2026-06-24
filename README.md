# Prueba Técnica Línea Comunicaciones

## Pregunta Final - Diseño y Trade-offs

### Propuesta de Arquitectura
Para pasar de un procesamiento por lotes diario a un sistema cercano al tiempo real sin alterar drásticamente el sistema actual de golpe, se propone la siguiente arquitectura basada en eventos:

1. **Origen de Datos (Sistema Transaccional / ERP):** En lugar de esperar a generar un archivo CSV al final del día, cada vez que una venta se concrete, el sistema origen emitirá un pequeño evento (en formato JSON) con los datos del pedido actual, similar a la parte 1.
2. **Cola de Mensajería:** Recibe y almacena de forma ordenada todos los eventos JSON que envía el origen. Esto evita que el sistema se caiga si hay picos masivos de ventas.
3. **Procesador:** Un servicio ligero que se activa de forma automática cada vez que llega un mensaje a la cola. Su única función es tomar el JSON de la venta, limpiarlo (aplicar las reglas de formato d la Parte 1) y calcular su trimestre fiscal.
4. **Base de Datos Analítica (PostgreSQL indexado):** El procesador inserta de forma incremental la venta ya procesada directamente en nuestra base de datos relacional. Al tener índices creados (`idx_pedidos_fecha`), la base de datos soporta inserciones constantes sin degradar las lecturas.
5. **Herramienta de BI (Power BI con DirectQuery):** En lugar de importar los datos fijos una vez al día, Power BI se configura en modo **DirectQuery** conectado a la base de datos. Cada vez que el usuario interactúe o refresque el dashboard, este consultará los datos más recientes en tiempo real.

---

### Principales Riesgos y Trade-offs

1. *Riesgo:* En sistemas en tiempo real a través de redes, existe la posibilidad de que un mensaje se envíe dos veces por fallas de conexión. 
   * *Impacto:* Si no se controla, el reporte de ventas sumará el mismo pedido dos veces, arruinando la métrica del trimestre.

2. *Riesgo:* Procesar transacciones una por una las 24 horas del día consume más poder de cómputo continuo que encender un servidor por 5 minutos a la medianoche para leer un CSV. 
   * *Impacto:* El negocio debe evaluar si el beneficio económico de ver los datos al instante justifica el aumento en la factura de infraestructura.

3. *Riesgo:* Si la misma base de datos recibe miles de inserciones de ventas por minuto y al mismo tiempo los gerentes están consultando reportes pesados en Power BI, el sistema puede ralentizarse.
   * *Impacto:* Bloqueos de tablas o lentitud general si no se aíslan correctamente los roles de lectura y escritura.