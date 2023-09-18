import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Trabalhos_Listar() {
  const [trabalhos, setTrabalhos] = useState([]);

  

  // useEffect(() => {
  //   axios.get('sua_api_aqui')
  //     .then(response => {
  //       setTrabalhos(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Erro ao buscar os trabalhos:', error);
  //     });
  // }, []);
  useEffect(() => {
    setTrabalhos(
      [
        {
          id_trabalho: 1,
          titulo: "Sistema Gerenciador de Bancas",
          descricao: "Aqui teremos toda a descrição do trabalho com informações diversas"
        },
        {
          id_trabalho: 2,
          titulo: "Sistema Gerenciador de Bancas",
          descricao: "Aqui teremos toda a descrição do trabalho com informações diversas"
        }
      ]
    )
  }, []);

  return (
    <div className='Trabalhos_Listar_Container'>
      <h1>Listagem</h1>
      {trabalhos.map(trabalho => (
        <Col key={trabalho.id_trabalho} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <Card.Body>
              <Card.Title>{trabalho.titulo}</Card.Title>
              <Card.Text>{trabalho.descricao}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </div>
  );
}

export default Trabalhos_Listar;
