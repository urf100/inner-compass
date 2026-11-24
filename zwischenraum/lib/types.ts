// Handgeschriebene Typen passend zu supabase/migrations.

export type UserRole = "therapist" | "client";

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  therapist_id: string | null;
  created_at?: string;
}

export interface Invitation {
  id: string;
  therapist_id: string;
  code: string;
  label: string | null;
  expires_at: string;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  client_id: string;
  entry_date: string; // YYYY-MM-DD
  mood: number;
  content: string;
  tags: string[];
  is_shared: boolean;
  shared_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionNote {
  id: string;
  therapist_id: string;
  client_id: string;
  session_date: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentSlot {
  id: string;
  therapist_id: string;
  starts_at: string;
  ends_at: string;
  client_id: string | null;
  booked_at: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  therapist_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseAssignment {
  id: string;
  exercise_id: string;
  therapist_id: string;
  client_id: string;
  note: string | null;
  assigned_at: string;
  completed_at: string | null;
  reflection: string | null;
  updated_at: string;
}

export interface CrisisContact {
  name: string;
  phone: string;
  note: string;
}

export interface CrisisPlan {
  client_id: string;
  warning_signs: string;
  helpful_actions: string;
  contacts: CrisisContact[];
  updated_by: string | null;
  updated_at: string;
}
