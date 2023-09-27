"use client";
import AuthProvider from "@/middleware/authProvider";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const AdminPage: React.FC = () => {
  const { data: session, status } = useSession();

  const handleEdit = (postId: string) => {
    window.location.href = `/admin/edit/${postId}`;
  };

  const handleDelete = (postId: string) => {
    // Implement the delete functionality here...
    // For example, make an API call to delete the post, then refresh the list
  };

  return (
    <AuthProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        {status === 'authenticated' ?
          <button className="bg-sky-600" onClick={() => signOut()}>SignOut</button>
          :
          <button className="bg-sky-300" onClick={() => signIn("credentials")}>Sign in</button>
        }

        

      </div>
    </AuthProvider>
  );
};

export default AdminPage;
