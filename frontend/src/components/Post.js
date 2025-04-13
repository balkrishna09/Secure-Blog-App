import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && post.author._id === user._id;
  const isAdmin = user && user.isAdmin;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Link to={`/post/${post._id}`} className="hover:text-indigo-600 transition-colors duration-200">
                {post.title}
              </Link>
            </h2>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="font-medium text-indigo-600">{post.author.username}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {(isAuthor || isAdmin) && (
            <div className="flex space-x-3">
              <Link
                to={`/edit-post/${post._id}`}
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-12 12a2 2 0 01-2.828 0 2 2 0 010-2.828l12-12z" />
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-12 12a2 2 0 01-2.828 0 2 2 0 010-2.828l12-12z" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 line-clamp-3 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </article>
  );
};

export default Post; 