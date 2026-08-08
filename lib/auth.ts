import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { createProfile } from "@/actions/profiles";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  /*
    When a new user signs in for the first time, automatically create a matching profile linked to their Better Auth user account.
  */
  databaseHooks: {
    user: {
      // triggers when a user is created in user table
      create: {
        after: async (user) => {
          const [firstName, ...rest] = user.name.split(" ");
          const lastName = rest.join(" ");
          await createProfile({
            userId: user.id,
            firstName,
            lastName: lastName || "",
          });
        },
      },
    },
  },
});
