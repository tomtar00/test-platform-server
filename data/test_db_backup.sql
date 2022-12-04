--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY users.groups DROP CONSTRAINT groups_pkey;
ALTER TABLE ONLY users.accounts DROP CONSTRAINT accounts_pkey;
ALTER TABLE ONLY tests.results DROP CONSTRAINT results_pkey;
ALTER TABLE ONLY tests.questions DROP CONSTRAINT questions_pkey;
ALTER TABLE ONLY tests.headers DROP CONSTRAINT headers_pkey;
ALTER TABLE ONLY tests.answers DROP CONSTRAINT answers_pkey;
ALTER TABLE users.groups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users.accounts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tests.results ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tests.questions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tests.headers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tests.answers ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE users.groups_id_seq;
DROP TABLE users.groups;
DROP SEQUENCE users.accounts_id_seq;
DROP TABLE users.accounts;
DROP TABLE users.account_permissions;
DROP TABLE users.account_groups;
DROP SEQUENCE tests.results_id_seq;
DROP TABLE tests.results;
DROP SEQUENCE tests.questions_id_seq;
DROP TABLE tests.questions;
DROP SEQUENCE tests.headers_id_seq;
DROP TABLE tests.headers;
DROP SEQUENCE tests.answers_id_seq;
DROP TABLE tests.answers;
DROP SCHEMA users;
DROP SCHEMA tests;
--
-- Name: tests; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tests;


ALTER SCHEMA tests OWNER TO postgres;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answers; Type: TABLE; Schema: tests; Owner: postgres
--

CREATE TABLE tests.answers (
    question_id integer NOT NULL,
    test_id integer NOT NULL,
    user_id integer NOT NULL,
    given_answer_idx integer[],
    id integer NOT NULL
);


ALTER TABLE tests.answers OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: tests; Owner: postgres
--

CREATE SEQUENCE tests.answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tests.answers_id_seq OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: tests; Owner: postgres
--

ALTER SEQUENCE tests.answers_id_seq OWNED BY tests.answers.id;


--
-- Name: headers; Type: TABLE; Schema: tests; Owner: postgres
--

CREATE TABLE tests.headers (
    test_name character varying NOT NULL,
    groups integer[],
    start_time character varying,
    end_time character varying,
    id integer NOT NULL
);


ALTER TABLE tests.headers OWNER TO postgres;

--
-- Name: headers_id_seq; Type: SEQUENCE; Schema: tests; Owner: postgres
--

CREATE SEQUENCE tests.headers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tests.headers_id_seq OWNER TO postgres;

--
-- Name: headers_id_seq; Type: SEQUENCE OWNED BY; Schema: tests; Owner: postgres
--

ALTER SEQUENCE tests.headers_id_seq OWNED BY tests.headers.id;


--
-- Name: questions; Type: TABLE; Schema: tests; Owner: postgres
--

CREATE TABLE tests.questions (
    test_id integer NOT NULL,
    question character varying NOT NULL,
    answers character varying[] NOT NULL,
    correct_answer_idx integer[] NOT NULL,
    id integer NOT NULL
);


ALTER TABLE tests.questions OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: tests; Owner: postgres
--

CREATE SEQUENCE tests.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tests.questions_id_seq OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: tests; Owner: postgres
--

ALTER SEQUENCE tests.questions_id_seq OWNED BY tests.questions.id;


--
-- Name: results; Type: TABLE; Schema: tests; Owner: postgres
--

CREATE TABLE tests.results (
    test_id integer NOT NULL,
    test_name character varying NOT NULL,
    user_id integer NOT NULL,
    user_name character varying NOT NULL,
    points integer NOT NULL,
    max_points integer NOT NULL,
    date character varying NOT NULL,
    id integer NOT NULL
);


ALTER TABLE tests.results OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE; Schema: tests; Owner: postgres
--

CREATE SEQUENCE tests.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tests.results_id_seq OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE OWNED BY; Schema: tests; Owner: postgres
--

ALTER SEQUENCE tests.results_id_seq OWNED BY tests.results.id;


