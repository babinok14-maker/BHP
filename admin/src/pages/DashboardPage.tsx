import { useEffect, useState } from "react";
import * as membersApi from "../api/members";

// Simple landing page with published/unpublished counts.
export default function DashboardPage() {
  const [counts, setCounts] = useState({ total: 0, published: 0, unpublished: 0 });

  useEffect(() => {
    membersApi.getAllMembers().then((members) => {
      const published = members.filter((m) => m.published).length;
      setCounts({ total: members.length, published, unpublished: members.length - published });
    });
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Members" value={counts.total} />
        <StatCard label="Published" value={counts.published} accent />
        <StatCard label="Unpublished" value={counts.unpublished} />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent ? "text-approved" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
