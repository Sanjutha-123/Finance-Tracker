// Components/Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Load saved profile photo from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile?.photo) setProfilePhoto(savedProfile.photo);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar profilePhoto={profilePhoto} />
      <div style={{ flex: 1, padding: "20px" }}>
        {React.cloneElement(children, { profilePhoto, setProfilePhoto })}
      </div>
    </div>
  );
}
