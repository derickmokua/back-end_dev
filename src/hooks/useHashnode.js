import { useState, useEffect } from 'react';

const useHashnodePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the host provided by the user
  const host = import.meta.env.VITE_HASHNODE_HOST || 'derickmokua.hashnode.dev';
  const rawApiUrl = import.meta.env.VITE_HASHNODE_API_URL || 'https://gql.hashnode.com';
  const apiUrl = rawApiUrl.replace(/\/$/, '');

  useEffect(() => {
    // console.log('Hashnode Hook Initialized');
    // console.log('Host:', host);
    // console.log('API URL:', apiUrl);

    const fetchPosts = async () => {
      // API v3 is paid-only, return empty and use static posts fallback
      setPosts([]);
      setLoading(false);
    };

    fetchPosts();
  }, [host, apiUrl]);

  return { posts, loading, error };
};

export default useHashnodePosts;
