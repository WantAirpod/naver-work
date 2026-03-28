import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FavoriteLink } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Link2,
  Star,
} from "lucide-react";

export function FavoriteLinks() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const { data: links = [], isLoading } = useQuery<FavoriteLink[]>({
    queryKey: ["/api/favorite-links"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; url: string }) => {
      const res = await apiRequest("POST", "/api/favorite-links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorite-links"] });
      setIsAdding(false);
      setNewTitle("");
      setNewUrl("");
      toast({ title: "링크가 추가되었습니다" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; url: string } }) => {
      const res = await apiRequest("PATCH", `/api/favorite-links/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorite-links"] });
      setEditingId(null);
      toast({ title: "링크가 수정되었습니다" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/favorite-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorite-links"] });
      toast({ title: "링크가 삭제되었습니다" });
    },
  });

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    createMutation.mutate({ title: newTitle.trim(), url: newUrl.trim() });
  };

  const handleEdit = (id: number) => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    updateMutation.mutate({ id, data: { title: editTitle.trim(), url: editUrl.trim() } });
  };

  const startEdit = (link: FavoriteLink) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const getFavicon = (url: string) => {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">즐겨찾기</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setIsAdding(!isAdding);
            setNewTitle("");
            setNewUrl("");
          }}
          data-testid="button-add-link"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="space-y-2 mb-3 p-3 rounded-md bg-muted/50">
          <Input
            placeholder="이름"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            data-testid="input-link-title"
          />
          <Input
            placeholder="URL (https://...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            data-testid="input-link-url"
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(false)}
              data-testid="button-cancel-link"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!newTitle.trim() || !newUrl.trim() || createMutation.isPending}
              data-testid="button-save-link"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              추가
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-xs text-muted-foreground py-2">로딩 중...</div>
      ) : links.length === 0 && !isAdding ? (
        <div className="text-xs text-muted-foreground py-4 text-center">
          <Link2 className="w-5 h-5 mx-auto mb-1.5 text-muted-foreground/50" />
          즐겨찾기가 없습니다
        </div>
      ) : (
        <div className="space-y-1">
          {links.map((link) =>
            editingId === link.id ? (
              <div key={link.id} className="space-y-2 p-3 rounded-md bg-muted/50">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  data-testid={`input-edit-link-title-${link.id}`}
                />
                <Input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  data-testid={`input-edit-link-url-${link.id}`}
                />
                <div className="flex items-center gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-3.5 h-3.5 mr-1" />
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(link.id)}
                    disabled={updateMutation.isPending}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <div
                key={link.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover-elevate"
              >
                {getFavicon(link.url) && (
                  <img
                    src={getFavicon(link.url)!}
                    alt=""
                    className="w-4 h-4 shrink-0"
                  />
                )}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm truncate"
                  data-testid={`link-favorite-${link.id}`}
                >
                  {link.title}
                </a>
                <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 invisible group-hover:visible" />
                <div className="flex items-center gap-0.5 invisible group-hover:visible">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => startEdit(link)}
                    data-testid={`button-edit-link-${link.id}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => deleteMutation.mutate(link.id)}
                    data-testid={`button-delete-link-${link.id}`}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Card>
  );
}
