import { createProfile } from "@/actions/profiles";
import { authClient } from "./auth-client";

export async function signUpWithEmail(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const { data, error } = await authClient.signUp.email({
    name: `${firstName} ${lastName}`,
    email,
    password,
  });

  if (error) throw new Error(error.message);

  try {
    await createProfile({
      userId: data.user.id,
      firstName,
      lastName,
    });
  } catch (profileError) {
    //? deleted created user to prevent orphaned profile
    const { error: deleteError } = await authClient.deleteUser({
      callbackURL: "/sign-up",
    });
    if (deleteError) {
      console.error(
        "Rollback failed — orphaned user:",
        data.user.id,
        deleteError,
      );
    }

    const message =
      profileError instanceof Error ? profileError.message : "Unknown error";
    console.error("Profile creation failed:", message);

    throw new Error("Failed to complete sign-up. Please try again.");
  }

  return data;
}

export async function signInWithEmail(
  email: string,
  password: string,
  rememberMe?: boolean,
) {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    rememberMe,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message);
}
