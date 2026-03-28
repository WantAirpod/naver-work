import { db } from "./db";
import { tasks, comments, taskRelations } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existing = await db.select().from(tasks);
  if (existing.length > 0) return;

  const [task1, task2, task3, task4, task5] = await db
    .insert(tasks)
    .values([
      {
        title: "카드 결제 플랜 신규 UI 디자인 검토",
        ticketUrl: "https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1755",
        ticketNumber: "1755",
        description: "결제 플랜 페이지의 신규 UI 디자인 시안을 검토하고 피드백을 전달합니다. 모바일/데스크탑 반응형 대응 확인 필요.",
        status: "in_progress",
        priority: "high",
      },
      {
        title: "결제 API 에러 핸들링 개선",
        ticketUrl: "https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1823",
        ticketNumber: "1823",
        description: "결제 과정에서 발생하는 타임아웃, 네트워크 에러 등의 예외 상황에 대한 사용자 안내 메시지를 개선합니다.",
        status: "in_progress",
        priority: "high",
      },
      {
        title: "할부 개월수 선택 기능 추가",
        ticketUrl: "https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1801",
        ticketNumber: "1801",
        description: "카드 결제 시 할부 개월수를 선택할 수 있는 드롭다운 UI를 추가하고, 무이자 할부 프로모션 정보를 함께 표시합니다.",
        status: "in_progress",
        priority: "medium",
      },
      {
        title: "QA 테스트 케이스 작성 - 결제 프로세스",
        ticketUrl: "https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1790",
        ticketNumber: "1790",
        description: "카드 결제 전체 프로세스에 대한 QA 테스트 케이스를 작성합니다. 정상/비정상 시나리오 모두 포함.",
        status: "in_progress",
        priority: "low",
      },
      {
        title: "결제 내역 조회 페이지 성능 개선",
        ticketUrl: "https://oss.fin.navercorp.com/Product-Planning/Card_Payment_Plan/issues/1768",
        ticketNumber: "1768",
        description: "대량 결제 내역 조회 시 페이지 로딩 속도가 느린 문제를 개선합니다. 가상 스크롤링 및 페이지네이션 적용.",
        status: "completed",
        priority: "medium",
      },
    ])
    .returning();

  await db.insert(comments).values([
    {
      taskId: task1.id,
      content: "디자인팀에서 시안 전달받았습니다. 모바일 반응형 부분 추가 확인 필요합니다.",
    },
    {
      taskId: task1.id,
      content: "iOS Safari에서 결제 버튼 레이아웃 깨짐 이슈 발견. 디자인팀에 공유 완료.",
    },
    {
      taskId: task2.id,
      content: "에러 코드별 사용자 안내 메시지 초안 작성 완료. 리뷰 요청드립니다.",
    },
    {
      taskId: task3.id,
      content: "무이자 할부 정보 API 연동 스펙 확인 완료.",
    },
  ]);

  await db.insert(taskRelations).values([
    { sourceTaskId: task1.id, targetTaskId: task2.id },
    { sourceTaskId: task1.id, targetTaskId: task3.id },
    { sourceTaskId: task2.id, targetTaskId: task4.id },
  ]);

  console.log("Database seeded successfully");
}
