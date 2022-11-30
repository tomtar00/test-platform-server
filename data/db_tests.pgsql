
------------------- SELECT -------------------------
select * from users.accounts;
select * from users.account_permissions;
select * from users.groups;
select * from users.account_groups;

-- paginate
SELECT *, (SELECT COUNT(*) FROM users.accounts) FROM users.accounts OFFSET 0 LIMIT 2

-- user groups
SELECT * FROM users.accounts a
JOIN users.account_groups ac ON a.id = ac.account_id
JOIN users.groups g ON ac.group_id = g.id
WHERE a.id = 3

------------------- INSERT -------------------------
insert into users.accounts values ('student', 'student123', 1);
insert into users.accounts values ('teacher', 'teacher123', 2);
insert into users.accounts values ('admin', 'admin123', 3);

insert into users.account_permissions values (1, false, false, false, false);
insert into users.account_permissions values (2, true, false, false, true);
insert into users.account_permissions values (3, true, true, true, true);

insert into users.groups values ('student', false, false, false, false, 1);
insert into users.groups values ('teacher', true, false, false, true, 2);
insert into users.groups values ('admin', true, true, true, true, 3);

-- student
insert into users.account_groups values (1, 1);
-- teacher
insert into users.account_groups values (2, 1);
insert into users.account_groups values (2, 2);
-- admin
insert into users.account_groups values (3, 1);
insert into users.account_groups values (3, 3);

------------------- ALTER --------------------------

------------------- RESET --------------------------
-- TRUNCATE users.accounts RESTART IDENTITY CASCADE;
-- TRUNCATE users.account_permissions RESTART IDENTITY CASCADE;
-- TRUNCATE users.groups RESTART IDENTITY CASCADE;
-- TRUNCATE users.account_groups RESTART IDENTITY CASCADE;