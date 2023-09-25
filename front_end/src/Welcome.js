import { Container, Button, Row, Col } from "react-bootstrap";
import Login from "./components/LogIn"
import SignUp from "./components/SignUp";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Welcome() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  useEffect(() => {
    isAuthenticated &&
      navigate("/sgb");
      // console.log(user.sub)
  }, [isAuthenticated, navigate]);
  
  return (
    <Container className="text-center">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6}>
          <img style={{borderRadius: 30}} src="https://i.ibb.co/Y3mM4wk/fatec-logo.png" alt="FATEC Logo" className="img-fluid mb-4" />
          <h1 className="mb-3">Bem-vindo ao Sistema de Gerenciamento de Bancas</h1>
          <p className="lead text-muted mb-4">FATEC Ipiranga</p>
          <div style={{ gap: 10 }} className="d-flex justify-content-center mb-4">
            <Login />
            <SignUp />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
