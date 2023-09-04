import { Container } from "react-bootstrap";
import Login from "./pages/LogIn"
import SignUp from "./pages/SignUp";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Welcome() {

  // ---------------------------- GERENCIAR VIA CONTEXT
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/sgb");
    }
    console.log(`Usuario logado: ${isAuthenticated}`)
  }, [isAuthenticated, navigate]);
  // ---------------------------- GERENCIAR VIA CONTEXT
  
  return (
    <Container>
      <img style={{ display: 'flex', width: 200, marginTop: 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5 }} src={"https://i.ibb.co/Y3mM4wk/fatec-logo.png"} alt="" />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 25 }}>
        <Login />
        {/* {console.log(`URL referencia: ${window.location.origin}`)} */}
        <SignUp />
      </div>
    </Container>
  );
}

export default Welcome;
