import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HorarioSelecaoProfs from '../components/HorarioSelecaoProfs'

const SignUpInfo = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
  }

  return (
    <div style={{
      display: 'block',
      padding: 30
    }}>
      <h1>Conclua seu cadastro</h1>
      <p>Para concluir seu acesso à plataforma, por favor, insira seu email institucional. Mas antes...</p>
      <h2>Você é:</h2>

      <Form.Check
        type="radio"
        label="Aluno"
        name="profile"
        id="aluno"
        checked={selectedProfile === 'aluno'}
        onChange={() => handleSelectProfile('aluno')}
      />

      <Form.Check
        type="radio"
        label="Professor"
        name="profile"
        id="professor"
        checked={selectedProfile === 'professor'}
        onChange={() => handleSelectProfile('professor')}
      />

      {selectedProfile === 'aluno' && (
        <Form>
          <Form.Group>
            <Form.Label htmlFor="basic-url"><b>E-mail Institucional:</b></Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="digite"
                aria-label="digite"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Text id="basic-addon2">@fatec.sp.gov.br</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">RA:</InputGroup.Text>
                <Form.Control
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              <InputGroup.Text id="basic-addon1">Nome completo:</InputGroup.Text>
              <Form.Control
                placeholder=""
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup.Text  style={{gap: 10, marginBottom: '1rem', padding: '10px' }} id="basic-addon1">Curso:<Form.Select id="curso" aria-label="Selecione o curso">
              <option value="ads">Análise e Desenvolvimento de Sistemas</option>
              <option value="bigdata">Big Data</option>
              <option value="rh">Recursos Humanos</option>
              <option value="eventos">Eventos</option>
            </Form.Select></InputGroup.Text>
            <InputGroup.Text  style={{gap: 10, marginBottom: 10, padding: 10 }} id="basic-addon1">Período:<Form.Select id="periodo" aria-label="Selecione o curso">
              <option value="ads">Manhã</option>
              <option value="bigdata">Tarde</option>
              <option value="rh">Noite</option>
            </Form.Select></InputGroup.Text>

          </Form.Group>
          <Link to={'/sgb'}>
            <Button style={{marginTop: '5px'}} variant="primary" type="submit">
              Enviar
            </Button>
          </Link>
        </Form>
      )}


      {selectedProfile === 'professor' && (
        <Form>
          <Form.Group>
            <Form.Label htmlFor="basic-url"><b>E-mail Institucional:</b></Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="digite"
                aria-label="digite"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Text id="basic-addon2">@fatec.sp.gov.br</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Nome completo:</InputGroup.Text>
              <Form.Control
                placeholder=""
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <HorarioSelecaoProfs />
          </Form.Group>
          <Link to={'/sgb'}>
            <Button style={{marginTop: '5px'}} variant="primary" type="submit">
              Enviar
            </Button>
          </Link>
        </Form>
      )}
    </div>
  )
}

export default SignUpInfo;
