--liquibase formatted sql
UPDATE waybill SET source_location_warehouse_id=null;
