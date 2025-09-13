import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
export const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {
    axios,
    isLogin,
    setIsLogin,
    navigate,
    setUser,
    setIsAuthenticated,
    setIsOwner,
  } = useAppContext();
  useEffect(() => {
    if (isLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLogin]);
  const toggleForm = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ username: "", email: "", password: "" });
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLoginMode ? "/api/user/login" : "/api/user/register";
      const requestData = isLoginMode
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(endpoint, requestData);

      if (response.data.success) {
        const userData = response.data.user || { username: formData.username };
        setUser(userData);
        setIsAuthenticated(true);
        if (response.data.user?.role) {
          setIsOwner(response.data.user.role === "hotelOwner");
        }
        toast.success(
          isLoginMode ? "Login successful!" : "Account created successfully!"
        );
        setIsLogin(false);
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Network error. Please try again."
      );
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsLogin(false);
    }
  };

  if (!isLogin) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsLogin(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <IoClose className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex h-[600px] w-full">
          <div className="w-full hidden md:inline-block">
            <img
              className="h-full"
              src={assets.registerImage}
              alt="leftSideImage"
            />
          </div>

          <div className="w-full flex flex-col items-center justify-center p-8">
            <div className="md:w-96 w-full flex flex-col items-center justify-center">
              <h2 className="text-4xl text-gray-900 font-medium">
                {isLoginMode ? "Sign in" : "Sign up"}
              </h2>
              <p className="text-sm text-gray-500/90 mt-3">
                {isLogin
                  ? "Welcome back! Please sign in to continue"
                  : "Create your account to get started"}
              </p>

              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <FaUser className="text-gray-500" />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              {!isLoginMode && (
                <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-5">
                  <MdEmail className="text-gray-500" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email id"
                    className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    required
                  />
                </div>
              )}

              <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <FaLock className="text-gray-500" />

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              {isLoginMode && (
                <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                  <a className="text-sm underline" href="/forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLoginMode ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLoginMode ? (
                  "Login"
                ) : (
                  "Create Account"
                )}{" "}
              </button>
              <p className="text-gray-500/90 text-sm mt-4">
                {isLoginMode
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-indigo-400 hover:underline"
                >
                  {isLoginMode ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
