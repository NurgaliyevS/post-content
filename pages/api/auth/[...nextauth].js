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
          scope: "identity mysubreddits submit read flair" // Add required scopes for posting and flairs
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
      }

      if (account && account.access_token && account.refresh_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + account.expires_at * 1000;
      }
      
      // Save Reddit tokens to JWT for API access
      if (token?.accessToken && token?.refreshToken) {
        token.redditId = token.sub;
        
        // Update user info in database
        const client = await clientPromise;
        const db = client.db();
        
        // Check if user exists
        let dbUser = await db.collection("users").findOne({ name: token.name });

        if (!dbUser) {
          // Create new user for Reddit sign-in
          const result = await db.collection("users").insertOne({
            name: token.name,
            email: token.email || null,
            redditId: token.sub,
            image: token.picture || null,
          });
          token.id = result.insertedId.toString();
        } else {
          // Update existing user with latest info
          await db.collection("users").updateOne(
            { name: token.name },
            {
              $set: {
                name: token.name,
                ...(token.email && { email: token.email }),
                image: token.picture || null,
                redditId: token.sub,
              }
            }
          );
          token.id = dbUser._id.toString();
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
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false,
};

export default NextAuth(authOptions);