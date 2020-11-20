--liquibase formatted sql
UPDATE warehouse SET type='FACTORY' where id between 1 and 7;
UPDATE warehouse SET type='WAREHOUSE' where id between 8 and 15;
UPDATE warehouse SET type='RETAILER' where id between 16 and 20;
