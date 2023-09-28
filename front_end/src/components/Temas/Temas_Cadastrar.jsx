import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Temas_Cadastrar = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [id_autor, setId_autor] = useState(1)
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log({ titulo, descricao });
    

    try {
      const response = await axios.post(`http://localhost:4004/temas`, {
        id_autor,
        titulo,
        descricao
      })

      toast.success('Tema cadastrado com sucesso!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      console.log("Dados enviados com sucesso:", response.data)

      navigate('/sgb')
      
    } catch (error) {

      toast.error('Erro ao cadastrar o tema. Tente novamente mais tarde.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.error('Erro ao enviar os dados:', error)

    }

  };

  return (
    <Form className='Temas_Container' onSubmit={handleSubmit}>
      <Form.Group controlId="formTitulo">
        <h1>Cadastrar Tema</h1>
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

export default Temas_Cadastrar;