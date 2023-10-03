import NextAuth, { NextAuthOptions } from "next-auth"
import GitlabProvider from "next-auth/providers/gitlab";

import { connectToDB } from "@utils/database";
import userModel from "@models/user";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  
  providers: [
    GitlabProvider({
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET
    }),
  ],
  
  callbacks: {
    // async jwt({ token, user, account, profile, isNewUser }) {

    //   return token
    // },
    async session({ session }){
      const sessionUser = await userModel.findOne({
        email: session.user.email
      });

      session.user.id = sessionUser._id;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }){
      console.log(JSON.stringify({
        user: user,
        account: account,
        profile: profile,
        email: email,
        credentials: credentials,
      }, null, 2));
      try {
        await connectToDB();
        
        // check if the user already exists
        const userExists = await userModel.findOne({
          email: profile!.email!,
        });

        // if not, create a new user
        if (!userExists){
          await userModel.create({
            username: profile!.name!.trim(),
            email: profile!.email!.toLowerCase(),
            avaster: profile!.avatar_url,
            groups: profile!.groups,
          })
        } 
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};