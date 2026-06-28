import { useEffect, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

const Signin: React.FC = () => {
  usePageTitle('Sign In - The Block');
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const setAccessToken = useAuthStore(
    (state) => state.setTokens
  );

  useEffect(() => {
    const initData = async () => {
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberEmail(true);
      }
    };

    initData();

  }, []);

  const handleLogin = async () => {
    if (rememberEmail)
      localStorage.setItem("savedEmail", email);
    else
      localStorage.removeItem("savedEmail");

    try {
      const response = await api.post('/profiles/login', {
        email: email,
        password: password
      });

      setAccessToken(response.data.token, response.data.token);
      localStorage.setItem("loggedEmail", email);
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('API error:', err);
      alert('Failed to sign in, please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Login
        </h1>
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center mb-6">
          <input
            id="remember"
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) =>
              setRememberEmail(e.target.checked)
            }
            className="h-4 w-4"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm"
          >
            Remember my email
          </label>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className="
                w-full
                rounded-lg
                bg-blue-600
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:bg-gray-400
            "
          >
            Login
          </button>
          <div className="text-center text-sm text-gray-600 gap-2">
            Don't have an account?&nbsp;
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signin;