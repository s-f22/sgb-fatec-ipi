import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Trabalhos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
    // por meio de uma requisição (por exemplo, usando Axios)
    console.log({ titulo, descricao });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitulo">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formDescricao">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Digite a descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Cadastrar
      </Button>
    </Form>
  );
};

export default Trabalhos;