import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),

  // Pagar.me v4
  PAGARME_API_KEY: z.string().startsWith("ak_"),
  PAGARME_ENCRYPTION_KEY: z.string().startsWith("ek_"),

  // Tiny ERP v2
  TINY_API_TOKEN: z.string().min(1),

  // Melhor Envio
  MELHOR_ENVIO_TOKEN: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

function getEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues.map(
      (i) => `  ${i.path.join(".")}: ${i.message}`
    );
    console.error("Missing or invalid environment variables:\n" + missing.join("\n"));

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables");
    }
  }

  return process.env as unknown as z.infer<typeof envSchema>;
}

export const env = getEnv();
