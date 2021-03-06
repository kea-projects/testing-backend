-- Population script
-- It is meant to be run after sync

-- Roles ---------------------------------------------------------------------
INSERT INTO roles VALUES(1, "teacher");
INSERT INTO roles VALUES(2, "student");

-- Users ---------------------------------------------------------------------

-- Teachers
INSERT INTO users VALUES(1,  'Teacher Bob', 'alex320i@stud.kea.dk',           1);
INSERT INTO users VALUES(2,  'Teacher Ann', 'ann@kea.dk',           1);
INSERT INTO users VALUES(3,  'Teacher Won', 'won@kea.dk',           1);
INSERT INTO users VALUES(4,  'Teacher Tom', 'tom@kea.dk',           1);

-- Students
INSERT INTO users VALUES(6,  'Student Ada', 'cris2041@stud.kea.dk', 2);
INSERT INTO users VALUES(7,  'Student Pam', 'pam@stud.kea.dk', 2);
INSERT INTO users VALUES(8,  'Student Kit', 'kit@stud.kea.dk', 2);
INSERT INTO users VALUES(9,  'Student Zoe', 'zoe@stud.kea.dk', 2);
INSERT INTO users VALUES(10,  'Student Ray', 'ray@stud.kea.dk', 2);
INSERT INTO users VALUES(11, 'Student Alf', 'alf@stud.kea.dk', 2);
INSERT INTO users VALUES(12, 'Student Coy', 'coy@stud.kea.dk', 2);
INSERT INTO users VALUES(13, 'Student Gil', 'gil@stud.kea.dk', 2);

-- Classes ---------------------------------------------------------------------
INSERT INTO classes VALUES(1, "SW20");
INSERT INTO classes VALUES(2, "WD20");
INSERT INTO classes VALUES(3, "SW21");
INSERT INTO classes VALUES(4, "WD21");
INSERT INTO classes VALUES(5, "SW22");
INSERT INTO classes VALUES(6, "WD22");

-- Subjects --------------------------------------------------------------------
INSERT INTO subjects VALUES(1,  "Testing SW20",         1, 1);
INSERT INTO subjects VALUES(2,  "Testing SW21",         1, 3);
INSERT INTO subjects VALUES(3,  "Testing SW22",         1, 5);
INSERT INTO subjects VALUES(4,  "Web Development WD20", 2, 2);
INSERT INTO subjects VALUES(5,  "Web Development WD21", 2, 4);
INSERT INTO subjects VALUES(6,  "Web Development WD22", 2, 6);
INSERT INTO subjects VALUES(7,  "Databases SW20",       3, 1);
INSERT INTO subjects VALUES(8,  "Databases SW21",       3, 3);
INSERT INTO subjects VALUES(9,  "Databases SW22",       3, 5);
INSERT INTO subjects VALUES(10, "Large Systems SW20",   4, 1);
INSERT INTO subjects VALUES(11, "Large Systems SW21",   4, 3);
INSERT INTO subjects VALUES(12, "Large Systems SW22",   4, 5);

-- Lectures --------------------------------------------------------------------
INSERT INTO lectures VALUES(1, "Not Learning Microservices 1", '2022-06-06 13:14',  ('2022-06-06 13:14' + interval  90 minute), 12);
INSERT INTO lectures VALUES(2, "Not Learning Microservices 2", '2022-06-06 13:18',  ('2022-06-06 13:18' + interval 180 minute), 12);
INSERT INTO lectures VALUES(3, "Not Learning Microservices 3", '2022-06-06 13:22',  ('2022-06-06 13:22' + interval 270 minute), 12);
INSERT INTO lectures VALUES(4, "NoSQL 1",                      '2022-06-06 13:26',  ('2022-06-06 13:26' + interval  90 minute),  9);
INSERT INTO lectures VALUES(5, "NoSQL 2",                      '2022-06-06 13:30',  ('2022-06-06 13:30' + interval 180 minute),  9);
INSERT INTO lectures VALUES(6, "NoSQL 3",                      '2022-06-06 13:34',  ('2022-06-06 13:34' + interval 270 minute),  9);
INSERT INTO lectures VALUES(7, "Unit Testing",                 '2022-06-06 13:40',  ('2022-06-06 13:40' + interval  90 minute),  3);
INSERT INTO lectures VALUES(8, "Unit Testing",                 '2022-06-06 13:44',  ('2022-06-06 13:44' + interval 180 minute),  3);
INSERT INTO lectures VALUES(9, "Unit Testing",                 '2022-06-06 13:50',  ('2022-06-06 13:50' + interval 270 minute),  3);

-- Attendance -------------------------------------------------------------------
INSERT INTO attendances VALUES(1,  '2022-06-06 13:14',        	1, 5);
INSERT INTO attendances VALUES(2,  '2022-06-06 13:14',          1, 6);
INSERT INTO attendances VALUES(3,  '2022-06-06 13:14',          1, 7);
INSERT INTO attendances VALUES(4,  '2022-06-06 13:14',          1, 8);
INSERT INTO attendances VALUES(5,  '2022-06-06 13:14',          1, 9);
INSERT INTO attendances VALUES(6,  '2022-06-06 13:14',  				2, 5);
INSERT INTO attendances VALUES(7,  '2022-06-06 13:14',  				2, 6);
INSERT INTO attendances VALUES(8,  '2022-06-06 13:14',  				2, 7);
INSERT INTO attendances VALUES(9,  '2022-06-06 13:14',  				2, 8);
INSERT INTO attendances VALUES(10, '2022-06-06 13:14',  				2, 5);
INSERT INTO attendances VALUES(11, '2022-06-06 13:14', 					2, 5);
INSERT INTO attendances VALUES(12, '2022-06-06 13:14', 					2, 6);
INSERT INTO attendances VALUES(13, '2022-06-06 13:14', 					2, 7);

