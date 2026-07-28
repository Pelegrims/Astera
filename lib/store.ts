/**
 * Data access layer.
 *
 * Every function here is async on purpose, even though the current
 * implementation is a synchronous in-memory array. That means switching to a
 * real database later (Supabase, Postgres, anything) is a matter of
 * rewriting the *inside* of these functions — nothing that calls them
 * (server components, server actions) has to change.
 *
 * See the bottom of this file for exactly what to replace with Supabase.
 */

import { randomUUID } from "crypto";
import { ClientRequest, QuizSubmission, ReportSections, RequestStatus, EMPTY_REPORT_SECTIONS } from "./types";
import { MOCK_REQUESTS } from "./mock-data";

// NOTE: this resets whenever the server restarts / redeploys. That's
// expected for an MVP demo. It's the only thing that changes once a real
// database is wired up.
const db: { requests: ClientRequest[] } = {
  requests: [...MOCK_REQUESTS],
};

export async function listRequests(): Promise<ClientRequest[]> {
  return [...db.requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getRequestById(id: string): Promise<ClientRequest | null> {
  return db.requests.find((r) => r.id === id) ?? null;
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
  db.requests.push(newRequest);
  return newRequest;
}

export async function updateReport(
  id: string,
  report: ReportSections
): Promise<ClientRequest | null> {
  const request = db.requests.find((r) => r.id === id);
  if (!request) return null;
  request.report = report;
  return request;
}

export async function updateStatus(
  id: string,
  status: RequestStatus
): Promise<ClientRequest | null> {
  const request = db.requests.find((r) => r.id === id);
  if (!request) return null;
  request.status = status;
  return request;
}

/**
 * ---------------------------------------------------------------------
 * SWAPPING THIS FOR SUPABASE
 * ---------------------------------------------------------------------
 * 1. `npm install @supabase/supabase-js`
 * 2. Create a `requests` table with columns matching ClientRequest
 *    (flatten `report` into its own `reports` table, or store it as jsonb —
 *    jsonb is simplest for an MVP: one column, same shape as ReportSections).
 * 3. Create lib/supabase.ts:
 *
 *      import { createClient } from "@supabase/supabase-js";
 *      export const supabase = createClient(
 *        process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *        process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only key
 *      );
 *
 * 4. Replace the bodies of the functions above, e.g.:
 *
 *      export async function listRequests() {
 *        const { data, error } = await supabase
 *          .from("requests")
 *          .select("*")
 *          .order("createdAt", { ascending: false });
 *        if (error) throw error;
 *        return data as ClientRequest[];
 *      }
 *
 * Nothing in app/ or components/ needs to change — they only ever import
 * from "@/lib/store".
 * ---------------------------------------------------------------------
 */
