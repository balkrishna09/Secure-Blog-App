import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PostForm = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      fetchPost();
    }
  }, [isEdit, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setFormData({
        title: response.data.title,
        content: response.data.content
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await axios.patch(`http://localhost:5000/api/posts/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/posts', formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors({
        submit: error.response?.data?.error || 'An error occurred while saving the post'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              } focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm; 