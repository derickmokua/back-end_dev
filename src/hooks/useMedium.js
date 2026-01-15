import { useState, useEffect } from 'react';

const useMediumPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const RSS_URL = 'https://medium.com/feed/@derickmokua';
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                if (data.status !== 'ok') {
                    throw new Error('Failed to fetch Medium posts');
                }

                const formattedPosts = data.items.map(item => {
                    // Extract first image from content if thumbnail is missing
                    let coverImage = item.thumbnail;
                    if (!coverImage) {
                        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                        if (imgMatch) {
                            coverImage = imgMatch[1];
                        }
                    }

                    // Create a plain text brief from description
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description;
                    const plainText = tempDiv.textContent || tempDiv.innerText || '';
                    const brief = plainText.substring(0, 150) + '...';

                    return {
                        title: item.title,
                        desc: brief,
                        date: new Date(item.pubDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }),
                        tags: item.categories || [],
                        link: item.link,
                        html: item.content, // Medium content is HTML
                        coverImage: coverImage,
                    };
                });

                setPosts(formattedPosts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Medium posts:', err);
                setError(err);
                setPosts([]);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return { posts, loading, error };
};

export default useMediumPosts;
