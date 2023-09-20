// components/PostList.tsx

import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
}

interface Props {
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

const PostList: React.FC<Props> = ({ onDelete, onEdit }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id} className="mb-4">
          <h2 className="text-xl">{post.title}</h2>
          <div>
            <button 
              onClick={() => onEdit && onEdit(post.id)} 
              className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete && onDelete(post.id)} 
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
