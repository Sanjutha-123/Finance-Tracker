import React, { useState, useEffect } from "react";
import { FaLock, FaPhone, FaEnvelope, FaEdit, FaUser } from "react-icons/fa";
import "../Styles/Profilepage.css";

export default function ProfilePage() {
  // Form state (editable fields)
  const [formFullName, setFormFullName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhoto, setFormPhoto] = useState(null);

  // Display state (shown under profile photo)
  const [displayFullName, setDisplayFullName] = useState("");
  const [displayMobile, setDisplayMobile] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [displayPhoto, setDisplayPhoto] = useState(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Load saved profile
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
      setFormFullName(savedProfile.fullName || "");
      setFormMobile(savedProfile.mobile || "");
      setFormEmail(savedProfile.email || "");
      setFormPhoto(savedProfile.photo || null);

      // Display saved info under photo
      setDisplayFullName(savedProfile.fullName || "");
      setDisplayPhoto(savedProfile.photo || null);
    }
  }, []);

  // Save profile
  const handleSaveProfile = () => {
    const profileData = {
      fullName: formFullName,
      photo: formPhoto,
    };
    localStorage.setItem("profileData", JSON.stringify(profileData));

    // Update display state ONLY when saved
    setDisplayFullName(formFullName);
    setDisplayPhoto(formPhoto);
     if (formPhoto) setProfilePhoto(formPhoto);
    alert("Profile saved successfully");
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }
    localStorage.setItem("userPassword", newPassword);
    setCurrentPassword("");
    setNewPassword("");
    alert("Password updated");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
      
        <div className="profile-left">
          <div
            className="profile-img-wrapper"
            onClick={() => document.getElementById("photoInput").click()}
          >
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profile" className="profile-img" />
            ) : (
              <FaUser className="profile-placeholder-icon" />
            )}
            <button className="edit-icon">
              <FaEdit />
            </button>
          </div>

          <input
            type="file"
            id="photoInput"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handlePhotoChange}
          />

          <div className="profile-info">
            <h3>{displayFullName || "Your Name"}</h3>
      
          </div>

          <button className="edit-profile-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>

        {/* Right: Form */}
        <div className="profile-right">
          <h2>Edit Profile</h2>

          {/* Full Name */}
          <div className="profile-row">
            <label className="label">Full Name</label>
            <div className="input-with-icon">
              <FaUser className="icon-inside" />
              <input
                type="text"
                className="input-field"
                placeholder="Enter full name"
                value={formFullName}
                onChange={(e) => setFormFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="profile-row">
            <label className="label">Mobile Number</label>
            <div className="input-with-icon">
              <FaPhone className="icon-inside" />
              <input
                type="text"
                className="input-field"
                placeholder="Enter mobile number"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="profile-row">
            <label className="label">Email ID</label>
            <div className="input-with-icon">
              <FaEnvelope className="icon-inside" />
              <input
                type="email"
                className="input-field"
                placeholder="Enter email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveProfile}>
            Save
          </button>

          <h3 className="change-password-title">Change Password</h3>

          <div className="profile-row">
            <label className="label">Current Password</label>
            <div className="input-with-icon">
              <FaLock className="icon-inside" />
              <input
                type="password"
                className="input-field"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="profile-row">
            <label className="label">New Password</label>
            <div className="input-with-icon">
              <FaLock className="icon-inside" />
              <input
                type="password"
                className="input-field"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="save-btn" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
