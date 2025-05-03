import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "./Login.scss";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/Login", {
        email,
        password,
      });

      // ✅ Show SweetAlert2 success popup
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ Navigate after 2 seconds
      setTimeout(() => {
        navigate("/Product");
      }, 2000);
    } catch (error) {
      console.error(error.response?.data);

      // ❌ Show SweetAlert2 error popup
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side */}
        <div
          className="login-left"
          style={{
            backgroundImage: "url('/assets/eye-4453129_1280.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2>Welcome Back!<br /> Log in to Continue</h2>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h1 className="login-title">Log In</h1>
          <p className="login-text">
            Don't have an account? <a href="/Register">Sign Up</a>
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="form-control mt-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-field mt-3">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">Log In</button>

            
          </form>

          <div className="forgot-password mt-3">
            <a href="/ForgotPassword">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
