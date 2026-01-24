import React, { useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./Registration.css";

function Login() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("inside handle submit");
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showError("All fields are required");
      return;
    }

    if (formData.password != formData.confirmPassword) {
      showError("Password do not match");
    }

    const loginData = {
      email: formData.email,
      password: formData.password,
    };
    try {
      console.log("inside try");
      const response = await ApiService.loginUser(loginData);
      console.log("response ", response);
      if (response.statusCode == 200) {
        ApiService.saveRoles(response?.data?.roles);
        ApiService.saveToken(response?.data?.token);
        navigate("/");
        showSuccess("Logged In successfully");
      } else {
        showError("Login is not successfull");
      }
    } catch (error) {
      console.log("inside catch", error);
      showError("Login is not successfull");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <ErrorDisplay />
        <SuccessDisplay />
        <div className="auth-header">
          <h2>Welcome to Rani Airlines</h2>
          <p>Sign in to book your next flight</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
