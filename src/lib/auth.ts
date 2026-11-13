import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "@/lib/db";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
        jwt(), 
    ],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 3 * 24 * 60 * 60
    }
  }
});
