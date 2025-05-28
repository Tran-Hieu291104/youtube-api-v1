import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và xử lý query
  useEffect(() => {
    // Lấy token từ query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("youtubeToken", token);
      // Xóa query parameter khỏi URL
      window.history.replaceState({}, document.title, "/signin");
      navigate("/"); // Chuyển hướng về Home
      return;
    }

    // Kiểm tra token trong localStorage
    const storedToken = localStorage.getItem("youtubeToken");
    if (storedToken) {
      navigate("/"); // Chuyển hướng nếu đã có token
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Logic đăng nhập email/password (nếu cần)
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-2 sm:mb-2">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password or sign in with Google to access
              YouTube API.
            </p>
          </div>
          <div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <input
                    type="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-10 text-center">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border-b-2 border-green-500 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-green-500 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.805 10.023H12.831C12.831 10.023 12.831 7.677 12.831 6.135C14.373 6.135 17.457 6.501 18.513 8.619C18.999 9.645 19.173 11.145 18.687 12.315C18.201 13.485 17.151 14.127 16.239 14.127C16.239 14.127 15.981 14.127 15.897 14.127H15.897C15.897 14.127 15.897 13.953 15.897 13.611V10.527H12.831V14.127H17.457C18.171 14.127 19.173 13.953 19.689 13.269C20.205 12.585 20.379 11.661 20.205 10.959C20.031 10.257 19.173 10.023 19.173 10.023H21.805Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.831 10.023H3.621C3.621 10.023 3.621 12.369 3.621 13.911C5.199 13.911 8.359 13.545 9.429 11.403C9.919 10.419 10.094 8.919 9.614 7.751C9.128 6.583 8.078 5.941 7.166 5.941C7.166 5.941 6.908 5.941 6.824 5.941H6.824C6.824 5.941 6.824 6.115 6.824 6.457V9.541H3.621V5.941H8.359C9.073 5.941 10.075 6.115 10.591 6.799C11.107 7.483 11.281 8.407 11.107 9.109C10.933 9.811 10.075 10.045 10.075 10.045H12.831Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.621 13.911C3.621 13.911 3.621 16.257 3.621 17.799C5.199 17.799 8.359 17.433 9.429 15.315C9.919 14.331 10.094 12.831 9.614 11.663C9.128 10.495 8.078 9.853 7.166 9.853C7.166 9.853 6.908 9.853 6.824 9.853H6.824C6.824 9.853 6.824 10.027 6.824 10.369V13.453H3.621V9.853H8.359C9.073 9.853 10.075 10.027 10.591 10.711C11.107 11.395 11.281 12.319 11.107 13.021C10.933 13.723 10.075 13.957 10.075 13.957H12.831C12.831 13.957 12.831 11.611 12.831 10.069H3.621V13.911Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.831 13.911H21.805C21.805 13.911 21.805 16.257 21.805 17.799C20.227 17.799 17.067 17.433 15.997 15.315C15.507 14.331 15.332 12.831 15.812 11.663C16.298 10.495 17.348 9.853 18.26 9.853C18.26 9.853 18.518 9.853 18.602 9.853H18.602C18.602 9.853 18.602 10.027 18.602 10.369V13.453H21.805V9.853H17.067C16.353 9.853 15.351 10.027 14.835 10.711C14.319 11.395 14.145 12.319 14.319 13.021C14.493 13.723 15.351 13.957 15.351 13.957H12.831V13.911Z"
                    fill="#EA4335"
                  />
                </svg>
                {loading ? "Redirecting..." : "Đăng nhập với Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
