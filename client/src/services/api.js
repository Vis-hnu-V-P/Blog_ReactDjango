import axios from 'axios';

// Create an Axios instance with your API base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Load base URL from .env file
});

// Function to fetch posts
export const fetchPosts = async () => {
  try {
    const response = await API.get('/posts/'); // Call the Django API endpoint
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Function to create a new post
export const createPost = async (newPost) => {
  try {
    const response = await API.post('/posts/', newPost); // Send POST request
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
