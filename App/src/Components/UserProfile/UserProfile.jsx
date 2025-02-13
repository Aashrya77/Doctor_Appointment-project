import { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(data);
    } catch (err) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-content">
          <div className="profile-avatar">
            <img
              src={
                user.role == "Patient"
                  ? user.gender == "Male"
                    ? "Male_Patient.png"
                    : "Female_Patient.png"
                  : user.gender == "Male"
                  ? "Male_Doctor.png"
                  : "Female_Doctor.jpg"
              }
              alt="User Avatar"
              className="avatar-img"
            />
          </div>
          <div className="profile-details">
            <p className="profile-info">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="profile-info">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="profile-info">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="profile-info">
              <strong>Gender:</strong> {user.gender}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
