import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Trabalho_Cadastrar = () => {
  const [orientadores, setOrientadores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [formData, setFormData] = useState({
    id_orientador: 0,
    id_tema: 0,
    // nota_final: '',
    previsao_defesa: '',
  });

  const [semestre, setSemestre] = useState("01");
  const [ano, setAno] = useState(new Date().getFullYear().toString());

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Enviar formData para o servidor para cadastro no banco de dados
  //   // Use axios.post para isso
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const previsaoDefesa = `${semestre}|${ano}`;
    // Restante do código para envio dos dados para o servidor
  };

  return (
    <Form className='Temas_Container' onSubmit={handleSubmit}>
      <Form.Group controlId="formOrientador">
        <h1>Cadastrar Trabalho</h1>
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

      {/* <Form.Group controlId="formNotaFinal">
        <Form.Label>Nota Final</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="nota_final"
          value={formData.nota_final}
          onChange={handleInputChange}
        />
      </Form.Group> */}

      {/* <Form.Group controlId="formPrevisaoDefesa">
        <Form.Label>Previsão de Defesa</Form.Label>
        <Form.Control
          type="text"
          name="previsao_defesa"
          value={formData.previsao_defesa}
          onChange={handleInputChange}
        />
      </Form.Group> */}

      <Form.Group controlId="formSemestre">
        <Form.Label>Semestre</Form.Label>
        <Form.Control
          as="select"
          name="semestre"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
        >
          <option value="01">Primeiro Semestre</option>
          <option value="02">Segundo Semestre</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formAno">
        <Form.Label>Ano</Form.Label>
        <Form.Control
          type="number"
          name="ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
      </Form.Group>

      <Button style={{ marginTop: 10 }} variant="primary" type="submit">
        Cadastrar
      </Button>
    </Form>
  );
};

export default Trabalho_Cadastrar;
