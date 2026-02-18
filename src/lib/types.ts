export type College =
  | "SCS"
  | "CIT"
  | "MCS"
  | "Dietrich"
  | "Tepper"
  | "CFA"
  | "SDS";

export const COLLEGE_NAMES: Record<College, string> = {
  SCS: "School of Computer Science",
  CIT: "College of Engineering",
  MCS: "Mellon College of Science",
  Dietrich: "Dietrich College",
  Tepper: "Tepper School of Business",
  CFA: "College of Fine Arts",
  SDS: "School of Design",
};

export type GradYear = 2025 | 2026 | 2027 | 2028;

export type Interest =
  | "Coffee"
  | "Hiking"
  | "Gaming"
  | "Music"
  | "Art"
  | "Cooking"
  | "Fitness"
  | "Reading"
  | "Travel"
  | "Photography"
  | "Dance"
  | "Film"
  | "Robotics"
  | "Startups"
  | "Board Games";

export type MatchMode = "dating" | "study";

export interface Profile {
  id: string;
  name: string;
  age: number;
  college: College;
  major: string;
  gradYear: GradYear;
  bio: string;
  interests: Interest[];
  photos: string[];
  matchMode: MatchMode[];
  lookingFor: string;
}

export interface Match {
  id: string;
  profileId: string;
  matchedAt: number;
  mode: MatchMode;
  lastMessage?: string;
  lastMessageAt?: number;
  unread: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export type SwipeDirection = "left" | "right" | "up";
