import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import Swal from "sweetalert2"; // ✅ Import sweetalert2
import "./Register.scss"; // Custom styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://faryalnimra-newfake.hf.space/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // ✅ Show SweetAlert success popup
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/login"; // Update this path if your login page is different
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Left Side */}
        <div
          className="register-left"
          style={{
            backgroundImage: "url('/assets/eye-4453129_1280.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2>
            Forgot Password? <br /> Enter your email and new password
          </h2>
        </div>

        {/* Right Side */}
        <div className="register-right">
          <h1 className="register-title">Recover Password</h1>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter email"
              className="form-control mt-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter new password"
              className="form-control mt-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm new password"
              className="form-control mt-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
