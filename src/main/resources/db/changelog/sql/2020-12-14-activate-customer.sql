--liquibase formatted sql
UPDATE customer set active=true where id=65;
