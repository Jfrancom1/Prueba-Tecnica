-- -------------------- Pedido 1 ---------------
create view tabla_completa as
select p.categoria, case
	when extract(month from pd.fecha) in (4,5,6) then 'Q1'
	when extract(month from pd.fecha) in (7,8,9) then 'Q2'
	when extract(month from pd.fecha) in (10,11,12) then 'Q3'
	else 'Q4' end as periodo_fiscal,
	(lp.cantidad * precio_unitario *(1-lp.descuento_aplicado)) as total_venta
	from lineas_pedido lp
	join productos p on lp.producto_id = p.id
	inner join pedidos pd on lp.pedido_id = pd.id;
-- Tabla con periodos fiscales

select categoria, periodo_fiscal, sum(total_venta) as ventas_totales from tabla_completa
group by periodo_fiscal, categoria 
order by periodo_fiscal, categoria; 

-- ---------------------Pedido 2 ----------------

select lp.producto_id, pd.pais, pd.vendedor, pd.fecha, count(*) as repetidas from lineas_pedido lp
join pedidos pd on lp.pedido_id = pd.id
group by 1,2,3,4
having count(*) > 3;

-- ------------------Pedido 3 --------------
-- Se crea una indexación para facilitar las lecturas de los datos

-- un indexacion para una mejor búsqueda entre tablas 
CREATE INDEX idx_lineas_pedido_fk ON lineas_pedido(pedido_id, producto_id);
-- y una indexacion para busqueda de fechas
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha);

-- -------------------- Pedido 4-----------------
-- Creamos una nueva columna a lineas pedido llamada precio  historico.
-- Donde capture el precio unitario antiguo antes de ser cambio

alter table lineas_pedido
add column precio_historico Numeric(10,2) not null default 0.0;
-- el default para que no queden vacios