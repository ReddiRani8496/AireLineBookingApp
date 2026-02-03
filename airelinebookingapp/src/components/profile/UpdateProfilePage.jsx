import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./UpdateProfilePage.css";

function UpdateProfilePage() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log("inside try");
      const response = await ApiService.getMyAccountDetails();
      setUser((prev) => ({
        ...prev,
        name: response.data.name,
        phoneNumber: response.data.phoneNumber,
      }));
    } catch (error) {
      console.log(error);
      showError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("inside the line 45", user);
    e.preventDefault();
    if (user.password != user.confirmPassword) {
      console.log("inside if block");
      return;
    }

    try {
      const requestBody = {
        name: user.name.trim() != "" && user.name,
        phoneNumber: user.phoneNumber.trim() != "" && user.phoneNumber,
        password: user.password || undefined,
      };
      console.log("request body", requestBody);

      const response = await ApiService.updateMyAccount(requestBody);
      if (response.statusCode == 200) {
        navigate("/profile");
      }
    } catch (error) {}
  };

  if (loading) return <div>Loading Profile</div>;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <ErrorDisplay />
        <SuccessDisplay />
        <div className="auth-header">
          <h2 className="update-profile-title">Update Profile</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <div className="update-profile-actions">
            <button type="submit" className="update-profile-submit">
              Save Changes
            </button>
            <Link to="/profile" className="update-profile-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfilePage;
