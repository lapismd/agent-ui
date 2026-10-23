export interface ProfileDetails {
  display_name: string;
  description: string;
  avatar: string | null;
  email: string | null;
  gravatar: boolean;
}
export interface PersonalProfile {
  principal: string;
  revision: number;
  details: ProfileDetails;
  /** Host-resolved uploaded image or opt-in Gravatar URL; never saved as identity. */
  avatarUrl?: string;
}
export interface ProfileRequest {
  id: string;
  revision: number;
  details: ProfileDetails;
}
export interface ProfileDraft {
  details: ProfileDetails;
  pending?: ProfileRequest;
}
export type ProfileOutcome =
  | { state: "rejected"; message: string }
  | { state: "saved"; profile: PersonalProfile }
  | { state: "conflict"; profile: PersonalProfile }
  | { state: "not-known" | "unknown" };
export interface ProfileRead {
  profile: PersonalProfile;
  draft?: ProfileDraft;
  images?: Record<string, string>;
}
/** Installation persistence and image preparation remain entirely host-owned. */
export interface ProfilePort {
  read(signal: AbortSignal): Promise<ProfileRead>;
  draft(value: ProfileDraft | null): Promise<void>;
  save(request: ProfileRequest): Promise<ProfileOutcome>;
  inspect(request: ProfileRequest): Promise<ProfileOutcome>;
  upload(
    file: File,
    signal: AbortSignal,
  ): Promise<{ reference: string; url: string }>;
}
export interface ProfileState {
  profile?: PersonalProfile;
  draft?: ProfileDetails;
  pending?: ProfileRequest;
  images: Record<string, string>;
  loading: boolean;
  busy: boolean;
  error: string;
  conflict: boolean;
  outcome: "" | "saved" | "not-known";
}
