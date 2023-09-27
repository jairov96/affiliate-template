import NextAuth, { SessionOptions, User } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
      authorize: async (credentials: Record<"username" | "password", string> | undefined): Promise<User | null> => {
        const envUsername = process.env.ADMIN_AUTH_LOGIN;
        const envPassword = process.env.ADMIN_AUTH_PASSWORD;

        if (credentials?.username === envUsername && credentials?.password === envPassword) {
          return {
            id: "1",
            name: 'Admin',
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    strategy: "jwt"
  }


};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };