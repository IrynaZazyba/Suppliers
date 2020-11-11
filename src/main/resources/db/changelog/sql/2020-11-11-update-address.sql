--liquibase formatted sql
UPDATE address SET state_id=4 WHERE id=3;
DELETE FROM state WHERE id=3;