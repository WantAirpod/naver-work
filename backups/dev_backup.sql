--
-- PostgreSQL database dump
--

\restrict ouU66DnalDxWGzEXdgCwIktlytoW5ghMwXje1BdAKtSWmxFWSzDyabY9OQC0Fcp

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: favorite_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_links (
    id integer NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: favorite_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.favorite_links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.favorite_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_questions (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text DEFAULT 'general'::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.quiz_questions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quiz_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: task_relations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_relations (
    id integer NOT NULL,
    source_task_id integer NOT NULL,
    target_task_id integer NOT NULL
);


--
-- Name: task_relations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.task_relations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.task_relations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title text NOT NULL,
    ticket_url text NOT NULL,
    ticket_number text NOT NULL,
    description text,
    status text DEFAULT 'in_progress'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    pr_url text,
    completed_at timestamp without time zone,
    is_epic boolean DEFAULT false NOT NULL,
    parent_epic_id integer
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tasks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: todos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    content text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    color text DEFAULT 'yellow'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.todos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.todos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, task_id, content, created_at) FROM stdin;
1	1	디자인팀에서 시안 전달받았습니다. 모바일 반응형 부분 추가 확인 필요합니다.	2026-02-09 11:32:28.440476
2	1	iOS Safari에서 결제 버튼 레이아웃 깨짐 이슈 발견. 디자인팀에 공유 완료.	2026-02-09 11:32:28.440476
3	2	에러 코드별 사용자 안내 메시지 초안 작성 완료. 리뷰 요청드립니다.	2026-02-09 11:32:28.440476
4	3	무이자 할부 정보 API 연동 스펙 확인 완료.	2026-02-09 11:32:28.440476
5	1	테스트 메모입니다	2026-02-09 11:36:06.105863
\.


--
-- Data for Name: favorite_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorite_links (id, title, url, created_at) FROM stdin;
1	Music Playlist	https://www.youtube.com/watch?v=x4fjOVMtAxQ&list=RDx4fjOVMtAxQ&start_radio=1	2026-02-10 02:35:45.808374
\.


--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quiz_questions (id, question, answer, category, created_at) FROM stdin;
2	8080포트 확인하는 방법	lsof -i :8080	Linux	2026-02-13 02:05:15.557404
\.


--
-- Data for Name: task_relations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_relations (id, source_task_id, target_task_id) FROM stdin;
1	1	2
2	1	3
3	2	4
4	7	5
5	7	3
6	2	9
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, title, ticket_url, ticket_number, description, status, priority, created_at, sort_order, pr_url, completed_at, is_epic, parent_epic_id) FROM stdin;
6	테스트 작업 생성	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/9999	9999		completed	medium	2026-02-09 11:37:40.218309	0	\N	\N	f	\N
2	테스트 수정 제목 Hk7yH9	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1823	1823	수정된 설명 내용	in_progress	high	2026-02-09 11:32:28.436118	0	\N	\N	t	\N
3	할부 개월수 선택 기능 추가	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1801	1801	카드 결제 시 할부 개월수를 선택할 수 있는 드롭다운 UI를 추가하고, 무이자 할부 프로모션 정보를 함께 표시합니다.	in_progress	medium	2026-02-09 11:32:28.436118	1	\N	\N	f	2
7	ㅇㅇ	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1754	1754	ㅇㅇ	in_progress	medium	2026-02-09 11:48:26.786504	2	\N	\N	f	\N
9	연관 테스트 작업 dl0oIp	https://oss.fin.navercorp.com/Test/Repo/issues/9999	9999	\N	in_progress	medium	2026-02-10 08:41:06.576093	3	\N	\N	f	\N
4	QA 테스트 케이스 작성 - 결제 프로세스	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1790	1790	카드 결제 전체 프로세스에 대한 QA 테스트 케이스를 작성합니다. 정상/비정상 시나리오 모두 포함.	in_progress	low	2026-02-09 11:32:28.436118	4	\N	\N	f	\N
12	할 일 이닭		TODO	ㅋㅋ	in_progress	medium	2026-03-04 07:48:53.585213	0	\N	\N	f	\N
1	카드 결제 플랜 신규 UI 디자인 검토	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1755	1755	결제 플랜 페이지의 신규 UI 디자인 시안을 검토하고 피드백을 전달합니다. 모바일/데스크탑 반응형 대응 확인 필요.	completed	high	2026-02-09 11:32:28.436118	0	\N	\N	f	2
5	결제 내역 조회 페이지 성능 개선	https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1768	1768	대량 결제 내역 조회 시 페이지 로딩 속도가 느린 문제를 개선합니다. 가상 스크롤링 및 페이지네이션 적용.	completed	medium	2026-02-09 11:32:28.436118	0	\N	\N	f	2
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.todos (id, content, completed, color, created_at) FROM stdin;
4	nelo 해야함	t	yellow	2026-03-04 06:49:08.589944
5	nelo 해야함	f	yellow	2026-03-04 06:49:08.600786
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 5, true);


--
-- Name: favorite_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorite_links_id_seq', 2, true);


--
-- Name: quiz_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quiz_questions_id_seq', 2, true);


--
-- Name: task_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.task_relations_id_seq', 6, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_id_seq', 12, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.todos_id_seq', 5, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: favorite_links favorite_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_links
    ADD CONSTRAINT favorite_links_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: task_relations task_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_relations
    ADD CONSTRAINT task_relations_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict ouU66DnalDxWGzEXdgCwIktlytoW5ghMwXje1BdAKtSWmxFWSzDyabY9OQC0Fcp

