import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    providerAccountId?: string;
    twitchData?: any;
    socialAccount?: {
      provider: string;
      socialId: string;
      email: string;
      profileUrl: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    provider?: string;
    accessToken?: string;
    profile?: any;
  }
}
