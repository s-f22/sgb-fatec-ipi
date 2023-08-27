import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, useNavigate, } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import Home from "./components/Home";
import React from "react";
import App from "./App";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AppRoutes = () => {
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }},
    [isAuthenticated, navigate]);
    
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
  domain={domain}
  clientId={clientId}
  authorizationParams={{
    redirect_uri: window.location.origin,
    
  }}
  >
    <React.StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>
  </Auth0Provider>
);

export default AppRoutes;
