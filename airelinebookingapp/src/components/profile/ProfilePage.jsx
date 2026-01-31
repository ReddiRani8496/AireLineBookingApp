import React, { use, useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import ApiService from "../../services/ApiService";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchUserBookings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log("inside try");
      const response = await ApiService.getMyAccountDetails();
      setUser(response.data);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await ApiService.getMyBookings();
      setBookings(response.data);
    } catch (error) {}
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div>Loading Profile...</div>;
  if (!user) return <div>User Not Found</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <ErrorDisplay />
        <div className="profile-header">
          <h2 className="profile-container-heading">My Account</h2>
          <div className="welcome-message">
            Welcome back, <strong>{user.name}</strong>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab == "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab == "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "profile" ? (
            <div className="profile-info">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{user.phoneNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Account Status:</span>
                  <span className="value">
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <h3>Account Security</h3>
                <div className="info-row">
                  <span className="label">Email Verified:</span>
                  <span className="value">
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Login Method:</span>
                  <span className="value">{user.provider}</span>
                </div>
                <Link to="/update/profile" className="update-profile">
                  Update Profile
                </Link>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
