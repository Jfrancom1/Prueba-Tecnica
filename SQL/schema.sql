create database empresa;
use empresa;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    pais VARCHAR(50) NOT NULL,
    vendedor VARCHAR(100) NOT NULL
);

CREATE TABLE lineas_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    descuento_aplicado NUMERIC(5,4) NOT NULL CHECK (descuento_aplicado >= 0 AND descuento_aplicado <= 1)
    precio_historico Numeric(10,2) not null default 0.0
);
-- Solo cambia precio_historico