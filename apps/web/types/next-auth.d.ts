import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    id?: number;
    name?: string;
    email?: string;
  }
  
  interface Session {
    user?: {
      id?: number;
      name?: string | null;
      email?: string | null;
      accessToken?: string;
    };
  }
} 