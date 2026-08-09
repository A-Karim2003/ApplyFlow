import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },

  /*
    When a new user signs in for the first time, automatically create a matching profile linked to their Better Auth user account.
  */
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [firstName, ...rest] = user.name.split(" ");
          const lastName = rest.join(" ");

          try {
            await db.insert(schema.profilesTable).values({
              userId: user.id,
              firstName: firstName || "",
              lastName: lastName || "",
            });
          } catch (err) {
            console.error(
              "Profile creation failed, rolling back user:",
              user.id,
              err,
            );

            await db.delete(schema.user).where(eq(schema.user.id, user.id));
          }
        },
      },
    },
  },
});
