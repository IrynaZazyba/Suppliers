--liquibase formatted sql

INSERT INTO `write_off_act_reason` (`reason`) VALUES ("damaged"),("spoiled"),("lost"),("stolen");

INSERT INTO `write_off_act` (`identifier`,`total_sum`,`total_amount`,`date`,`reason_id`,`customer_id`) VALUES ("First1",1856,30,"2020-08-05 09:59:45",1,3),("Second1",8356,25,"2020-02-22 22:15:17",2,3),("Third1",1808,26,"2020-02-14 17:37:10",3,3), ("Fourth1",1808,26,"2020-02-14 17:37:10",4,3);
INSERT INTO `write_off_act` (`identifier`,`total_sum`,`total_amount`,`date`,`reason_id`,`customer_id`) VALUES ("First2",1856,30,"2020-08-05 09:59:45",1,3),("Second2",8356,25,"2020-02-22 22:15:17",2,3),("Third2",1808,26,"2020-02-14 17:37:10",3,3), ("Fourth2",1808,26,"2020-02-14 17:37:10",4,3);
INSERT INTO `write_off_act` (`identifier`,`total_sum`,`total_amount`,`date`,`reason_id`,`customer_id`) VALUES ("First3",1856,30,"2020-08-05 09:59:45",1,3),("Second3",8356,25,"2020-02-22 22:15:17",2,3),("Third3",1808,26,"2020-02-14 17:37:10",3,3), ("Fourth3",1808,26,"2020-02-14 17:37:10",4,3);
INSERT INTO `write_off_act` (`identifier`,`total_sum`,`total_amount`,`date`,`reason_id`,`customer_id`) VALUES ("First4",1856,30,"2020-08-05 09:59:45",1,3),("Second4",8356,25,"2020-02-22 22:15:17",2,3),("Third4",1808,26,"2020-02-14 17:37:10",3,3), ("Fourth4",1808,26,"2020-02-14 17:37:10",4,3);
