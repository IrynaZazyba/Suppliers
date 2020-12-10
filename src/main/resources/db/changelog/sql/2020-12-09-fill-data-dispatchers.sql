--liquibase formatted sql

INSERT INTO `user` (`name`,`surname`,`birthday`,`username`,`password`,`email`,`active`,`role`,`address_id`,`customer_id`) VALUES ("Harry","Potter","1974-06-08 18:34:52","harry potter","$2a$10$EpyybZabF5N7YfgTS5J8Y.tHK4eF4bRa9Xpf1D0FLD0CZ9AFaNWTG","harry_potter@gmail.com",true,"ROLE_DISPATCHER",3,3);
INSERT INTO `user` (`name`,`surname`,`birthday`,`username`,`password`,`email`,`active`,`role`,`address_id`,`customer_id`) VALUES ("Ron","Weasley","1974-06-08 18:34:52","ron weasley","$2a$10$EpyybZabF5N7YfgTS5J8Y.tHK4eF4bRa9Xpf1D0FLD0CZ9AFaNWTG","ron_weasley@gmail.com",true,"ROLE_DISPATCHER",3,3);
INSERT INTO `user` (`name`,`surname`,`birthday`,`username`,`password`,`email`,`active`,`role`,`address_id`,`customer_id`) VALUES ("Hermione ","Granger","1974-06-08 18:34:52","hermione granger","$2a$10$EpyybZabF5N7YfgTS5J8Y.tHK4eF4bRa9Xpf1D0FLD0CZ9AFaNWTG","hermione_granger@gmail.com",true,"ROLE_DISPATCHER",3,3);
