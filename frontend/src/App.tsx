import "./App.css";

import { Routes, Route } from "react-router-dom";
import BibleHomepage from "./homepage/home";
import ReaderPage from "./homepage/bible";
import ProfilePage from "./authpage/user";
import LoginPage from "./authpage/login";
import SignupPage from "./authpage/register";
import SearchResults from "./homepage/search";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BibleHomepage />} />
        <Route path="/bible" element={<ReaderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResults/>}/>
      </Routes>
    </>
  );
}

export default App;
