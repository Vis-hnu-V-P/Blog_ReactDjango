import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import KJUR from 'jsrsasign';
import '../index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // const decodeToken = (token) => {
  //   try {
  //     const decoded = KJUR.jws.JWS.parse(token);
  //     return decoded.payloadObj;
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return null;
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
  
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
  
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
  
        navigate('/posts');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/api/login/', {
  //       username,
  //       password, 
  //     });

  //     const token = response.data.token;
  //     localStorage.setItem('user', response.data.user);

  //     if (token) {
  //       // const decoded = decodeToken(token);
  //       // if (decoded) {
  //       //   const userId = decoded.user_id;
  //         localStorage.setItem('token', token);
  //         // localStorage.setItem('userId', userId);
  //         navigate('/posts');
  //       // } else {
  //       //   setError('Failed to decode the token');
  //       // }
  //     } else {
  //       setError('No token received from server');
  //     }
  //   } catch (err) {
  //     setIsLoading(false);
  //     console.error('Login error:', err.response ? err.response.data : err.message);
  //     setError('Invalid username or password');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password} // Changed from password1 to password
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded transition duration-200 ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Do not have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
