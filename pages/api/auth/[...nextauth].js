import NextAuth from "next-auth";
import RedditProvider from "next-auth/providers/reddit";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/backend/mongodbClient";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      authorization: {
        params: {
          duration: "permanent", // Request a refresh token for permanent access
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.variant_name = user.variant_name || "free";
      }
      
      // Handle Reddit sign-ins
      if (account?.provider === "reddit") {
        const client = await clientPromise;
        const db = client.db();
        
        // Check if user exists
        let dbUser = await db.collection("users").findOne({ redditId: token.sub });

        if (!dbUser) {
          // Create new user for Reddit sign-in
          const result = await db.collection("users").insertOne({
            name: token.name,
            email: token.email || null,
            redditId: token.sub,
            image: token.picture || null,
            variant_name: token.variant_name || "free",
          });
          token.id = result.insertedId.toString();
        } else {
          token.id = dbUser._id.toString();
          token.variant_name = dbUser.variant_name || "free";
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.variant_name = token.variant_name;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
};

export default NextAuth(authOptions);