import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const PostForm = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const navigate = useNavigate();
  const { id } = useParams(); 
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}api/posts/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch post data");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            title: data.title,
            content: data.content,
          });
        })
        .catch((error) => console.error("Error fetching post data:", error));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null); // Clear previous messages
    console.log(formData); // Debug: Ensure this contains valid data
  console.log(formData)
    const endpoint = id
      // ? `${import.meta.env.VITE_API_URL}api/posts/${id}/`
      ? `${import.meta.env.VITE_API_URL}api/posts/create/`
      : `${import.meta.env.VITE_API_URL}posts/new/`;
    
    try {
      const response = await fetch(endpoint, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSuccessMessage("Post saved successfully!"); // Set success message
        setTimeout(() => navigate("/posts"), 2000); // Navigate after 2 seconds
      } else {
        const errorData = await response.json();
        console.error("Failed to save post:", errorData);
        setErrorMessage("Failed to save post: " + (errorData.detail || "Unknown error")); // Set error message
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Error submitting form: " + error.message); // Set error message
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Alert Messages */}
      {successMessage && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-bold mb-2">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <label className="block text-sm font-bold mb-2">Content:</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        ></textarea>
        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-200 ${id ? 'bg-blue-500 hover:bg-blue- 600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {id ? "Update" : "Create"} Post
        </button>
      </form>
      <button
        onClick={() => navigate("/posts")}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200"
      >
        Cancel
      </button>
    </div>
  );
};

export default PostForm;