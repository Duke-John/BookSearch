import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SearchPage from "./components/SearchPage";
import Navbar from "./components/Navbar";

const rootElement = document.getElementById("root");
render(
  <>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/SearchPage" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  </>,
  rootElement
);
