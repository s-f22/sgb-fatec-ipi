import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'
// import HorarioSelecaoProfs from '../components/HorarioSelecaoProfs'


const HorarioSelecaoProfs = () => {
  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const periodos = ['Manhã', 'Tarde', 'Noite'];
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horarios, setHorarios] = useState({});

  const handleDiaChange = (dia, isChecked) => {
    setDiasSelecionados(prevState => {
      const updatedDias = isChecked
        ? [...prevState, dia]
        : prevState.filter(d => d !== dia);

      // Remove os horários do dia desmarcado
      setHorarios(prevHorarios => {
        const updatedHorarios = { ...prevHorarios };
        if (!isChecked) {
          delete updatedHorarios[dia];
        }
        return updatedHorarios;
      });

      return updatedDias;
    });
  };

  const handlePeriodoChange = (dia, periodo, isChecked) => {
    setHorarios(prevHorarios => {
      const updatedHorarios = { ...prevHorarios };
      if (isChecked) {
        if (!updatedHorarios[dia]) {
          updatedHorarios[dia] = {};
        }
        updatedHorarios[dia][periodo] = { entrada: '', saida: '' };
      } else {
        delete updatedHorarios[dia][periodo];
        if (Object.keys(updatedHorarios[dia]).length === 0) {
          delete updatedHorarios[dia];
        }
      }
      return updatedHorarios;
    });
  };

  const handleHorarioChange = (dia, periodo, tipo, value) => {
    setHorarios(prevHorarios => {
      const updatedHorarios = { ...prevHorarios };
      if (!updatedHorarios[dia]) {
        updatedHorarios[dia] = {};
      }
      if (!updatedHorarios[dia][periodo]) {
        updatedHorarios[dia][periodo] = { entrada: '', saida: '' };
      }
      updatedHorarios[dia][periodo][tipo] = value;
      return updatedHorarios;
    });
  };

  return (
    <Form style={{ display: 'flex', flexDirection: 'column' }}>
      <h3>Horários de trabalho:</h3>
      <p>Selecione abaixo os dias e horários que você trabalha na FATEC Ipiranga.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
        {diasSemana.map(dia => (
          <Card key={dia} style={{ marginBottom: '10px', padding: '10px', width: 300 }}>
            <div>
              <Form.Check
                type="checkbox"
                label={dia}
                checked={diasSelecionados.includes(dia)}
                onChange={e => handleDiaChange(dia, e.target.checked)}
              />
              {diasSelecionados.includes(dia) && (
                <div>
                  {periodos.map(periodo => (
                    <div key={`${dia}-${periodo}`} style={{ marginLeft: '20px' }}>
                      <Form.Check
                        type="checkbox"
                        label={periodo}
                        checked={!!(horarios[dia]?.[periodo])}
                        onChange={e => handlePeriodoChange(dia, periodo, e.target.checked)}
                      />
                      {horarios[dia]?.[periodo] && (
                        <Row>
                          <Col>
                            <Form.Group controlId={`${dia}-${periodo}-entrada`}>
                              <Form.Label>Entrada</Form.Label>
                              <input
                                type="time"
                                onChange={e =>
                                  handleHorarioChange(dia, periodo, 'entrada', e.target.value)
                                }
                                value={horarios[dia]?.[periodo]?.entrada || ''}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId={`${dia}-${periodo}-saida`}>
                              <Form.Label>Saída</Form.Label>
                              <input
                                type="time"
                                onChange={e =>
                                  handleHorarioChange(dia, periodo, 'saida', e.target.value)
                                }
                                value={horarios[dia]?.[periodo]?.saida || ''}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Form>
  );
};



const SignUpInfo = () => {

  const { user } = useAuth0();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [userId, setUserId] = useState('64f9dc232f6f2f94869eab0d');


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtendo os valores dos campos
    const email = document.getElementById('email').value;
    const ra = document.getElementById('ra').value;
    const nome = document.getElementById('nomeCompleto').value;
    const curso = document.getElementById('curso').value;
    const periodo = document.getElementById('periodo').value;

    // Enviando os dados para a API
    try {
      const response = await axios.post('http://localhost:4000/alunos', {
        userId,
        ra,
        nome,
        email,
        curso,
        periodo
      });

      console.log('Dados enviados com sucesso:', response.data);

      // Aqui você pode adicionar código para lidar com a resposta da API, se necessário

    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      // Aqui você pode adicionar código para lidar com o erro
    }
  };



  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
  }

  return (
    <div style={{ display: 'block', padding: 30 }}>
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
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="email"><b>E-mail Institucional:</b></Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="email"
                type="email"
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
                  id="ra"
                  type="text"
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              <InputGroup.Text id="basic-addon1">Nome completo:</InputGroup.Text>
              <Form.Control
                id="nomeCompleto"
                type="text"
                placeholder=""
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup.Text style={{ gap: 10, marginBottom: '1rem', padding: '10px' }} id="basic-addon1">Curso:<Form.Select id="curso" aria-label="Selecione o curso">
              <option value="ads">Análise e Desenvolvimento de Sistemas</option>
              <option value="bigdata">Big Data</option>
              <option value="rh">Recursos Humanos</option>
              <option value="eventos">Eventos</option>
            </Form.Select></InputGroup.Text>
            <InputGroup.Text style={{ gap: 10, marginBottom: 10, padding: 10 }} id="basic-addon1">Período:<Form.Select id="periodo" aria-label="Selecione o curso">
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </Form.Select></InputGroup.Text>
          </Form.Group>
          <Button style={{ marginTop: '5px' }} variant="primary" type="submit">
            Enviar
          </Button>
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
            <Button style={{ marginTop: '5px' }} variant="primary" type="submit">
              Enviar
            </Button>
          </Link>
        </Form>
      )}
    </div>
  )
}

export default SignUpInfo;
