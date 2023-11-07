import { Container, Button, Row, Col } from "react-bootstrap";
import Login from "./components/LogIn";
import SignUp from "./components/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "./logo.png";

function Welcome() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    isAuthenticated && navigate("/sgb");
    // console.log(user.sub)
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="justify-content-center align-items-center"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <img
        style={{ width: 260, height: 268 }}
        src={logo}
        alt="FATEC Logo"
        className="img-fluid mb-4"
      />
      <p
        className="mb-6"
        style={{
          width: 209,
          height: 69,
          fontSize: 15,
          fontWeight: "bold",
          textAlign: "justify",
          color: "#345059",
        }}
      >
        Bem vinda ao Sistema de Gerenciamento de Bancas da Fatec Ipiranga!
      </p>

      <div style={{ gap: 10 }} className="d-flex justify-content-center mb-4">
        <Login />
        <SignUp />
      </div>
    </div>
  );
}

export default Welcome;
