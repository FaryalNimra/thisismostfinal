import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "./ContactForm.scss";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://faryalnimra-newfake.hf.space/Contact", {
        email,
        query,
        message,
      });
      console.log(response.data);

      // ✅ Sweet success alert
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ Clear fields after success
      setEmail("");
      setQuery("");
      setMessage("");
    } catch (error) {
      console.error(error.response?.data);

      // ❌ Sweet error alert
      Swal.fire({
        icon: "error",
        title: "Message Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="contactform-wrapper">
      <div className="contactform-container">
        <h3 className="contactform-heading">"OR"</h3>
        <h3 className="contactform-heading">Send Us Message</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Your Email Field */}
          <div className="form-group">
            <label htmlFor="email">Enter Your Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Your Query Dropdown */}
          <div className="form-group">
            <label htmlFor="query">What's Your Query??</label>
            <select
              id="query"
              className="form-control"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback & Suggestions</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message">Any Additional Comments</label>
            <textarea
              id="message"
              className="form-control"
              rows="6"
              placeholder="Type your message here..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Send Button */}
          <div className="form-group text-center">
            <button type="submit" className="btn-primary">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
