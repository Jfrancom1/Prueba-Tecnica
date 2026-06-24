# Dashboard de ventas — análisis

Dashboard construido en Power BI. El archivo `.pbix` está en esta carpeta y la exportación a PDF está en `output/`.

## Qué muestra cada sección

**Tarjetas (arriba):** ventas totales, suma de cantidad vendida, ticket promedio y un indicador de anomalías detectadas — vista rápida del estado general antes de entrar en detalle.

**Ventas totales por trimestre fiscal:** columnas por Q1–Q4 (abril–marzo según la regla del CFO). Permite ver si las ventas se concentran en algún trimestre del año fiscal.

**Tasa de descuento promedio por categoría:** barras horizontales con el descuento promedio aplicado en cada categoría. Sirve para detectar si alguna categoría se está vendiendo a base de descontarla mucho, lo cual afecta el margen real aunque las ventas brutas se vean bien.

**Top 5 productos por unidades vendidas / por ingreso:** dos rankings distintos a propósito, porque no coinciden — un producto puede vender muchas unidades sin ser el que más dinero genera (precio bajo), y viceversa.

## La visualización engañosa

El gráfico de "Unidades vendidas por categoría" (la de abajo) muestra a **Audio** dominando claramente sobre el resto. Leído rápido, parece la categoría más exitosa.

**Por qué es engañoso:** esa métrica solo cuenta unidades, no dinero. Al comparar con el ingreso real (después de descuento), **Telefonía** genera más ventas en dólares con muchas menos unidades, porque su precio unitario es varias veces mayor al de Audio. Un gráfico de volumen y un gráfico de ingreso pueden contar historias opuestas sobre cuál categoría es "la mejor", y depende de qué pregunta de negocio se esté respondiendo.

## Indicador de anomalías

La tarjeta de anomalías cuenta los pedidos que requirieron corrección o exclusión antes del análisis: 1004 (precio con coma rompía el CSV), 1016 y 1017 (cantidades inválidas), 1037 (fila duplicada con id desalineado). Ver el detalle completo en [`../python/ANOMALIAS.md`](../python/ANOMALIAS.md).