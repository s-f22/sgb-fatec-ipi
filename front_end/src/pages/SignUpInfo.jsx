import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const SignUpInfo = () => {

  return (
    <div style={{
      display: 'block',
      width: 700,
      padding: 30
    }}>
      <h4>Conclua seu cadastro</h4>
      <p>Para concluir seu acesso a plataforma, por favor, insira seu email institucional e confirme se você é aluno ou professor:</p>
      <Form>
        <Form.Group style={{ marginBottom: 10 }}>
          <Form.Label>E-mail institucional:</Form.Label>
          <Form.Control type="email"
            placeholder="@fatec.sp.gov.br" />
        </Form.Group>
        <Form.Group style={{ marginBottom: 10 }}>
          <Form.Label>Nome Completo:</Form.Label>
          <Form.Control type="text"
            placeholder="Inserir" />
        </Form.Group>
        <Link to={'/sgb'}>
          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </Link>
      </Form>
    </div>
  )
}

export default SignUpInfo