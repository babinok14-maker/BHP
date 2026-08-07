import api from "./axios";
import { Member, MemberFormValues } from "../types";

type ApiResponse<T> = { success: boolean; data: T };

export async function getAllMembers(search?: string) {
  const { data } = await api.get<ApiResponse<Member[]>>("/api/members/admin/all", {
    params: search ? { search } : undefined,
  });
  return data.data;
}

export async function getMemberById(id: string) {
  const { data } = await api.get<ApiResponse<Member>>(`/api/members/admin/${id}`);
  return data.data;
}

export async function createMember(values: MemberFormValues) {
  const { data } = await api.post<ApiResponse<Member>>("/api/members/admin", values);
  return data.data;
}

export async function updateMember(id: string, values: Partial<MemberFormValues>) {
  const { data } = await api.put<ApiResponse<Member>>(`/api/members/admin/${id}`, values);
  return data.data;
}

export async function deleteMember(id: string) {
  await api.delete(`/api/members/admin/${id}`);
}

export async function publishMember(id: string) {
  const { data } = await api.patch<ApiResponse<Member>>(`/api/members/admin/${id}/publish`);
  return data.data;
}

export async function unpublishMember(id: string) {
  const { data } = await api.patch<ApiResponse<Member>>(`/api/members/admin/${id}/unpublish`);
  return data.data;
}

export async function uploadMemberPhoto(id: string, file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await api.post<ApiResponse<Member>>(`/api/members/admin/${id}/photo`, formData);
  return data.data;
}

export async function uploadMemberPdf(id: string, file: File) {
  const formData = new FormData();
  formData.append("pdf", file);
  const { data } = await api.post<ApiResponse<any>>(`/api/members/admin/${id}/pdf`, formData);
  return data.data;
}

export async function getMemberPdfs(id: string) {
  const { data } = await api.get<ApiResponse<any[]>>(`/api/members/admin/${id}/pdf`);
  return data.data;
}

export async function deleteMemberPdf(pdfId: string) {
  await api.delete(`/api/members/admin/pdf/${pdfId}`);
}
