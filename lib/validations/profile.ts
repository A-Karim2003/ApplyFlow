import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().max(50),
  bio: z.string().trim().max(500),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
