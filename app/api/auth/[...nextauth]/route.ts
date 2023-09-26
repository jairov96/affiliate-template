import NextAuth, { SessionOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
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

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  session: {},
});
