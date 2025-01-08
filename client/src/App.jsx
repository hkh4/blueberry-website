import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "./App.scss";

import Loading from "./components/Loading/Loading";
import Header from "./components/Heading/Header";

import { useAuthContext } from "./hooks/useAuthContext";

const Home = lazy(() => import("./components/Home/Home"));
const Testing = lazy(() => import("./components/Testing/Testing"));
const Error400 = lazy(() => import("./components/Errors/Error400"));
const Error401 = lazy(() => import("./components/Errors/Error401"));
const Error403 = lazy(() => import("./components/Errors/Error403"));
const Error404 = lazy(() => import("./components/Errors/Error404"));
const Error500 = lazy(() => import("./components/Errors/Error500"));
const Signup = lazy(() => import("./components/Signup/Signup"));

function App() {

  const { user } = useAuthContext()

  // Redirect from www. if needed
  useEffect(() => {
    if (window.location.hostname.startsWith("www.")) {
      window.location.href = window.location.href.replace("www.", "")
    }
  })

  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />

          <Route path="/400" element={<Error400 />} />

          <Route path="/401" element={<Error401 />} />

          <Route path="/403" element={<Error403 />} />

          <Route path="/404" element={<Error404 />} />

          <Route path="/500" element={<Error500 />} />

          <Route path="/testing" element={<Testing />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
