import { getAuth } from "firebase/auth";
import { apiFetch } from "./config";
import type { MeResponse } from "@/types/user";

export async function getProfile(idToken: string): Promise<MeResponse> {
  return apiFetch<MeResponse>("/User/me", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

export async function bootstrap(): Promise<MeResponse> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not logged in (Firebase currentUser is null).");
  }

  const token = await user.getIdToken(); 
  return getProfile(token);
}
