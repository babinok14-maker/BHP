import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import cloudinary from "../config/cloudinary";
import supabase from "../config/supabase";
import { env } from "../config/env";

const prisma = new PrismaClient();

// Fields returned to the ADMIN dashboard (full record).
const ADMIN_SELECT = {
  id: true,
  fullName: true,
  passportNumber: true,
  jobPosition: true,
  age: true,
  photoUrl: true,
  status: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  pdfFiles: {
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      createdAt: true,
    },
  },
} as const;

// Fields returned to the PUBLIC website — minimal response, published only.
const PUBLIC_SELECT = {
  id: true,
  fullName: true,
  passportNumber: true,
  jobPosition: true,
  age: true,
  photoUrl: true,
  status: true,
  pdfFiles: {
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
    },
  },
} as const;

interface CreateMemberInput {
  fullName: string;
  passportNumber: string;
  jobPosition: string;
  age: number;
  status?: "Accepted" | "Pending" | "Rejected";
}

interface UpdateMemberInput {
  fullName?: string;
  passportNumber?: string;
  jobPosition?: string;
  age?: number;
  status?: "Accepted" | "Pending" | "Rejected";
  published?: boolean;
}

// ---- Admin-facing ----

export async function listMembersForAdmin(search?: string) {
  return prisma.member.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { jobPosition: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: ADMIN_SELECT,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemberById(id: string) {
  const member = await prisma.member.findUnique({ where: { id }, select: ADMIN_SELECT });
  if (!member) throw new AppError("Member not found", 404);
  return member;
}

export async function createMember(input: CreateMemberInput) {
  return prisma.member.create({ data: input, select: ADMIN_SELECT });
}

export async function updateMember(id: string, input: UpdateMemberInput) {
  await getMemberById(id); // 404s early if missing
  return prisma.member.update({ where: { id }, data: input, select: ADMIN_SELECT });
}

export async function deleteMember(id: string) {
  const member = await getMemberById(id);

  // Best-effort Cloudinary cleanup so orphaned images don't accumulate.
  if (member.photoUrl) {
    const publicId = extractCloudinaryPublicId(member.photoUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {
        // Non-fatal: the DB record is the source of truth for what's "live".
      });
    }
  }

  await prisma.member.delete({ where: { id } });
}

export async function setMemberPublished(id: string, published: boolean) {
  await getMemberById(id);
  return prisma.member.update({ where: { id }, data: { published }, select: ADMIN_SELECT });
}

export async function uploadMemberPhoto(id: string, fileBuffer: Buffer) {
  await getMemberById(id);

  const url = await streamUploadToCloudinary(fileBuffer);

  return prisma.member.update({
    where: { id },
    data: { photoUrl: url },
    select: ADMIN_SELECT,
  });
}

export async function uploadMemberPdf(id: string, fileName: string, fileBuffer: Buffer, fileSize: number) {
  await getMemberById(id);

  const url = await uploadPdfToSupabase(fileBuffer, fileName);

  return prisma.pdfFile.create({
    data: {
      memberId: id,
      fileName,
      fileUrl: url,
      fileSize,
    },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      createdAt: true,
    },
  });
}

export async function deleteMemberPdf(pdfId: string) {
  const pdf = await prisma.pdfFile.findUnique({ where: { id: pdfId } });
  if (!pdf) throw new AppError("PDF file not found", 404);

  // Extract file path from Supabase URL
  const urlParts = pdf.fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  
  // Delete from Supabase storage
  const { error } = await supabase.storage
    .from(env.supabaseBucket)
    .remove([fileName]);
  
  if (error) {
    console.error('Supabase delete error:', error);
    // Non-fatal: continue with DB deletion
  }

  await prisma.pdfFile.delete({ where: { id: pdfId } });
}

export async function listMemberPdfs(id: string) {
  await getMemberById(id);
  return prisma.pdfFile.findMany({
    where: { memberId: id },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPdfById(pdfId: string) {
  const pdf = await prisma.pdfFile.findUnique({
    where: { id: pdfId },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
    },
  });
  if (!pdf) throw new AppError("PDF not found", 404);
  return pdf;
}

// ---- Public-facing ----

export async function listPublishedMembers() {
  return prisma.member.findMany({
    where: { published: true },
    select: PUBLIC_SELECT,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedMemberById(id: string) {
  const member = await prisma.member.findFirst({
    where: { id, published: true },
    select: PUBLIC_SELECT,
  });
  if (!member) throw new AppError("Member not found", 404);
  return member;
}

// ---- Cloudinary helpers ----

function streamUploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "company-members", resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(new AppError("Image upload failed", 502));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

function extractCloudinaryPublicId(url: string): string | null {
  // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/company-members/abc123.jpg
  const match = url.match(/company-members\/([^./]+)\./);
  return match ? `company-members/${match[1]}` : null;
}

function normalizeBucketName(bucketName: string): string {
  return bucketName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "member-pdfs";
}

async function ensureBucketExists(bucketName: string) {
  const normalizedBucketName = normalizeBucketName(bucketName);

  const { data, error } = await supabase.storage.createBucket(normalizedBucketName, {
    public: true,
  });

  if (error) {
    const message = String(error.message || "").toLowerCase();
    if (!message.includes("already exists") && !message.includes("bucket already exists")) {
      console.error(`Supabase bucket creation error for ${normalizedBucketName}:`, error);
      throw new AppError(`Could not create or access Supabase bucket ${normalizedBucketName}`, 502);
    }
  }

  if (data) {
    console.log(`Supabase bucket ready: ${normalizedBucketName}`);
  }
}

async function uploadPdfToSupabase(buffer: Buffer, fileName: string): Promise<string> {
  if (!supabase || !env.supabaseUrl || !env.supabaseServiceKey) {
    throw new AppError(
      "Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY in .env",
      500
    );
  }

  try {
    const bucketName = env.supabaseBucket;
    if (!bucketName) {
      throw new AppError("Supabase bucket name is not configured", 500);
    }

    const normalizedBucketName = normalizeBucketName(bucketName);
    await ensureBucketExists(normalizedBucketName);

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from(normalizedBucketName)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new AppError(`PDF upload failed: ${error.message}`, 502);
    }

    const { data: publicData, error: publicError } = supabase.storage
      .from(normalizedBucketName)
      .getPublicUrl(filePath);

    if (!publicError && publicData?.publicUrl) {
      return publicData.publicUrl;
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from(normalizedBucketName)
      .createSignedUrl(filePath, 60 * 60);

    if (signedUrlError) {
      console.error("Supabase signed URL error:", signedUrlError);
      throw new AppError(`PDF upload failed: ${signedUrlError.message}`, 502);
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Supabase upload error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("PDF upload failed", 502);
  }
}
