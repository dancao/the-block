import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .min(1, "Last name is required"),

  email: z
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  usePageTitle('Sign Up - The Block');
  const navigate = useNavigate();

  const setAccessToken = useAuthStore(
    (state) => state.setTokens
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const response = await api.post('/profiles/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });

      setAccessToken(response.data.token, response.data.token);
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('API error:', err);
      alert(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* First Name */}

          <div>

            <label className="block mb-2 font-medium">
              First Name
            </label>

            <input
              {...register("firstName")}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="John"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}

          </div>

          {/* Last Name */}

          <div>

            <label className="block mb-2 font-medium">
              Last Name
            </label>

            <input
              {...register("lastName")}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="Smith"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="john@example.com"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="********"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}

          </div>

          {/* Buttons */}

          <div className="space-y-3 pt-2">

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting
                ? "Signing Up..."
                : "Sign Up"}
            </button>

            <div className="text-center text-sm text-gray-600 gap-2">
              Already have an account?&nbsp;
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;