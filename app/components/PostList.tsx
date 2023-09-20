'use client'
import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
}

interface Props {
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

const ITEMS_PER_PAGE = 5;

const PostList: React.FC<Props> = ({ onDelete, onEdit }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const fetchPosts = async (page: number) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    try {
      const response = await fetch(`/api/posts?skip=${skip}&take=${ITEMS_PER_PAGE}`);
      const { posts, totalPosts } = await response.json();
      setPosts(posts);
      setTotalPosts(totalPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  return (
    <div>
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

      <div className="mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostList;
