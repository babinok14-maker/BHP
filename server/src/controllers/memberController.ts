import { NextFunction, Request, Response } from "express";
import * as memberService from "../services/memberService";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";
import { addClient, sendEvent } from "../utils/sse";

// ---- Admin endpoints (protected) ----

export async function listMembersAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const members = await memberService.listMembersForAdmin(search);
    sendSuccess(res, members);
  } catch (err) {
    next(err);
  }
}

export async function getMemberAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.getMemberById(req.params.id);
    sendSuccess(res, member);
  } catch (err) {
    next(err);
  }
}

export async function createMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.createMember(req.body);
    sendSuccess(res, member, 201);
    // notify clients a member was created
    sendEvent("member.created", member);
  } catch (err) {
    next(err);
  }
}

export async function updateMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.updateMember(req.params.id, req.body);
    sendSuccess(res, member);
    sendEvent("member.updated", member);
  } catch (err) {
    next(err);
  }
}

export async function deleteMember(req: Request, res: Response, next: NextFunction) {
  try {
    // Capture member id before deletion for notification
    const member = await memberService.getMemberById(req.params.id);
    await memberService.deleteMember(req.params.id);
    sendSuccess(res, { message: "Member deleted" });
    sendEvent("member.deleted", { id: member.id });
  } catch (err) {
    next(err);
  }
}

export async function publishMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.setMemberPublished(req.params.id, true);
    sendSuccess(res, member);
    sendEvent("member.updated", member);
  } catch (err) {
    next(err);
  }
}

export async function unpublishMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.setMemberPublished(req.params.id, false);
    sendSuccess(res, member);
    sendEvent("member.updated", member);
  } catch (err) {
    next(err);
  }
}

export async function uploadMemberPhoto(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 422);
    }
    const member = await memberService.uploadMemberPhoto(req.params.id, req.file.buffer);
    sendSuccess(res, member);
    sendEvent("member.updated", member);
  } catch (err) {
    next(err);
  }
}

export async function uploadMemberPdf(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('PDF upload request received for member:', req.params.id);
    console.log('File present:', !!req.file);
    
    if (!req.file) {
      console.error('No file in request');
      throw new AppError("No PDF file provided", 422);
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    const pdf = await memberService.uploadMemberPdf(
      req.params.id,
      req.file.originalname || "document.pdf",
      req.file.buffer,
      req.file.size
    );
    
    console.log('PDF uploaded successfully:', pdf.id);
    sendSuccess(res, pdf, 201);
    sendEvent("member.pdf.uploaded", { memberId: req.params.id, pdf });
  } catch (err) {
    console.error('PDF upload error:', err);
    next(err);
  }
}

export async function deleteMemberPdf(req: Request, res: Response, next: NextFunction) {
  try {
    await memberService.deleteMemberPdf(req.params.pdfId);
    sendSuccess(res, { message: "PDF deleted" });
    sendEvent("member.pdf.deleted", { pdfId: req.params.pdfId });
  } catch (err) {
    next(err);
  }
}

export async function listMemberPdfs(req: Request, res: Response, next: NextFunction) {
  try {
    const pdfs = await memberService.listMemberPdfs(req.params.id);
    sendSuccess(res, pdfs);
  } catch (err) {
    next(err);
  }
}

export async function streamMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    addClient(res);
  } catch (err) {
    next(err);
  }
}

// ---- Public endpoints (unprotected) ----

export async function listMembersPublic(_req: Request, res: Response, next: NextFunction) {
  try {
    const members = await memberService.listPublishedMembers();
    sendSuccess(res, members);
  } catch (err) {
    next(err);
  }
}

export async function getMemberPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.getPublishedMemberById(req.params.id);
    sendSuccess(res, member);
  } catch (err) {
    next(err);
  }
}

export async function servePdf(req: Request, res: Response, next: NextFunction) {
  try {
    const pdf = await memberService.getPdfById(req.params.pdfId);
    if (!pdf) {
      throw new AppError("PDF not found", 404);
    }

    console.log('Serving PDF from Supabase:', pdf.fileUrl);

    // Since Supabase provides public URLs, we can redirect to the Supabase URL
    // This is more efficient than proxying through our server
    res.redirect(pdf.fileUrl);
  } catch (err) {
    console.error('servePdf error:', err);
    next(err);
  }
}
