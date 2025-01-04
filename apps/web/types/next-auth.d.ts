import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
  
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
} 