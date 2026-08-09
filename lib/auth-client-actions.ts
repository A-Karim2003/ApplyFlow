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

export async function signInWithGoogle() {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });

  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message);
}
