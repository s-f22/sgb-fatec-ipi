import React from "react";
import 'primeicons/primeicons.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/SideBar";

const Home = () => {
  const [alunos, setAlunos] = useState([]);
  const { user } = useAuth0();

  // const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/sgb");
  //   }
  //   else navigate("/")
  // }, [isAuthenticated, navigate]);

  return (
    <Container fluid >
      <Row>
        <Col style={{padding: 0}} md={2}>
          <Sidebar />
        </Col>
        <Col style={{padding: 0}} md={10} className="App_MainContent">
          <Header />
          <Outlet />
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
