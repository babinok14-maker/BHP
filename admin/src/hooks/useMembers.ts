import { useCallback, useEffect, useRef, useState } from "react";
import * as membersApi from "../api/members";
import { Member } from "../types";

// Centralizes member list state + refetching so pages don't duplicate it.
export function useMembers(search: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await membersApi.getAllMembers(search || undefined);
      setMembers(data);
    } catch {
      setError("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refetch();

    // Open SSE stream to receive real-time member events.
    // Use the configured API base or default to localhost:5000
    const base = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000";
    const streamUrl = `${base.replace(/\/$/, "")}/api/members/stream`;

    if (typeof window !== "undefined" && (window as any).EventSource) {
      try {
        const es = new EventSource(streamUrl, { withCredentials: false } as any);
        esRef.current = es;

        // Initial published members (from server stream)
        es.addEventListener("members.initial", (ev: any) => {
          try {
            const data = JSON.parse(ev.data);
            // Keep admin refetch as source of truth for full list, but
            // apply initial published members if admin list is empty.
            setMembers((prev) => (prev.length ? prev : data));
            setIsLoading(false);
          } catch (err) {
            // ignore parse errors
          }
        });

        es.addEventListener("member.created", (ev: any) => {
          try {
            const member: Member = JSON.parse(ev.data);
            setMembers((prev) => [member, ...prev.filter((m) => m.id !== member.id)]);
          } catch {}
        });

        es.addEventListener("member.updated", (ev: any) => {
          try {
            const member: Member = JSON.parse(ev.data);
            setMembers((prev) => {
              const found = prev.some((m) => m.id === member.id);
              if (found) return prev.map((m) => (m.id === member.id ? member : m));
              // If not found, prepend so admin UI sees it immediately
              return [member, ...prev];
            });
          } catch {}
        });

        es.addEventListener("member.deleted", (ev: any) => {
          try {
            const payload = JSON.parse(ev.data);
            setMembers((prev) => prev.filter((m) => m.id !== payload.id));
          } catch {}
        });

        // ignore other events for now

        es.onerror = () => {
          // on error, close and allow refetch to recover
          try {
            es.close();
          } catch {}
          esRef.current = null;
        };
      } catch (err) {
        // ignore stream failure; refetch continues to provide data
      }
    }

    return () => {
      try {
        esRef.current?.close();
      } catch {}
    };
  }, [refetch]);

  return { members, isLoading, error, refetch };
}
