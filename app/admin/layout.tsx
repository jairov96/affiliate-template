"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import AuthCheck from "../components/AuthCheck"

export default function AdminLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    const { data: session, status } = useSession();

    return (
    <>
      {status === "authenticated" ? (
        <button className="bg-sky-600" onClick={() => signOut()}>
          SignOut
        </button>
      ) : (
        <button className="bg-sky-300" onClick={() => signIn("credentials")}>
          Sign in
        </button>
      )}
      <AuthCheck>
          <section>
            <nav></nav>
            {children}
          </section>
      </AuthCheck>
    </>
    )
  }