# Parte 3: BI — Dashboard, métricas y la pregunta que nadie hace

## Cómo ejecutar

1. Instalar [Power BI Desktop](https://powerbi.microsoft.com/desktop/) (gratis, solo Windows).
2. Abre `Paso 3 Power Bi.pbix` con Power BI Desktop.
3. Si pide actualizar el origen de datos, apunta a `datos_ventas_muestra.csv`
4. Si no tienes Power BI instalado, revisa directamente el análisis y las capturas en [`dashboard.md`](./dashboard.md) y el PDF en [`output/`](./output).

## Decisiones técnicas

- Se separaron explícitamente dos rankings de "Top 5 productos" (por unidades y por ingreso) en vez de uno solo, porque en los datos no coinciden.
- El indicador de anomalías se calculó con una medida DAX (`COUNTROWS` filtrado por los ids problemáticos) sobre la tabla con los datos originales, para que quede trazable a los datos reales y no a un valor fijo.
- Se eligió un gráfico de barras horizontales para "descuento promedio por categoría" y "Top 5 productos" porque los nombres de categoría/producto son largos y no caben bien en un eje horizontal con barras verticales.
- El gráfico engañoso usa **cantidad** (unidades) en vez de ingreso a propósito, porque es la lectura más intuitiva (y por eso la más fácil de malinterpretar) cuando alguien mira el dashboard rápido sin revisar los ejes.

## Supuestos realizados

- Se mantienen los mismos supuestos de limpieza que en la Parte 1 (PYTHON) (ver [`../python/README.md`](../python/README.md)): cantidad inválida → 0, fila 1037 → error de captura, fechas DD/MM/YYYY vs YYYY-MM-DD diferenciadas explícitamente.
- Se asumió que "trimestre fiscal" solo depende del mes (no del año), siguiendo la misma regla aplicada en Python.
- Se decidió excluir del análisis final los pedidos 1004, 1016, 1017 y 1037 para tener un dashboard más limpio, manteniendo la tabla original sin filtrar como fuente para el indicador de anomalías.

## Por qué estas visualizaciones
 
- **Ventas totales por trimestre fiscal → gráfico de columnas verticales.** Q1-Q4 es una secuencia ordenada (como una línea de tiempo), y las columnas verticales son las que mejor comunican "progresión" de izquierda a derecha, además de facilitar comparar magnitudes entre solo 4 categorías de un vistazo.
- **Top 5 productos (por unidades / por ingreso) → barras horizontales.** Los nombres de producto son texto largo ("Auriculares Pro", "Teclado Mecánico"); en barras verticales esas etiquetas se rotan o se cortan y se vuelven ilegibles. En horizontal, el nombre completo queda a la izquierda sin rotar, y además un ranking se lee naturalmente de arriba hacia abajo (el primero del top, arriba).
- **Descuento promedio por categoría → barras horizontales.** Misma razón que el Top 5: nombres de categoría largos, y solo 5 categorías a comparar — un gráfico de barras comunica diferencias de magnitud mucho mejor que un pie/dona, que aquí solo añadiría ruido visual sin aportar nada.
- **Indicador de anomalías → tarjeta (card), no un gráfico.** Es un número único que necesita notarse de inmediato, sin contexto de comparación. Meterlo en un gráfico de barras de una sola barra sería sobre-diseñar algo que solo necesita destacar.
- **El gráfico engañoso → columnas verticales (a propósito).** Las columnas exageran visualmente la diferencia de altura entre Audio y el resto, lo cual hace que la conclusión errónea ("Audio domina") se sienta más contundente a primera vista. Esa es justo la razón por la que se eligió ese tipo de gráfico para esta visualización: si en su lugar usáramos una tabla o un gráfico normalizado, el efecto engañoso sería mucho más débil.
