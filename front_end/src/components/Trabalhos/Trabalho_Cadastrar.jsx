import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Trabalho_Cadastrar = () => {
  const [orientadores, setOrientadores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [formData, setFormData] = useState({
    id_orientador: 0,
    id_tema: 0,
    previsao_defesa: '',
  });
  const [semestre, setSemestre] = useState("01");
  const [ano, setAno] = useState(new Date().getFullYear().toString());

  const navigate = useNavigate();



  useEffect(() => {
    // Carregar orientadores
    axios.get('http://localhost:4001/professores')
      .then(response => setOrientadores(response.data))
      .catch(error => console.error(error));

    // Carregar temas
    axios.get('http://localhost:4004/temas')
      .then(response => setTemas(response.data))
      .catch(error => console.error(error));
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const previsaoDefesa = `${semestre}|${ano}`;

    const dadosCadastro = {
      id_orientador: formData.id_orientador,
      id_tema: formData.id_tema,
      previsao_defesa: previsaoDefesa,
    };

    await axios.post('http://localhost:4005/trabalhos', dadosCadastro)
      .then(response => {
        console.log('Trabalho cadastrado com sucesso:', response.data);

        toast.success('Tema cadastrado com sucesso!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        navigate('/sgb')

      })
      .catch(error => {
        console.error('Erro ao cadastrar trabalho:', error)
        toast.error('Erro ao cadastrar o tema. Tente novamente mais tarde.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };


  return (
    <Form className='Temas_Container' onSubmit={handleSubmit}>
      <Form.Group controlId="formOrientador">
        <h1>Cadastrar Trabalho</h1>
        <Container fluid>
          <Row >
            <h3 >Previsão de entrega e apresentação:</h3>
            <Col md={2}>
              <Form.Group controlId="formSemestre">
                <Form.Label>Semestre</Form.Label>
                <Form.Control
                  as="select"
                  name="semestre"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                >
                  <option value="00">Selecione</option>
                  <option value="01">1º Semestre</option>
                  <option value="02">2º Semestre</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="formAno">
                <Form.Label>Ano</Form.Label>
                <Form.Control
                  type="number"
                  name="ano"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Container>
        <Form.Group controlId="formTema">
          <Form.Label>Tema</Form.Label>
          <Form.Control
            as="select"
            name="id_tema"
            value={formData.id_tema}
            onChange={handleInputChange}
          >
            <option value="">Selecione um tema</option>
            {temas.map(tema => (
              <option key={tema.id_tema} value={tema.id_tema}>
                {tema.titulo}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Label>Orientador</Form.Label>
        <Form.Control
          as="select"
          name="id_orientador"
          value={formData.id_orientador}
          onChange={handleInputChange}
        >
          <option value="">Selecione um orientador</option>
          {orientadores.map(orientador => (
            <option key={orientador.id_professor} value={orientador.id_professor}>
              {orientador.nome}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button style={{ marginTop: 10 }} variant="primary" type="submit">
        Cadastrar
      </Button>
    </Form>
  );
};

export default Trabalho_Cadastrar;
