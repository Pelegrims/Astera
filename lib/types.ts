// Core domain types. Keep these framework-agnostic so they work the same
// whether data comes from mock-data.ts or a real database (see lib/store.ts).

export type FocusArea =
  | "love"
  | "career"
  | "money"
  | "personal_growth"
  | "life_direction";

export const FOCUS_LABELS: Record<FocusArea, string> = {
  love: "Love & Relationships",
  career: "Career",
  money: "Money & Abundance",
  personal_growth: "Personal Growth",
  life_direction: "Life Direction",
};

export type RequestStatus = "new" | "in_progress" | "ready" | "sent";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  ready: "Ready",
  sent: "Sent",
};

export interface ReportSections {
  coreEnergy: string;
  loveAndRelationships: string;
  careerAndMoney: string;
  currentPlanetaryFocus: string;
  personalRecommendations: string;
}

export const EMPTY_REPORT_SECTIONS: ReportSections = {
  coreEnergy: "",
  loveAndRelationships: "",
  careerAndMoney: "",
  currentPlanetaryFocus: "",
  personalRecommendations: "",
};

export interface ClientRequest {
  id: string;
  firstName: string;
  email: string;
  phone?: string;
  birthDate: string; // ISO date, e.g. "1994-03-12"
  birthTime?: string; // "HH:mm", optional — unknown time is common
  birthLocation: string;
  focus: FocusArea;
  consent: boolean;
  status: RequestStatus;
  createdAt: string; // ISO datetime
  report: ReportSections;
}

// The exact shape the quiz form submits. Kept separate from ClientRequest
// so the API/storage layer owns fields like id, status, createdAt.
export interface QuizSubmission {
  firstName: string;
  email: string;
  phone?: string;
  birthDate: string;
  birthTime?: string;
  birthLocation: string;
  focus: FocusArea;
  consent: boolean;
}
