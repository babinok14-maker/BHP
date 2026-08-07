import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MemberForm from "../components/MemberForm";
import ImageUploader from "../components/ImageUploader";
import PdfUploader from "../components/PdfUploader";
import * as membersApi from "../api/members";
import { Member } from "../types";
import { MemberFormSchemaValues } from "../schemas/memberSchema";

export default function MemberFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (id) {
      membersApi.getMemberById(id).then((data) => {
        setMember(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  async function handleSubmit(values: MemberFormSchemaValues) {
    if (isEditing && id) {
      await membersApi.updateMember(id, values);
    } else {
      const created = await membersApi.createMember(values);
      // Redirect into edit mode so the photo uploader (which needs an id) becomes available.
      navigate(`/members/${created.id}/edit`);
      return;
    }
    navigate("/");
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {isEditing ? "Edit Member" : "Add Member"}
      </h1>

      {isEditing && member && (
        <>
          <div className="mb-6">
            <ImageUploader
              memberId={member.id}
              currentPhotoUrl={member.photoUrl}
              onUploaded={setMember}
            />
          </div>
          <div className="mb-6">
            <PdfUploader memberId={member.id} />
          </div>
        </>
      )}

      <MemberForm
        defaultValues={
          member
            ? {
                fullName: member.fullName,
                passportNumber: member.passportNumber,
                jobPosition: member.jobPosition,
                age: member.age,
                status: member.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Save Changes" : "Create Member"}
      />
    </div>
  );
}