--
-- Name: account_groups; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.account_groups (
    account_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE users.account_groups OWNER TO postgres;

--
-- Name: account_permissions; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.account_permissions (
    account_id integer NOT NULL,
    can_manage_tests boolean NOT NULL,
    can_manage_permissions boolean NOT NULL,
    can_access_admin_panel boolean NOT NULL,
    can_view_stats boolean NOT NULL
);


ALTER TABLE users.account_permissions OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.accounts (
    account_name character varying NOT NULL,
    password character varying NOT NULL,
    id integer NOT NULL
);


ALTER TABLE users.accounts OWNER TO postgres;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: users; Owner: postgres
--

CREATE SEQUENCE users.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users.accounts_id_seq OWNER TO postgres;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: postgres
--

ALTER SEQUENCE users.accounts_id_seq OWNED BY users.accounts.id;


--
-- Name: groups; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.groups (
    group_name character varying NOT NULL,
    can_manage_tests boolean NOT NULL,
    can_manage_permissions boolean NOT NULL,
    can_access_admin_panel boolean NOT NULL,
    can_view_stats boolean NOT NULL,
    id integer NOT NULL
);


ALTER TABLE users.groups OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: users; Owner: postgres
--

CREATE SEQUENCE users.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: postgres
--

ALTER SEQUENCE users.groups_id_seq OWNED BY users.groups.id;


--
-- Name: answers id; Type: DEFAULT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.answers ALTER COLUMN id SET DEFAULT nextval('tests.answers_id_seq'::regclass);


--
-- Name: headers id; Type: DEFAULT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.headers ALTER COLUMN id SET DEFAULT nextval('tests.headers_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.questions ALTER COLUMN id SET DEFAULT nextval('tests.questions_id_seq'::regclass);


--
-- Name: results id; Type: DEFAULT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.results ALTER COLUMN id SET DEFAULT nextval('tests.results_id_seq'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.accounts ALTER COLUMN id SET DEFAULT nextval('users.accounts_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.groups ALTER COLUMN id SET DEFAULT nextval('users.groups_id_seq'::regclass);


--
-- Data for Name: answers; Type: TABLE DATA; Schema: tests; Owner: postgres
--

COPY tests.answers (question_id, test_id, user_id, given_answer_idx, id) FROM stdin;
1	1	1	{0}	1
2	1	1	{1}	2
3	1	1	{0,1,2}	3
1	1	2	{1}	4
2	1	2	{1}	5
3	1	2	{0,1}	6
4	2	1	{1}	7
5	2	1	{1}	8
6	3	2	{0}	9
7	3	2	{1}	10
8	4	3	{0}	11
9	4	3	{1}	12
\.


--
-- Data for Name: headers; Type: TABLE DATA; Schema: tests; Owner: postgres
--

COPY tests.headers (test_name, groups, start_time, end_time, id) FROM stdin;
test_1	\N	\N	\N	1
test_2	{1}	\N	\N	2
test_3	\N	1670077490057	1670079000000	3
test_4	{2,3}	1670077490057	1670079000000	4
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: tests; Owner: postgres
--

COPY tests.questions (test_id, question, answers, correct_answer_idx, id) FROM stdin;
1	How many?	{0,1,2}	{0}	1
1	Yes?	{No,Yes}	{1}	2
1	All good?	{All,are,good}	{0,1,2}	3
2	How many?	{0,1,2}	{0}	4
2	Yes?	{No,Yes}	{1}	5
3	How many?	{0,1,2}	{0}	6
3	Yes?	{No,Yes}	{1}	7
4	How many?	{0,1,2}	{0}	8
4	Yes?	{No,Yes}	{1}	9
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: tests; Owner: postgres
--

COPY tests.results (test_id, test_name, user_id, user_name, points, max_points, date, id) FROM stdin;
1	test_1	1	student	3	3	1670078785067	1
1	test_1	2	teacher	1	3	1670079546787	2
2	test_2	1	student	1	2	1670082997576	3
3	test_3	2	teacher	2	2	1670085089437	4
4	test_4	3	admin	2	2	1670091945683	5
\.


--
-- Data for Name: account_groups; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY users.account_groups (account_id, group_id) FROM stdin;
1	1
2	1
2	2
3	1
3	3
\.


--
-- Data for Name: account_permissions; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY users.account_permissions (account_id, can_manage_tests, can_manage_permissions, can_access_admin_panel, can_view_stats) FROM stdin;
1	f	f	f	f
2	t	f	f	t
3	t	t	t	t
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY users.accounts (account_name, password, id) FROM stdin;
student	student123	1
teacher	teacher123	2
admin	admin123	3
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY users.groups (group_name, can_manage_tests, can_manage_permissions, can_access_admin_panel, can_view_stats, id) FROM stdin;
student	f	f	f	f	1
teacher	t	f	f	t	2
admin	t	t	t	t	3
\.


--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: tests; Owner: postgres
--

SELECT pg_catalog.setval('tests.answers_id_seq', 12, true);


--
-- Name: headers_id_seq; Type: SEQUENCE SET; Schema: tests; Owner: postgres
--

SELECT pg_catalog.setval('tests.headers_id_seq', 4, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: tests; Owner: postgres
--

SELECT pg_catalog.setval('tests.questions_id_seq', 9, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: tests; Owner: postgres
--

SELECT pg_catalog.setval('tests.results_id_seq', 5, true);


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: users; Owner: postgres
--

SELECT pg_catalog.setval('users.accounts_id_seq', 3, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: users; Owner: postgres
--

SELECT pg_catalog.setval('users.groups_id_seq', 3, true);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: headers headers_pkey; Type: CONSTRAINT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.headers
    ADD CONSTRAINT headers_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: results results_pkey; Type: CONSTRAINT; Schema: tests; Owner: postgres
--

ALTER TABLE ONLY tests.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

