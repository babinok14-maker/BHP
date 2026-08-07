import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Member } from "../types";

interface Props {
  member: Member;
  onDelete: (id: string) => void;
  onTogglePublish: (member: Member) => void;
}

function MemberCard({ member, onDelete, onTogglePublish }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={member.photoUrl || "https://placehold.co/64x64?text=No+Photo"}
          alt={member.fullName}
          className={`h-14 w-14 rounded-full object-cover border-2 ${
            member.published ? "border-approved" : "border-gray-300"
          }`}
        />
        <div>
          <p className="font-medium text-gray-900">{member.fullName}</p>
          <p className="text-sm text-gray-500">{member.jobPosition}</p>
          <p className="text-xs text-gray-400">Passport: {member.passportNumber}</p>
          <p className="text-xs text-gray-400 mt-1">Status: {member.status}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            member.published ? "bg-green-100 text-approved" : "bg-gray-100 text-gray-600"
          }`}
        >
          {member.published ? "Published" : "Unpublished"}
        </span>
        <button
          onClick={() => onTogglePublish(member)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {member.published ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => navigate(`/members/${member.id}/edit`)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(MemberCard);
