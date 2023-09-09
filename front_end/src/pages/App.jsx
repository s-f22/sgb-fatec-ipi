import React from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';


const Home = () => {

  const [alunos, setAlunos] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    if(user)
    console.log(`ID DO USUARIO AUTH0: ${user.sub}`)
    console.log(user.sub.split('|')[1])
  
    return () => {
      
    }
  }, [])

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
      {/* <div className="card-container">
        {alunos.map(aluno => (
          <Card key={aluno.idaluno}>
            <Card.Body>
              <Card.Title>{aluno.nome}</Card.Title>
              <Card.Text>{aluno.email}</Card.Text>
              <Card.Text>{aluno.curso}</Card.Text>
              <Card.Text>{aluno.periodo}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div> */}
      <Footer />
    </Container>
  )
}

export default Home