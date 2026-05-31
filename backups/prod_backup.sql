-- Production DB Backup
-- Generated: 2026-05-31T07:00:12.232Z

SET client_encoding = 'UTF8';

-- Table: tasks (104 rows)
TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (7, '[사전조회] 카드 브랜드, 소유주 타입 획득 로직 일원화', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1644', '1644', NULL, 'active', 'high', 0, NULL, false, NULL, '2026-02-09 13:53:47.04281', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (9, '[사전조회] BIN / 등록 여부 매핑', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1755', '1755', '유종의 미...', 'active', 'medium', 6, NULL, false, NULL, '2026-02-10 06:35:51.376391', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (10, '[NextDcb] 특정 계정 CPH 통지보낼 수 있도록', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1754', '1754', 'DCB에서 꺽은거...', 'active', 'high', 5, NULL, false, NULL, '2026-02-10 06:36:16.929175', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (12, '[페이스사인] nPay 원장 삭제시, 동일카드 페이스사인 원장 삭제', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1726', '1726', NULL, 'completed', 'high', 3, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/507', false, NULL, '2026-02-10 06:37:16.323349', '2026-03-07 01:38:49.798');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (13, '[페이스사인] 통지 재시도', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1670', '1670', '[페이스사인] 통지 재시도', 'completed', 'high', 4, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pulls', false, NULL, '2026-02-10 06:42:18.639212', '2026-03-06 07:53:40.89');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (14, '[사전 조회] 비씨카드 & 국민카드 사전조회 수정', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1690', '1690', NULL, 'active', 'medium', 7, NULL, false, NULL, '2026-02-10 06:44:00.319782', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (15, '[페이스사인] 단건 (대표결제수단 설정된 카드) 조회 api 신설', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1770', '1770', NULL, 'completed', 'high', 1, NULL, false, NULL, '2026-02-11 08:22:59.574282', '2026-03-06 07:51:40.041');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (16, '[페이스사인] 롯데카드 VC 추가', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1689', '1689', 'alpha 적용 완료 및 테스트 완료', 'completed', 'high', 2, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/512', false, NULL, '2026-02-12 05:41:34.981987', '2026-03-05 02:14:45.41');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (19, '[페이스사인] 삭제 실패 상태 관리 및 삭제 재시도 논의', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1771', '1771', NULL, 'completed', 'medium', 0, NULL, false, NULL, '2026-02-12 05:45:24.930923', '2026-04-13 11:19:48.218');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (20, '[NextDcb] 알파환경 테스트카드 설정 리소스 감소를 위한 논의', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1756', '1756', NULL, 'in_progress', 'medium', 13, NULL, false, NULL, '2026-02-12 05:46:00.74718', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (21, '[전문이관] 사전조회 등록여부 값 매핑 변경 & BIN 번호 노출 ', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1755', '1755', NULL, 'completed', 'high', 5, NULL, false, NULL, '2026-02-12 05:47:18.79308', '2026-03-05 02:14:29.066');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (22, '[NextDcb] 특정 계정 CPH 통지보낼 수 있도록', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1754', '1754', 'CBT 작업', 'completed', 'high', 1, 'https://oss.fin.navercorp.com/CardPayment/api/pull/2619', false, NULL, '2026-02-12 05:47:49.516015', '2026-02-26 02:54:16.604');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (23, '[NextDcb] N15A 통지 이관 (TCP -> CPH) ⭐️ EPIC', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1748', '1748', NULL, 'completed', 'high', 3, NULL, false, NULL, '2026-02-12 05:52:28.215017', '2026-03-05 02:14:22.24');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (24, '[페이스사인] nPay 원장 삭제시, 동일카드 페이스사인 원장 삭제 ', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1726', '1726', NULL, 'completed', 'high', 5, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/507', false, NULL, '2026-02-12 05:53:36.830179', '2026-03-05 02:14:54.487');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (25, '[페이스사인] 단건 (대표결제수단 설정된 카드) 조회 api 신설 ', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1770', '1770', NULL, 'completed', 'high', 3, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/509', false, NULL, '2026-02-12 05:54:49.320524', '2026-03-05 02:14:48.128');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (27, '[CPH] 카드 브랜드, 소유주 타입 획득 로직 일원화', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1644', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1644 ', '급급급!!', 'completed', 'high', 7, NULL, false, NULL, '2026-02-20 09:27:16.46055', '2026-03-05 02:14:59.209');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (28, '삼성카드 FACESIGN', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1785', '1785', NULL, 'completed', 'high', 5, NULL, false, NULL, '2026-02-22 04:26:44.561726', '2026-03-05 02:14:56.662');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (29, '[페이스사인]', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1432', '1432', NULL, 'completed', 'high', 8, NULL, true, NULL, '2026-02-22 04:27:50.615603', '2026-05-13 07:21:10.926');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (30, '통지 재시도', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1670', '1670', NULL, 'completed', 'high', 4, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/496', false, NULL, '2026-02-23 06:53:08.986968', '2026-03-05 02:14:26.028');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (31, 'FACESIGN 비씨카드 인터페이스 수정', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1590', '1590', NULL, 'completed', 'high', 3, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/520', false, NULL, '2026-02-24 00:48:12.715619', '2026-04-01 05:15:19.777');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (32, '문의 답변 필요', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1816', '1816', '-_-', 'completed', 'low', 6, NULL, false, NULL, '2026-02-25 09:14:30.308505', '2026-04-16 08:11:56.245');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (33, '로깅처리 개발하기', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/9999', '9999', '승인번호 입력 시 모든 로그가 다 보여야한다.', 'completed', 'medium', 3, NULL, false, NULL, '2026-02-25 09:59:01.541185', '2026-03-05 10:22:25.093');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (34, '[현대백화점카드] ACL 현백작업', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1797', '1797', NULL, 'completed', 'low', 4, NULL, false, 37, '2026-03-03 07:03:53.119455', '2026-04-16 01:05:31.578');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (35, '문의 답변 필요', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1816', '1816', '-_-', 'completed', 'low', 5, NULL, false, NULL, '2026-03-03 09:20:34.824169', '2026-04-16 08:11:53.967');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (36, '[현대백화점 카드] 복호화 샘플 준비', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1817', '1817', '현백에 전달할 복호화 샘플을 준비', 'completed', 'medium', 0, NULL, false, NULL, '2026-03-03 11:32:15.518408', '2026-03-14 02:10:33.738');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (37, '[현대백화점 네이버페이 연동]', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1474', '1474', NULL, 'completed', 'high', 6, NULL, true, NULL, '2026-03-05 10:09:52.957079', '2026-05-13 07:21:15.456');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (38, '[NextDcb] 인증 히스토리 조회 쿼리 개선', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1832', '1832', NULL, 'in_progress', 'high', 11, 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2001', false, NULL, '2026-03-05 10:22:15.415888', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (39, '[NextDcb] 재시도 실패건 케이스 파악', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1829', '1829', NULL, 'review', 'high', 15, NULL, false, NULL, '2026-03-05 10:25:41.846988', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (40, '[현대백화점카드] 등록', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1823', '1823', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-05 10:26:14.92291', '2026-04-16 01:04:34.17');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (41, '[현대백화점카드] 인증', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1824', '1824', NULL, 'completed', 'high', 0, 'https://oss.fin.navercorp.com/CardPayment/api/pull/2654', false, 37, '2026-03-05 10:27:48.675312', '2026-04-16 01:04:37.999');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (42, '[현대백화점카드] 삭제(해지)', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1842', '1842', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-08 08:08:16.213517', '2026-04-16 01:04:42.815');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (43, '[페이스사인] 해지 시 다 건 삭제 ', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1851', '1851', NULL, 'completed', 'high', 2, NULL, false, NULL, '2026-03-10 05:10:37.392388', '2026-03-23 13:56:47.575');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (44, '[현대백화점카드] 사전조회', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1858', '1858', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-11 05:08:37.033923', '2026-04-16 01:04:46.603');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (45, '[현대백화점카드] 카드코드추가작업', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1863', '1863', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-11 11:59:17.837314', '2026-04-16 01:04:50.138');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (46, '[현대백화점 네이버페이 연동]', NULL, 'TODO', 'https://test-card.pay.naver.com/simplepay/management', 'completed', 'high', 3, NULL, false, 37, '2026-03-12 07:01:20.112609', '2026-04-16 08:11:41.271');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (47, '[현대백화점] tcp-gw 연동 작업', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1864', '1864', NULL, 'completed', 'high', 2, NULL, false, 37, '2026-03-13 09:17:15.385174', '2026-04-16 01:05:20.009');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (48, '[현대백화점카드] N16A DCB 분기', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1870', '1870', 'DCB 분기 처리 CPH relay 하기', 'completed', 'high', 0, NULL, false, 37, '2026-03-16 13:29:30.059983', '2026-04-16 01:04:53.261');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (49, '[현대백화점 네이버페이 연동] 길이 관련 문의 하고 고치기', NULL, 'TODO', NULL, 'completed', 'medium', 4, NULL, false, NULL, '2026-03-17 09:44:37.798843', '2026-03-26 11:39:49.177');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (51, '[페이스사인] issue 로그삭제', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1909', '1909', ' 로그 무한하게 찍히는 중', 'completed', 'high', 2, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/558', false, NULL, '2026-03-18 11:10:03.771006', '2026-04-01 05:15:15.192');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (52, '[현대백화점카드] cvc validation 추가', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1896', '1896', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-20 13:41:26.17727', '2026-04-16 01:04:57.901');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (53, '[현대백화점카드] 온라인 empty 처리', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1879', '1879', '[완료[', 'completed', 'high', 0, NULL, false, 37, '2026-03-20 13:44:16.867184', '2026-04-16 01:05:04.352');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (54, '[현대백화점] 이미지 등록', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1941', '1941', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-23 08:35:54.078991', '2026-04-16 01:05:07.506');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (55, '[현대백화점카드] N15A 오프라인 통지', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1923', '1923', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-23 14:01:02.302104', '2026-04-16 01:05:10.254');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (56, '[페이스사인] 등록 카드 일괄 삭제', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1677', '1677', NULL, 'completed', 'high', 0, 'https://oss.fin.navercorp.com/CardPayment/api/pull/2641', false, 29, '2026-03-23 14:08:53.401596', '2026-04-01 05:15:15.125');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (57, '[현대백화점] 현대백화점 가맹점 등록 이슈', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1879', '1879', NULL, 'completed', 'high', 0, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/543', false, 37, '2026-03-25 08:30:00.222041', '2026-04-16 01:05:13.125');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (58, '[현대백화점카드] 결제형 지원', 'https://oss.fin.navercorp.com/Product-Planning/Offline-Payment_Plan/issues/951', '951', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-03-26 06:52:36.231038', '2026-04-16 01:05:16.849');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (59, '🚨 페이스사인 삭제 관련 리뷰 수정하기', NULL, 'TODO', 'https://oss.fin.navercorp.com/CardPayment/api/pull/2641', 'completed', 'medium', 0, NULL, false, NULL, '2026-03-26 13:27:44.584481', '2026-04-01 05:15:57.331');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (60, '[QA] 페이스사인', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1991', '1991', NULL, 'completed', 'high', 0, NULL, false, NULL, '2026-04-12 07:50:20.125304', '2026-04-13 11:19:41.027');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (61, '4/13 배포 전 Todo 정리', NULL, 'TODO', NULL, 'review', 'high', 17, NULL, false, NULL, '2026-04-12 07:55:04.415014', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (62, '[현대백화점카드] 온오프라인 config 구분', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2011', '2011', NULL, 'completed', 'high', 0, NULL, false, 37, '2026-04-22 05:28:07.326677', '2026-04-29 06:59:37.347');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (63, '[페이스사인] 발급사전조회-카드사협의', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2010', '2010', NULL, 'completed', 'high', 8, NULL, false, NULL, '2026-04-22 05:32:20.210263', '2026-05-27 10:08:49.413');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (64, '[페이스사인] 발급사전조회-kb대응', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2026', '2026', NULL, 'completed', 'high', 9, NULL, false, NULL, '2026-04-22 05:32:49.855598', '2026-05-27 10:08:53.049');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (65, '[페이스사인] 발급사전조회 - 삼성카드 대응', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2033', '2033', NULL, 'completed', 'high', 10, NULL, false, NULL, '2026-04-22 05:33:17.478551', '2026-05-27 10:08:56.413');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (66, '[on-call] N15A 전문의 일회용컵 금액이 올바르지 않습니다', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2077', '2077', NULL, 'completed', 'high', 7, NULL, false, NULL, '2026-04-29 09:57:34.557273', '2026-05-06 07:51:58.829');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (67, '[사전조회] 롯데카드 tid 변경', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2076', '2076', NULL, 'completed', 'high', 9, NULL, false, NULL, '2026-04-29 09:58:03.742878', '2026-05-13 07:19:43.115');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (68, '[사업자결제] 무기명 법인 카드 등록/관리 페이지 구현', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2069', '2069', NULL, 'in_progress', 'high', 5, NULL, false, NULL, '2026-04-29 09:58:34.802747', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (69, '[해지카드관리] 삼성카드 사전조회 응답전문내 대체카드번호 필드 추가 검토', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2033', '2033', NULL, 'in_progress', 'high', 0, NULL, false, 72, '2026-04-29 09:59:01.207306', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (70, '[on-call]  N15A 전문의 가맹점 명이 올바르지 않습니다', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2032', '2032', NULL, 'completed', 'high', 10, NULL, false, NULL, '2026-04-29 09:59:26.673314', '2026-05-24 04:05:28.351');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (71, '[현대백화점카드] 카드사 config 온/오프라인 구분', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2011', '2011', NULL, 'completed', 'high', 11, NULL, false, NULL, '2026-04-29 09:59:53.474096', '2026-05-13 07:21:02.153');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (72, '[해지카드관리]', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2010', '2010', NULL, 'completed', 'high', 14, NULL, true, NULL, '2026-04-29 10:00:14.405888', '2026-05-24 04:05:23.83');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (73, '회고록 작성하기 - 현대백화점카드', NULL, 'TODO', NULL, 'in_progress', 'high', 6, NULL, false, NULL, '2026-05-04 13:14:05.091941', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (74, '회고록 작성하기 - 페이스사인', NULL, 'TODO', NULL, 'in_progress', 'high', 7, NULL, false, NULL, '2026-05-04 13:14:18.150073', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (75, '목표 설정 - 수정하기', NULL, 'TODO', 'AI 실행 계획 추가 하기', 'completed', 'high', 5, NULL, false, NULL, '2026-05-04 13:16:33.108468', '2026-05-24 04:05:15.52');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (76, '[사전조회] 우리카드 사전조회 업데이트', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1982', '1982', NULL, 'completed', 'high', 2, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/618', false, NULL, '2026-05-11 04:06:42.397655', '2026-05-24 04:05:10.467');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (77, '[페이스사인] 롯데카드, 우리카드 발급전사전조회 배포', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2067', '2067', '반드시 챙겨야함', 'completed', 'high', 0, NULL, false, NULL, '2026-05-11 04:56:11.934221', '2026-05-28 01:29:34.236');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (78, '대체카드 번호 사전조회 배치처리', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2105', '2105', NULL, 'in_progress', 'high', 2, NULL, false, NULL, '2026-05-13 07:22:29.969741', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (79, '영수증 하드코딩!!', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2130', '2130', NULL, 'completed', 'high', 3, NULL, false, NULL, '2026-05-20 02:11:56.806684', '2026-05-27 10:08:18.591');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (80, '타임아웃 정책 변경', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/2001', '2001', NULL, 'completed', 'high', 4, 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pull/598', false, NULL, '2026-05-21 01:17:42.460128', '2026-05-27 10:08:22.186');
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (81, '[epic] 해지카드관리 ', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/668', '668', NULL, 'in_progress', 'high', 0, NULL, true, NULL, '2026-05-21 05:15:31.538861', NULL);
INSERT INTO tasks (id, title, ticket_url, ticket_number, description, status, priority, sort_order, pr_url, is_epic, parent_epic_id, created_at, completed_at) OVERRIDING SYSTEM VALUE VALUES (82, '해지카드관리', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1664', '1664', NULL, 'in_progress', 'medium', 12, NULL, false, NULL, '2026-05-26 08:38:40.345907', NULL);
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));

-- Table: comments (80 rows)
TRUNCATE TABLE comments RESTART IDENTITY CASCADE;
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (6, 7, 'PR을 통해 검증하는 것도 좋을 듯', '2026-02-10 06:40:08.783398');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (7, 8, '이건 회의를 해봐야할듯', '2026-02-10 06:40:16.237449');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (8, 9, '이건 설날 전까지는 끝내놓고 ~', '2026-02-10 06:40:24.590261');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (9, 10, 'card 통지 이후 exception 처리', '2026-02-10 06:40:37.626656');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (10, 12, '코드 리뷰 기반으로 해보자 !', '2026-02-10 06:40:45.406757');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (11, 13, '여기에 통지 완료 시 logging 처리하는 것도 넣어주면 좋을듯', '2026-02-10 08:19:14.044185');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (12, 13, 'logging 처리란, 승인번호를 넣었을 시 해당 쓰레드 기반으로 \
result code, success (결제형 통지 완료) 했는지 찍히게\
log처리하는것을 의미함', '2026-02-10 08:19:51.251288');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (13, 6, 'tcp gw 다시 clone 받고 dcb 호출하게해서 테스트 진행해보자 !! \
2/10', '2026-02-10 11:41:59.432402');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (14, 13, '재시도는 약간 이벤트 호출 잘 되는지만 검증하면됨...!', '2026-02-10 11:42:26.385916');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (15, 6, '🚨 승인통지 3번 succees -> dup -> dup 나는 상황\
승인취소도 3번나는 상황 fail/fail/fail', '2026-02-11 07:18:58.607148');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (16, 12, 'PR 올린상태', '2026-02-11 07:19:02.574962');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (17, 12, '테스트도 완료함\
1. 카드 n장일때 -> 페이스사인 삭제 x 확인\
2. 카드 1장일때 ->페이스사인 삭제 확인', '2026-02-11 07:35:53.40061');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (18, 15, '코드 최종 점검 후 RP 날리기 !', '2026-02-11 13:04:33.979119');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (19, 16, '아직 배포 전 (추후 배포 챙기기)', '2026-02-12 05:42:23.277503');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (20, 22, 'dcb 작업임 !', '2026-02-12 05:48:02.964804');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (21, 16, '작업완료 배포나갔나 ?', '2026-02-12 05:52:51.726888');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (22, 23, '2/25 배포 예정', '2026-02-12 07:13:17.137986');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (23, 22, '2.25 비정기 배포 예정', '2026-02-12 07:13:26.396849');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (24, 25, '코드 리뷰 진행 중', '2026-02-13 00:48:39.296063');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (25, 23, '1. tcp 에서 변경\
2. dcb바라보게 변경', '2026-02-13 01:33:27.475748');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (26, 22, '1. tcp 에서 변경\
2. dcb바라보게 변경', '2026-02-13 01:33:30.946367');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (27, 24, '리뷰가 달려서 반영함 \
대기중', '2026-02-13 01:43:12.376581');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (28, 25, '✔️ 코드리뷰 반영 \
1. status U만 받는게 아닌 N 까지 받는 것으로 수정', '2026-02-19 02:28:36.496326');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (29, 24, '✔️ approve', '2026-02-19 04:32:47.371329');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (30, 26, '@jinyo-choi 님, 국민카드와 아래와 같이 협의하여 별도 변경 개발 대응 안하는 것으로 최종 협의 했습니다. 이에 해당 이슈 진행이 필요 없게 되어 닫겠습니다.\
\
페이스사인 등록 요청 RegistrationRoute = 02 (자동등록) 으로 기존 스펙대로 요청\
KB국민카드 내부에서 PAY_MODE = 페이스사인인 경우 별도 트래킹하는 것으로 최종 합의', '2026-02-19 05:58:44.832213');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (31, 16, '안나갔음 -> pr 땃어 \
그리고 1689임 변경완', '2026-02-19 07:48:30.231762');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (32, 28, '기존 인증이 dcb를 타버렸음...\
1. ci 하드코딩한뒤\
2. 통지테스트 진행', '2026-02-22 04:28:47.62982');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (33, 27, '2/22 개발완료 \
2/23 PR 예정', '2026-02-22 12:02:04.530399');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (34, 21, '1. web binNo 타입 변경\
2. 신한, 농협 result 값 변경\
추가 ) \
다른 카드사 모두 cid 딴 다음에 테스트 진행하기', '2026-02-22 14:13:10.209512');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (35, 21, 'web PR, CPH PR 두개 나와야함', '2026-02-22 14:14:14.362071');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (36, 27, '✔️ 3/4 정기배포때 나갈예정', '2026-02-23 05:31:53.264775');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (37, 22, '비정기, 정기 배포 시나리오\
2/25 (수) 비정기 배포\
DCB API Merge\
CPH dev->Master Merge\
DCB API 비정기 배포 (CBT)\
특정 계정으로 CPH 호출\
CPH 비정기 배포 (통지 로직)\
~3/4 충분한 테스트 및 모니터링 작업\
\
3/4 (수) 정기배포\
CPH 승인통지 재시도 배포 ([페이스사인] 통지 재시도 #1670)\
DCB API 모든 계정 적용 배포', '2026-02-23 06:56:52.085766');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (38, 21, '1) alpha 테스트 완료\
- lotte beta 테스트 필요\
- hyundai beta 테스트 필요\
\
2. beta 테스트 실행 하기', '2026-02-23 11:03:55.078902');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (39, 25, '✔️ 3.4 배포 예정', '2026-02-23 11:05:36.880579');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (40, 16, '2/24\
⚠️ code review 반영 필요', '2026-02-24 00:56:30.058877');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (41, 30, '⚠️ 재시도 실제로 구현해봐야함 ! \
- 5회 실패하게 만들기 ?\
- 특정 cbt 계정일 때 실패응답 주기...\
-> 이걸 카오스몽키로 못하나 ?', '2026-02-25 09:58:03.550237');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (42, 30, '⚠️ 재시도 실제로 구현해봐야함 ! \
- 5회 실패하게 만들기 ?\
- 특정 cbt 계정일 때 실패응답 주기...\
-> 이걸 카오스몽키로 못하나 ?', '2026-02-26 07:55:57.973338');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (43, 33, '일단은 requestKey로 된다고한다...', '2026-02-26 12:32:59.629528');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (44, 28, '삼성카드 - 운영반영예정', '2026-02-26 12:34:17.524835');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (45, 21, 'beta 테스트 진행 중..', '2026-02-26 12:34:37.185096');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (46, 16, '2/26\
반영완료', '2026-02-26 13:02:26.781107');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (47, 32, '문서화 작업이 필요함 !! 급하게 해야함', '2026-02-26 14:11:04.800051');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (48, 32, 'qr그리는 씬에서부터 승인통지에 이르기까지 otc v2 필드가 20자리일때 검증이 실패하는 부분이 있을것 같은데, 영향도 체크한번 해주세요~', '2026-02-26 14:11:17.667649');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (49, 32, '⚠️ TODO\
1. 암복호화 관련 샘플 자료 준비\
2. inbound 개발 테스트 일정 잡기', '2026-03-01 06:13:33.984388');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (50, 23, '배포 시나리오\
1. tcp gw 기존 dcb->cph로 바라보는 pr을 요청한다.\
2. 기존 dcb 에서 꺽던 코드는 revert 하고 그것을 pr 요청한다 (내일)\
3. 페이스사인 관련 모든 작업이 배포된다.', '2026-03-03 07:29:57.75609');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (51, 35, 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1816', '2026-03-03 11:31:12.341067');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (52, 32, '3/5 \
이건 16일에 가능 ?', '2026-03-05 10:22:44.286144');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (53, 41, '✔️ 메모\
1. 해당 api는 최초 app->결제형->dcb로 호출하는 구조이다.\
2. dcb에서 card 조회 후 cchd 이면... return을 바로해야 한다. \
--> 비효율적이어도 공통로직에서 처리한다.\
3. 그 다음은 dcb->cph로 호출한다. \
--> cph 호출 시는 /api/v1/channel/{channel}/{cid}/otc-v2 이며 해당 post url에서 응답 값만 채워주고 나머지는 안채워도 된다. requerid=true 여도 괜찮다.', '2026-03-05 10:31:03.86807');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (54, 40, '✔️ 메모\
1. 등록은 cph로만 하고 \
2. 조회는 dcb에서 cchd를 조회할 수 있도록 cardcode 쪽에 반드시 추가해줘야한다.', '2026-03-05 10:31:41.097641');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (55, 36, '16일?', '2026-03-05 10:31:46.730655');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (56, 34, '■ 제목 : 네이버페이 <-> 현대백화점 ACL 연동 요청\
■ Tiket NO : REQ20260303000496\
■ 업무구분 : 네트워크 ACL 요청\
■ Q-Pass 여부 :  Y\
\
■ 처리톡 추가 일시 : 2026-03-05T17:41:15.980\
■ 서비스제공예정일 :2026-03-12  \
■ 요청자 : [카드BE] 최진영\
■ 내용보기 : https://wgkl.navercorp.com/_gw/http://ntree.navercorp.com/index.html?ticketId=REQ20260303000496', '2026-03-05 10:32:00.205633');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (57, 40, '✔️ cph 개발 완료', '2026-03-08 08:01:05.029253');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (58, 39, 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1834', '2026-03-09 05:30:25.780862');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (59, 46, 'Todo list\
- CardCode 연동\
- CCHD로 변경 및 커밋', '2026-03-12 07:01:46.308675');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (60, 46, '- N16A를 처리를 해야한다. 통지가 들어오고 그 통지를 등록을 해야한다. \
방법이 2가지다. 첫 번째는 해당 ci를 기준으로 하나의 계정애만 추가한다. 계정을 최대 3개까지 만들 수 있으므로 3번을 호출하는 방법이있다.\
- 여튼 dcb->cph로 호출을하고 그 호출을 몇번할지 ci만 받을지말지를 결정해야하고\
\
- 결국 internal에다가 api를 추가해야한다.', '2026-03-12 07:05:17.724104');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (61, 46, '추가\
N16A 작업을 진행해야하며, 해당 작업중에 \
DCB에서 꺽는작업을 진행해야한다.', '2026-03-12 07:16:42.513417');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (62, 49, '⚠️ length는 제외한다.', '2026-03-17 09:44:49.424461');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (63, 37, '1.운영 ACL 은 가능한 빠르게 요청해야한다.\
2. CE 로 빌링카드도 코드 해야한다.\
3. 결제FE 여기서 챙겨야한다.\
4. DCB alpha \
5. 어드민 CCHD 추가 -> iims 쪽 \
-> 이건 우리끼리 얘기한거다. \
6. qr을 단위테스트하면 N15A 카드코드 하고 나면 ㅇㅋ', '2026-03-18 05:11:52.428389');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (64, 37, '✔️ 결제형 요청 \
QR env 방식을 현백에서는 20자리라서 알수가없다. 우리가 내려줄수있나 ? 어떤 정보를 ... ?', '2026-03-18 05:13:04.001967');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (65, 37, '✔️ 결제형 요청 \
api를 주면 된다.', '2026-03-18 05:15:29.173485');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (66, 37, '✔️ 결제형\
api dcb에서 꺽는거 로직을 해야한다.', '2026-03-18 05:18:35.437216');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (67, 51, 'cid = null 인경우도 체크해주면 좋을듯', '2026-03-18 11:10:32.672434');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (68, 34, '개발계 반영 완료 3/20', '2026-03-20 13:48:31.077676');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (69, 41, 'dcb\
{\
  "cardCompanyId": "CCHD",\
  "cid": "20260320185310566036",\
  "naverPayMemberNo": 200774137,\
  "ownerVerificationYn": "y",\
  "serviceId": "naver_shoppay01",\
  "serviceOrderNumber": "1234567890",\
  "cardEntryMethod": "QR",\
  "bearerCorporateCard": true\
}', '2026-03-22 13:08:29.257787');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (70, 41, '{\
  "cardCompanyId": "CCHD",\
  "cid": "20261011000000000002",\
  "naverPayMemberNo": 200774137,\
  "ownerVerificationYn": "y",\
  "serviceId": "naver_shoppay01",\
  "serviceOrderNumber": "1234567890",\
  "cardEntryMethod": "QR",\
  "bearerCorporateCard": true\
}', '2026-03-23 14:21:12.463947');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (71, 41, '{\
  "code": "4005",\
  "message": "[4999]OTC 발급 에러 - 카드사 확인요망"\
}', '2026-03-23 14:21:45.56094');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (72, 41, '{\
  "cardCompanyId": "CCHD",\
  "cid": "20261011000000000002",\
  "naverPayMemberNo": 200774137,\
  "ownerVerificationYn": "y",\
  "serviceId": "naver_shoppay01",\
  "serviceOrderNumber": "1234567890",\
  "cardEntryMethod": "QR",\
  "bearerCorporateCard": true\
}', '2026-03-24 09:32:23.503028');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (73, 37, '✔️ 배포일정\
(카드FE,BE는 4/1 운영 반영 가능한 상태이지만, 운영 반영 시 대고객 현대백화점 카드 등록 오픈되는 문제가 있어 4/15에 운영 배포하는 것으로 진행하고자 합니다.)\
\
차주 베타 환경에는 사전 반영 해주시면 베타 QA는 진행하고자 합니다.\
\
CC : @jinyo-choi , @seijin-park , @kang-sunghyun', '2026-03-25 08:38:23.920195');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (74, 54, 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1863', '2026-03-25 08:38:39.106511');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (75, 39, 'test', '2026-03-29 06:42:22.599028');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (76, 39, 'test', '2026-03-29 06:42:23.981341');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (77, 39, 'test', '2026-03-29 06:42:26.972084');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (78, 54, 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1941\
이걸로 변경', '2026-03-31 02:01:09.342836');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (79, 61, 'Todo\
1. 현대백화점 관련 내용들 모두 beta에 반여하기\
2. card code check list 반영 최종 체크\
3. 리뷰 없는 리뷰 받기\
4. api merge 한 pr 만들어서 리뷰 받기\
5. tcp gw 호출한 버전으로 pr 넣기', '2026-04-12 07:56:35.046843');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (80, 74, 'https://wiki.fin.navercorp.com/spaces/FIN/pages/232146045/%ED%9A%8C%EA%B3%A0%EB%A1%9D', '2026-05-04 13:16:14.27218');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (81, 73, 'https://wiki.fin.navercorp.com/spaces/FIN/pages/232146045/%ED%9A%8C%EA%B3%A0%EB%A1%9D', '2026-05-04 13:16:16.172462');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (82, 77, 'pr 완료 alpha/beta 테스트 완료', '2026-05-12 08:22:18.010325');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (83, 70, '처리 진행중..', '2026-05-12 08:22:32.90554');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (84, 79, '1) 5/20 \
베타 배포 완료 -> QA 테스트 중', '2026-05-20 05:07:48.748305');
INSERT INTO comments (id, task_id, content, created_at) OVERRIDING SYSTEM VALUE VALUES (85, 78, '1) 5/20\
alpha 반영 테스트 진행 중', '2026-05-20 05:07:55.365634');
SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));

-- Table: task_relations (9 rows)
TRUNCATE TABLE task_relations RESTART IDENTITY CASCADE;
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (6, 13, 12);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (8, 19, 12);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (9, 19, 15);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (10, 22, 23);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (11, 29, 26);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (12, 29, 25);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (13, 29, 16);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (14, 28, 29);
INSERT INTO task_relations (id, source_task_id, target_task_id) OVERRIDING SYSTEM VALUE VALUES (16, 29, 31);
SELECT setval('task_relations_id_seq', (SELECT MAX(id) FROM task_relations));

-- Table: favorite_links (6 rows)
TRUNCATE TABLE favorite_links RESTART IDENTITY CASCADE;
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (2, 'CPH', 'https://oss.fin.navercorp.com/CardPayment/card-payment-hub/pulls', '2026-02-10 05:57:57.217989');
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (3, 'DCB', 'https://oss.fin.navercorp.com/CardPayment/api/pulls', '2026-02-10 05:58:15.617557');
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (4, 'CARD_PLAN', 'https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/assigned/jinyo-choi', '2026-02-10 05:58:39.95023');
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (5, 'alpha_amdin', 'https://alpha.dbill.naver.com/build/test/index.html#/npay-biz', '2026-02-10 06:15:00.298418');
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (6, 'CPH_swagger', 'https://alpha-card-payment-hub.naver.com/swagger-ui/index.html', '2026-02-10 06:15:25.571472');
INSERT INTO favorite_links (id, title, url, created_at) OVERRIDING SYSTEM VALUE VALUES (7, '일정', 'https://calendar.navercorp.com/web/calendar/main?viewType=month&menuType=calendar&calendarId=c_1001_6456b4ce-0791-47d0-a2ec-e400f2cc826e&bRouterPush=true', '2026-02-12 05:49:30.354041');
SELECT setval('favorite_links_id_seq', (SELECT MAX(id) FROM favorite_links));

-- Table: quiz_questions (0 rows)
TRUNCATE TABLE quiz_questions RESTART IDENTITY CASCADE;
SELECT setval('quiz_questions_id_seq', (SELECT MAX(id) FROM quiz_questions));

