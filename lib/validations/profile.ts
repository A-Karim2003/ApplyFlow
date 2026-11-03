import { z } from "zod";
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const avatarUploadSchema = z.object({
  contentType: z.enum(AVATAR_TYPES),
  size: z.number().int().positive().max(AVATAR_MAX_BYTES),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().max(50),
  bio: z.string().trim().max(500),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
