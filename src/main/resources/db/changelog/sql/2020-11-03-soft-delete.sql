--liquibase formatted sql
alter table user drop COLUMN deleted;
alter table user add deleted_at DATE NULL;
alter table warehouse add deleted_at DATE NULL;
alter table retailer add active boolean;
alter table retailer add deleted_at DATE NULL;
alter table user modify COLUMN active boolean;
alter table car add deleted_at DATE NULL;
