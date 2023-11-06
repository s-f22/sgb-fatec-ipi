import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "moment/locale/pt-br";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";

function TemasListar() {
  const [trabalhos, setTrabalhos] = useState([]);
  const [alunos, setAlunos] = useState([]);

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const procurarAluno = (idAluno) => {
    const nomeAluno = alunos.find((a) => a.id_aluno === idAluno);
    return nomeAluno ? nomeAluno.nome : "Aluno não encontrado";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    axios
      .get("http://localhost:4004/temas")
      .then((response) => {
        setTrabalhos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os trabalhos:", error);
      });

    axios
      .get("http://localhost:4000/alunos")
      .then((response) => {
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os alunos:", error);
      });
  }, []);

  return (
    <Container fluid className="Trabalhos_Listar_Container">
      <h1>Listagem</h1>
      <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
        <Row>
          <Col xs={12} sm={6} md={4} lg={3}>
            {trabalhos.map((tema) => (
              <Card key={tema.id_tema}>
                <Card.Body>
                  <Card.Title>{tema.titulo}</Card.Title>
                  <Card.Text>{tema.descricao}</Card.Text>
                  <Card.Text>
                    Cadastrado em: {moment(tema.data_cadastro).format("LLL")}
                  </Card.Text>
                  <Card.Text>Autor: {procurarAluno(tema.id_autor)}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default TemasListar;
