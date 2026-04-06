"use server";

import { signIn } from "@/auth"; // Importe depuis votre src/auth.ts
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // On passe directement le formData au fournisseur credentials
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Identifiants invalides.";
        default:
          return "Une erreur est survenue lors de la connexion.";
      }
    }
    // IMPORTANT : Next.js utilise des erreurs pour gérer les redirections.
    // Si vous ne relancez pas l'erreur, la redirection vers le dashboard échouera.
    throw error;
  }
}