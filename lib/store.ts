/**
 * Data access layer — backed by Supabase (Postgres).
 *
 * Every function here is async, so nothing that calls this file (server
 * components, server actions) had to change when this moved from an
 * in-memory array to a real database.
 *
 * Table schema (create this once in the Supabase SQL editor):
 *
 *   create table requests (
 *     id text primary key,
 *     "firstName" text not null,
 *     email text not null,
 *     phone text,
 *     "birthDate" text not null,
 *     "birthTime" text,
 *     "birthLocation" text not null,
 *     gender text not null,
 *     "utcOffset" numeric not null,  -- fractional hours (5.5 = India +5:30);
 *                                    -- if the table was created earlier with
 *                                    -- `integer`, run once in the SQL editor:
 *                                    -- alter table requests alter column "utcOffset" type numeric using "utcOffset"::numeric;
 *     focus text not null,
 *     consent boolean not null default false,
 *     status text not null default 'new',
 *     "createdAt" timestamptz not null default now(),
 *     report jsonb not null default '{}'::jsonb
 *   );
 *
 * Required env vars (set in Vercel project settings, not committed):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { randomUUID } from "crypto";
import { supabase } from "./supabase";
import { ClientRequest, QuizSubmission, ReportSections, RequestStatus, EMPTY_REPORT_SECTIONS } from "./types";

export async function listRequests(): Promise<ClientRequest[]> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ClientRequest[];
}

export async function getRequestById(id: string): Promise<ClientRequest | null> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ClientRequest | null) ?? null;
}

export async function createRequestFromQuiz(
  submission: QuizSubmission
): Promise<ClientRequest> {
  const newRequest: ClientRequest = {
    id: `req_${randomUUID().slice(0, 8)}`,
    ...submission,
    status: "new",
    createdAt: new Date().toISOString(),
    report: EMPTY_REPORT_SECTIONS,
  };
  const { error } = await supabase.from("requests").insert(newRequest);
  if (error) throw error;
  return newRequest;
}

export async function updateReport(
  id: string,
  report: ReportSections
): Promise<ClientRequest | null> {
  const { data, error } = await supabase
    .from("requests")
    .update({ report })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return (data as ClientRequest | null) ?? null;
}

export async function updateStatus(
  id: string,
  status: RequestStatus
): Promise<ClientRequest | null> {
  const { data, error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return (data as ClientRequest | null) ?? null;
}
