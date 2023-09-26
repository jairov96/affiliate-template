'use client'
import { useSession } from 'next-auth/react';

const AdminPage: React.FC = () => {
  const session = useSession();
  const handleEdit = (postId: string) => {
    window.location.href = `/admin/edit/${postId}`;
  };

  const handleDelete = (postId: string) => {
    // Implement the delete functionality here...
    // For example, make an API call to delete the post, then refresh the list
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel OMG</h1>

      {session.user ? (<p>user logged</p>): (<p>User not logged</p>)}

    </div>
  );
};

export default AdminPage
