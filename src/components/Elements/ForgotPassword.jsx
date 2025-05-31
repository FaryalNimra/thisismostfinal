import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Register.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://faryalnimra-newfake.hf.space/ForgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.href = "/login";
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
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Lazy-loaded background image */}
          <img
            src="/assets/eye-4453129_1280.webp"
            alt="Background"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Text overlay at bottom of image */}
          <h2
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "#23299B",
              padding: "10px",
              borderRadius: "5px",
              margin: 0,
              maxWidth: "calc(100% - 40px)",
            }}
          >
            Forgot Password? <br /> Enter your email and new password
          </h2>
        </div>

        {/* Right Side */}
        <div className="register-right">
          <h1 className="register-title">Recover Password</h1>

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
