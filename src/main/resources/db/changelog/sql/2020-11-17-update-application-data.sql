--liquibase formatted sql
UPDATE application SET source_location_warehouse_id=1, destination_location_warehouse_id=2 where id between 1 and 4;
UPDATE application SET source_location_warehouse_id=19, destination_location_warehouse_id=20 where id between 5 and 10;
UPDATE application SET source_location_warehouse_id=3, destination_location_warehouse_id=4 where id between 11 and 21;
UPDATE application SET source_location_warehouse_id=5, destination_location_warehouse_id=6 where id between 22 and 32;
UPDATE application SET source_location_warehouse_id=7, destination_location_warehouse_id=8 where id between 33 and 43;
UPDATE application SET source_location_warehouse_id=10, destination_location_warehouse_id=9 where id between 44 and 55;
UPDATE application SET source_location_warehouse_id=11, destination_location_warehouse_id=12 where id between 56 and 66;
UPDATE application SET source_location_warehouse_id=13, destination_location_warehouse_id=14 where id between 67 and 77;
UPDATE application SET source_location_warehouse_id=15, destination_location_warehouse_id=16 where id between 78 and 88;
UPDATE application SET source_location_warehouse_id=17, destination_location_warehouse_id=18 where id between 89 and 100;
