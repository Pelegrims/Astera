"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createRequestFromQuiz, updateReport, updateStatus } from "@/lib/store";
import { FocusArea, ReportSections } from "@/lib/types";

export async function submitQuiz(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const birthTime = String(formData.get("birthTime") ?? "").trim();
  const birthLocation = String(formData.get("birthLocation") ?? "").trim();
  const gender = String(formData.get("gender") ?? "female") as "male" | "female";
  const utcOffset = Number(formData.get("utcOffset") ?? -5);
  const focus = String(formData.get("focus") ?? "") as FocusArea;
  const consent = formData.get("consent") === "on";

  if (!firstName || !email || !birthDate || !birthLocation || !focus || !consent) {
    throw new Error("Missing required fields.");
  }

  const request = await createRequestFromQuiz({
    firstName,
    email,
    phone: phone || undefined,
    birthDate,
    birthTime: birthTime || undefined,
    birthLocation,
    gender,
    utcOffset,
    focus,
    consent,
  });

  // Passed directly in the URL rather than looked up server-side by id —
  // the mock in-memory store isn't guaranteed to persist across separate
  // serverless invocations on Vercel, so a lookup on the next page can
  // silently come back empty. None of this is sensitive enough to avoid
  // putting in a URL for the MVP.
  const params = new URLSearchParams({
    firstName: request.firstName,
    birthDate: request.birthDate,
    birthTime: request.birthTime ?? "",
    gender: request.gender,
    utcOffset: String(request.utcOffset),
  });
  redirect(`/thank-you?${params.toString()}`);
}

export async function saveReport(id: string, report: ReportSections) {
  await updateReport(id, report);
  revalidatePath(`/admin/${id}`);
  revalidatePath("/admin");
}

export async function markAsReady(id: string) {
  await updateStatus(id, "ready");
  revalidatePath(`/admin/${id}`);
  revalidatePath("/admin");
}

export async function markAsSent(id: string) {
  await updateStatus(id, "sent");
  revalidatePath(`/admin/${id}`);
  revalidatePath("/admin");
}

export async function markAsInProgress(id: string) {
  await updateStatus(id, "in_progress");
  revalidatePath(`/admin/${id}`);
  revalidatePath("/admin");
}
