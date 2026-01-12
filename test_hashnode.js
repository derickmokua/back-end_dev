
const host = 'derickmokua.hashnode.dev';
const apiUrl = 'https://gql.hashnode.com';

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

async function fetchPosts() {
    console.log(`Fetching from ${apiUrl} for host ${host}...`);
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
        console.log('Status:', response.status);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchPosts();
