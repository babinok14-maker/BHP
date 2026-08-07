import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMembers } from "../hooks/useMembers";
import MemberCard from "../components/MemberCard";
import ConfirmModal from "../components/ConfirmModal";
import * as membersApi from "../api/members";
import { Member } from "../types";

export default function MembersListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">("all");
  const { members, isLoading, error, refetch } = useMembers(search);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredMembers = useMemo(
    () =>
      members.filter((m) => {
        if (filter === "published") return m.published;
        if (filter === "unpublished") return !m.published;
        return true;
      }),
    [members, filter]
  );

  const handleTogglePublish = useCallback(
    async (member: Member) => {
      if (member.published) {
        await membersApi.unpublishMember(member.id);
      } else {
        await membersApi.publishMember(member.id);
      }
      refetch();
    },
    [refetch]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    await membersApi.deleteMember(pendingDeleteId);
    setPendingDeleteId(null);
    refetch();
  }, [pendingDeleteId, refetch]);

  const handleDelete = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
        <Link
          to="/members/new"
          className="rounded-md bg-approved px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add Member
        </Link>
      </div>

      <div className="mb-6 flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or position…"
          className="w-72 rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading members…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        ))}
        {!isLoading && filteredMembers.length === 0 && (
          <p className="text-sm text-gray-500">No members found.</p>
        )}
      </div>

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete member"
        message="This will permanently remove the member and their photo. This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
