import React from "react";
import "./Navbar.css";
const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    window.href = "/";
    window.location.reload();
  }
  return (
    <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      Navbar
      <button type="button" class="btn btn-link px-3 me-2" onClick={() => handleLogout()}>Logout</button>
    </nav>
    </div>
  );
};

export default Navbar;
