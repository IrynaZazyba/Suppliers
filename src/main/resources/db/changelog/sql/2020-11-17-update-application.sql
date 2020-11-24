--liquibase formatted sql
UPDATE application SET source_location_warehouse_id=null;
UPDATE application SET destination_location_warehouse_id=null;
