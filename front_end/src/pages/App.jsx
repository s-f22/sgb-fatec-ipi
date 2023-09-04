import React from 'react'
import { Container } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';


const Home = () => {

  // const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/sgb");
  //   }
  //   else navigate("/")
  // }, [isAuthenticated, navigate]);


  return (
    <Container>
      {console.log(`Usuario logado: ${isAuthenticated}`)}
      <Header />
      <Outlet />
      <Footer />
    </Container>
  )
}

export default Home