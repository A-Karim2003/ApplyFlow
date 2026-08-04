import { authClient } from "./auth-client";

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
) {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
    callbackURL: "/dashboard",
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

export async function signOut() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message);
}
