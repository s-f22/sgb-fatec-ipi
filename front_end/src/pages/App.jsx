import React from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../components/SideBar';


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
    <Container >
      {console.log(`Usuario logado: ${isAuthenticated}`)}
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </Container>
  )
}

export default Home