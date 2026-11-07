import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "@/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
