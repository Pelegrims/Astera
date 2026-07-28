import { ClientRequest } from "./types";

export const MOCK_REQUESTS: ClientRequest[] = [
  {
    id: "req_001",
    firstName: "Amanda",
    email: "amanda@example.com",
    phone: "+1 555-201-3344",
    birthDate: "1994-03-12",
    birthTime: "06:40",
    birthLocation: "Austin, TX, USA",
    focus: "love",
    consent: true,
    status: "new",
    createdAt: "2026-07-06T14:20:00.000Z",
    report: {
      coreEnergy: "",
      loveAndRelationships: "",
      careerAndMoney: "",
      currentPlanetaryFocus: "",
      personalRecommendations: "",
    },
  },
  {
    id: "req_002",
    firstName: "Daniel",
    email: "daniel@example.com",
    birthDate: "1989-11-02",
    birthTime: undefined,
    birthLocation: "Denver, CO, USA",
    focus: "career",
    consent: true,
    status: "in_progress",
    createdAt: "2026-07-05T09:05:00.000Z",
    report: {
      coreEnergy:
        "Daniel leads with a grounded, quietly determined Capricorn Sun, softened by a Pisces Moon that keeps his ambition tied to meaning rather than status alone.",
      loveAndRelationships: "",
      careerAndMoney:
        "The next twelve months favor patient positioning over big leaps. Saturn's current placement rewards the groundwork Daniel has already put in.",
      currentPlanetaryFocus: "",
      personalRecommendations: "",
    },
  },
  {
    id: "req_003",
    firstName: "Priya",
    email: "priya@example.com",
    phone: "+1 555-777-9021",
    birthDate: "1997-07-22",
    birthTime: "13:15",
    birthLocation: "Seattle, WA, USA",
    focus: "life_direction",
    consent: true,
    status: "ready",
    createdAt: "2026-07-03T18:40:00.000Z",
    report: {
      coreEnergy:
        "Priya's chart centers on a communicative Gemini Sun paired with a steady Taurus Moon — a rare mix of curiosity and follow-through.",
      loveAndRelationships:
        "Her Venus in Cancer asks for emotional safety before openness. The coming season favors depth over pace in any new connection.",
      careerAndMoney:
        "A strong Midheaven signals visibility is coming, likely tied to work she has been quietly building for years rather than a sudden pivot.",
      currentPlanetaryFocus:
        "Jupiter's transit through her tenth house marks a genuine window for recognition — the next three months are worth using deliberately.",
      personalRecommendations:
        "Choose one commitment to make public this month. Priya's chart rewards visible follow-through right now more than private preparation.",
    },
  },
  {
    id: "req_004",
    firstName: "Marcus",
    email: "marcus@example.com",
    birthDate: "1991-01-30",
    birthTime: "22:10",
    birthLocation: "Chicago, IL, USA",
    focus: "money",
    consent: true,
    status: "sent",
    createdAt: "2026-06-29T11:00:00.000Z",
    report: {
      coreEnergy:
        "Marcus carries a disciplined Capricorn stellium, giving him unusual staying power once he commits to a direction.",
      loveAndRelationships:
        "Relationships steady him more than they excite him, and that is exactly the point — his Libra Moon needs calm, not intensity.",
      careerAndMoney:
        "A second Saturn return is approaching. This is a rebuilding year for income structures, not a year to chase quick wins.",
      currentPlanetaryFocus:
        "Transiting Pluto is reshaping how Marcus relates to security itself, not just his bank balance.",
      personalRecommendations:
        "Automate the boring parts of saving now, while Saturn favors structure. The habits Marcus builds this year will outlast the year.",
    },
  },
];
