import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../index.css';

const EditPost = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch post. Status: ${response.status}`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error(`Failed to update post. Status: ${response.status}`);
      
      setSuccessMessage("Post updated successfully!"); // Set success message
      setError(null); // Clear any previous errors
      setTimeout(() => {
        navigate("/posts"); // Navigate after a short delay
      }, 2000); // Delay for 2 seconds to allow the user to see the message
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-lg font-semibold text-gray-700">Loading post...</div></div>;
  if (error) return <div className="error-message text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Post</h1>

      {/* Alert Messages */}
      {successMessage && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Content:</label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-200 bg-blue-500 hover:bg-blue-600`}
        >
          Update Post
        </button>
      </form>
      <button
        onClick={() => navigate("/posts")}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray -600 transition duration-200"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditPost;