import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Register.scss";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Password validation function
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      minLength.test(password) &&
      upperCase.test(password) &&
      lowerCase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Frontend password validation
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/Register", {
        firstName,
        lastName,
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Left Side */}
        <div
          className="register-left"
          style={{
            backgroundImage: "url('/assets/eye-4453129_1280.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2>Capturing Moments, <br /> Creating Memories</h2>
        </div>

        {/* Right Side */}
        <div className="register-right">
          <h1 className="register-title">Create an Account</h1>
          <p className="register-text">
            Already have an account? <a href="/SignIn">Log in</a>
          </p>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="row">
              <div className="col-md-6">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="form-control" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="form-control" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                placeholder="Enter your password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="terms mt-3">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/PrivacyPolicy.pdf">Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
