--liquibase formatted sql
UPDATE waybill SET source_location_warehouse_id=8, waybill_status='READY' where id between 1 and 3;
UPDATE waybill SET source_location_warehouse_id=9, waybill_status='READY' where id between 3 and 4;
UPDATE waybill SET source_location_warehouse_id=10, waybill_status='IN_PROGRESS' where id between 5 and 8;
UPDATE waybill SET source_location_warehouse_id=11, waybill_status='READY' where id between 9 and 11;
UPDATE waybill SET source_location_warehouse_id=12, waybill_status='FINISHED' where id between 12 and 14;
UPDATE waybill SET source_location_warehouse_id=13, waybill_status='IN_PROGRESS' where id between 15 and 16;
UPDATE waybill SET source_location_warehouse_id=14, waybill_status='READY' where id between 17 and 18;
UPDATE waybill SET source_location_warehouse_id=15, waybill_status='FINISHED' where id between 19 and 20;
