import { Link } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import GoogleLogin from "react-google-login";
import { useState } from "react";
import SearchPage from "./components/SearchPage";
import ErrorPage from "./components/ErrorPage";
import Navbar from "./components/Navbar";
function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const handleFailure = (result) => {
    console.log(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLoginData(data);
    localStorage.setItem("loginData", JSON.stringify(data));
  };

  if (!loginData) {
    <Route path="/SearchPage" element={<ErrorPage />} />;
  }
  let navigate = useNavigate();
  const routeChange = () =>{
    let path = `/SearchPage`;
    navigate(path);
  }


  return (
    <div className="App">
    <Navbar />
      <header className="App-header">
        <h1>Welcome To Book Search Appication</h1>

        <div>
          {loginData ? (
            <div>
            <h3>
            You Have Successfully Logged IN!
            </h3>
            <button type="button" class="btn btn-warning" onClick={routeChange}>SearchPage</button>
            </div>

          ) : (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
