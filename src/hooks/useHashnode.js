import { useState, useEffect } from 'react';

const useHashnodePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the host provided by the user
  const host = import.meta.env.VITE_HASHNODE_HOST || 'derickmokua.hashnode.dev';
  const apiUrl = import.meta.env.VITE_HASHNODE_API_URL || 'https://gql.hashnode.com';

  useEffect(() => {
    console.log('Hashnode Hook Initialized');
    console.log('Host:', host);
    console.log('API URL:', apiUrl);

    const fetchPosts = async () => {
      // Querying by 'publication' is the standard for the v3 API
      const query = `
        query GetPublicationPosts($host: String!) {
          publication(host: $host) {
            posts(first: 6) {
              edges {
                node {
                  title
                  brief
                  slug
                  publishedAt
                  coverImage {
                    url
                  }
                  tags {
                    name
                  }
                  url
                  content {
                    markdown
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { host },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (!result.data.publication) {
          console.warn('Hashnode publication not found for host:', host);
          setPosts([]);
          setLoading(false);
          return;
        }

        const formattedPosts = result.data.publication.posts.edges.map(({ node }) => ({
          title: node.title,
          desc: node.brief,
          date: new Date(node.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          tags: node.tags ? node.tags.map((t) => t.name) : [],
          link: node.url, // Keep the link just in case
          markdown: node.content.markdown, // Full markdown content
          coverImage: node.coverImage ? node.coverImage.url : null,
        }));

        setPosts(formattedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Hashnode posts:', err);
        setError(err);
        setPosts([]); // Ensure empty state on error
        setLoading(false);
      }
    };

    fetchPosts();
  }, [host, apiUrl]);

  return { posts, loading, error };
};

export default useHashnodePosts;
