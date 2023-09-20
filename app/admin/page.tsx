'use client'
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';

const AdminPage: React.FC = () => {

  const handleEdit = (postId: string) => {
    window.location.href = `/admin/edit/${postId}`;
  };

  const handleDelete = (postId: string) => {
    // Implement the delete functionality here...
    // For example, make an API call to delete the post, then refresh the list
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <NewPostForm />
      <PostList onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default AdminPage
