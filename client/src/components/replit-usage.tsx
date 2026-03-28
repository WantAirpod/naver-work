import { Card } from "@/components/ui/card";
import { ExternalLink, BarChart3 } from "lucide-react";

export function ReplitUsage() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">사용량 / 과금</h3>
      </div>
      <div className="text-xs text-muted-foreground space-y-2">
        <p>Replit 대시보드에서 실시간 사용량과 과금 현황을 확인할 수 있습니다.</p>
        <a
          href="https://replit.com/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary text-xs font-medium"
          data-testid="link-replit-usage"
        >
          사용량 확인하기
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
}
