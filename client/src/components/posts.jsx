import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const signedUser = localStorage.getItem("user");

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data.reverse());
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const timer = setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, successMessage]);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/${postId}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete post. Status: ${response.status}`);
        }

        setSuccessMessage("Post deleted successfully!");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Failed to delete the post.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-gray-700">
          Loading posts...
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {signedUser ? (
            <h1 className="text-2xl font-bold">
              Welcome, <span className="underline decoration-white">{signedUser}</span>!
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">
              Welcome, <span className="italic">Guest</span>!
            </h1>
          )}
          <button
            className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow-md hover:bg-blue-50"
            onClick={() => navigate("/login")}
          >
            {signedUser ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        {posts.length > 0 ? (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.id} className="border border-gray-200 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <p className="text-gray-600 mt-2">
                  Author: <span className="text-blue-500">{post.author}</span>
                </p>
                <div className="mt-4 flex gap-4">
                  {post.author === signedUser && (
                    <>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => navigate(`/posts/edit/${post.id}`)}
                      >
                        Edit Post
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete Post
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No posts available.</p>
        )}
        <div className="flex justify-center mt-8">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            onClick={() => navigate("/posts/new")}
          >
            Create New Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
