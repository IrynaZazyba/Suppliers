--liquibase formatted sql
--changeset iryna_zazybo:IN-CSA-1 splitStatements:true endDelimiter:;
insert into customer (id, name, registration_date, status) values (3, 'SystemCompany', '2020-10-19', 'active');
insert into zone (id, location) values (3, 'NY');
insert into address (id, state, city, address_line_1, address_line_2, zone_id ) values (3, 'USA', 'NY','Lexington Avenue', 'Slobodskaya str.', 3);
insert into public.user (name, surname, birthday, username, password, email, role, address_id, customer_id, is_active ) values ('Bob', 'Roberts', '1990-10-15', 'admin', '$2a$10$EpyybZabF5N7YfgTS5J8Y.tHK4eF4bRa9Xpf1D0FLD0CZ9AFaNWTG', 'zazybo1.17@gmail.com', 'ROLE_SYSTEM_ADMIN', 3,3, true);
