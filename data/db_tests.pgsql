
------------------- SELECT -------------------------
select * from users.accounts;
select * from users.account_permissions;
select * from users.groups;
select * from users.account_groups;
select * from tests.headers;

-- paginate
select *, (select count(*) from users.accounts) from users.accounts offset 0 limit 2

-- user groups
select * from users.accounts a
join users.account_groups ac on a.id = ac.account_id
join users.groups g on ac.group_id = g.id
where a.id = 3

------------------- INSERT -------------------------
---- accounts
insert into users.accounts (account_name, password) values ('student', 'student123');
insert into users.accounts (account_name, password) values ('teacher', 'teacher123');
insert into users.accounts (account_name, password) values ('admin', 'admin123');

---- account permissions
insert into users.account_permissions values (1, false, false, false, false);
insert into users.account_permissions values (2, true, false, false, true);
insert into users.account_permissions values (3, true, true, true, true);

---- groups
insert into users.groups (group_name, can_manage_tests, can_manage_permissions, can_access_admin_panel, can_view_stats) values ('student', false, false, false, false);
insert into users.groups (group_name, can_manage_tests, can_manage_permissions, can_access_admin_panel, can_view_stats) values ('teacher', true, false, false, true);
insert into users.groups (group_name, can_manage_tests, can_manage_permissions, can_access_admin_panel, can_view_stats) values ('admin', true, true, true, true);

---- accounts groups
-- student
insert into users.account_groups values (1, 1);
-- teacher
insert into users.account_groups values (2, 1);
insert into users.account_groups values (2, 2);
-- admin
insert into users.account_groups values (3, 1);
insert into users.account_groups values (3, 3);

---- headers
insert into tests.headers (test_name, groups, start_time, end_time) values ('test_1', null, null, null);
insert into tests.headers (test_name, groups, start_time, end_time) values ('test_2', array[1], null, null);
insert into tests.headers (test_name, groups, start_time, end_time) values ('test_3', null, '1670077490057', '1670079000000');
insert into tests.headers (test_name, groups, start_time, end_time) values ('test_4', array[2, 3], '1670077490057', '1670079000000');

---- questions
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (1, 'How many?', array['0', '1', '2'], array[0]);
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (1, 'Yes?', array['No', 'Yes'], array[1]);
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (1, 'All good?', array['All', 'are', 'good'], array[0, 1, 2]);

insert into tests.questions (test_id, question, answers, correct_answer_idx) values (2, 'How many?', array['0', '1', '2'], array[0]);
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (2, 'Yes?', array['No', 'Yes'], array[1]);

insert into tests.questions (test_id, question, answers, correct_answer_idx) values (3, 'How many?', array['0', '1', '2'], array[0]);
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (3, 'Yes?', array['No', 'Yes'], array[1]);

insert into tests.questions (test_id, question, answers, correct_answer_idx) values (4, 'How many?', array['0', '1', '2'], array[0]);
insert into tests.questions (test_id, question, answers, correct_answer_idx) values (4, 'Yes?', array['No', 'Yes'], array[1]);

---- answers
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (1, 1, 1, array[0]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (2, 1, 1, array[1]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (3, 1, 1, array[0, 1, 2]);

insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (1, 1, 2, array[1]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (2, 1, 2, array[1]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (3, 1, 2, array[0, 1]);

insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (4, 2, 1, array[1]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (5, 2, 1, array[1]);

insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (6, 3, 2, array[0]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (7, 3, 2, array[1]);

insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (8, 4, 3, array[0]);
insert into tests.answers (question_id, test_id, user_id, given_answer_idx) values (9, 4, 3, array[1]);

---- results
insert into tests.results (test_id, test_name, user_id, user_name, points, max_points, date) values (1, 'test_1', 1, 'student', 3, 3, '1670078785067');
insert into tests.results (test_id, test_name, user_id, user_name, points, max_points, date) values (1, 'test_1', 2, 'teacher', 1, 3, '1670079546787');
insert into tests.results (test_id, test_name, user_id, user_name, points, max_points, date) values (2, 'test_2', 1, 'student', 1, 2, '1670082997576');
insert into tests.results (test_id, test_name, user_id, user_name, points, max_points, date) values (3, 'test_3', 2, 'teacher', 2, 2, '1670085089437');
insert into tests.results (test_id, test_name, user_id, user_name, points, max_points, date) values (4, 'test_4', 3, 'admin', 2, 2, '1670091945683');

------------------- ALTER --------------------------

------------------- RULES --------------------------
CREATE OR REPLACE RULE delete_test_questions AS ON DELETE TO tests.headers DO ALSO (
    DELETE FROM tests.questions WHERE test_id = OLD.id;
);
CREATE OR REPLACE RULE delete_user_groups_permissions AS ON DELETE TO users.accounts DO ALSO (
    DELETE FROM users.account_groups WHERE account_id = OLD.id;
    DELETE FROM users.account_permissions WHERE account_id = OLD.id;
);

------------------- RESET --------------------------
TRUNCATE users.accounts RESTART IDENTITY CASCADE;
TRUNCATE users.account_permissions RESTART IDENTITY CASCADE;
TRUNCATE users.groups RESTART IDENTITY CASCADE;
TRUNCATE users.account_groups RESTART IDENTITY CASCADE;

TRUNCATE tests.headers RESTART IDENTITY CASCADE;
TRUNCATE tests.questions RESTART IDENTITY CASCADE;
TRUNCATE tests.answers RESTART IDENTITY CASCADE;
TRUNCATE tests.results RESTART IDENTITY CASCADE;