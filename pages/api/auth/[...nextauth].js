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
          scope: "identity mysubreddits submit read" // Add required scopes for posting
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Save user ID to token
      if (user) {
        token.id = user.id;
        token.variant_name = user.variant_name || "free";
      }
      
      // Save Reddit tokens to JWT for API access
      if (account?.provider === "reddit") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000; // Convert to ms
        token.redditId = token.sub;
        
        // Update user info in database
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
      
      // Check if token needs refreshing
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        try {
          // Refresh the token
          const response = await fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
              ).toString("base64")}`,
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refreshToken,
            }),
          });

          const refreshedTokens = await response.json();

          if (!response.ok) {
            throw refreshedTokens;
          }

          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.variant_name = token.variant_name;
        // Add the access token to the session
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
};

export default NextAuth(authOptions);