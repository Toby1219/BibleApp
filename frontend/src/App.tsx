import "./App.css";

import { Routes, Route } from "react-router-dom";
import BibleHomepage from "./homepage/home";
import ReaderPage from "./homepage/bible";
import ProfilePage from "./authpage/user";
import LoginPage from "./authpage/login";
import SignupPage from "./authpage/register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BibleHomepage />} />
        <Route path="/bible" element={<ReaderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
