import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import banca_cad from '../assets/img/Logo_I.png'
import img_fundo  from '../assets/img/img_fundo.jpg'


const SignUpInfo = () => {

  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [user_id, setUser_id] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRA] = useState('');
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [showConfirmationModalAluno, setShowConfirmationModalAluno] = useState(false);
  const [showConfirmationModalProf, setShowConfirmationModalProf] = useState(false);
  const [username, setUsername] = useState('');

  const [coordenador, setCoordenador] = useState(false)
  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const periodos = ['Manhã', 'Tarde', 'Noite'];
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horarios, setHorarios] = useState({});

  useEffect(() => {
    if(isAuthenticated) {
      console.log(user.sub.split('|')[1])
      setUser_id(user.sub.split('|')[1])
    }
  }, [isAuthenticated]);




  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const valorLimpo = value.replace(/@.*$|\.com/g, '');
    setUsername(valorLimpo);
  };



  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
  }


  const handleSubmitAluno = async (e) => {
    e.preventDefault();

    const fullEmail = `${username}@fatec.sp.gov.br`;
    if (fullEmail === "@fatec.sp.gov.br") {
      alert("Digite seu endereço de e-mail institucional")
    } else {
      // alert(fullEmail);
      setEmail(fullEmail)
      setUsername('')
    }

    setShowConfirmationModalAluno(true);
  }


  const handleConfirmAluno = async () => {

    setShowConfirmationModalAluno(false);

    try {
      const response = await axios.post('http://localhost:4000/alunos', {
        user_id,
        ra,
        nome,
        email,
        curso,
        periodo
      })

      // Se o cadastro for bem-sucedido, exibe o toast
      toast.success('Aluno cadastrado com sucesso!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      console.log('Dados enviados com sucesso:', response.data)

      navigate("/sgb");

    } catch (error) {

      // Exibe o toast de erro
      toast.error('Erro ao cadastrar aluno. Tente novamente mais tarde.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.error('Erro ao enviar os dados:', error);
    }
  };



  const CadastrarProfessor = async (dadosProfessor) => {
    try {
      const response = await axios.post('http://localhost:4001/professores', dadosProfessor);
      console.log('Resposta do servidor:', response.data);
      const idProfessor = response.data.professor.id_professor;
      console.log('PROFESSOR:', idProfessor);

      await Cadastrar_Dia_Horario_Aula(idProfessor, diasSelecionados, horarios);

      return idProfessor;
    } catch (error) {
      throw new Error(`Erro ao cadastrar professor: ${error}`);
    }
  };



  const Cadastrar_Dia_Horario_Aula = async (idProfessor, diasSemana, horarios) => {
    try {

      const diaSemanaToInt = (diaSemana) => {
        const diasSemana = {
          'Segunda-feira': 1,
          'Terça-feira': 2,
          'Quarta-feira': 3,
          'Quinta-feira': 4,
          'Sexta-feira': 5,
          'Sábado': 6
        };
        return diasSemana[diaSemana];
      }

      const diaPromises = [];

      for (const diaSemana of diasSemana) {
        const diaSemanaInt = diaSemanaToInt(diaSemana);

        const responseDiaAula = await axios.post('http://localhost:4002/dia_aula', {
          id_professor: idProfessor,
          dia_semana: diaSemanaInt
        });

        const idDiaAula = responseDiaAula.data.diaAula.id_dia_aula;

        const horarioPromises = [];

        for (const periodo in horarios[diaSemana]) {
          const horarioInfo = horarios[diaSemana][periodo];
          if (horarioInfo && horarioInfo.entrada && horarioInfo.saida) {
            const entrada = horarioInfo.entrada;
            const saida = horarioInfo.saida;

            const horarioPromise = axios.post('http://localhost:4003/horario_aula', {
              id_professor: idProfessor,
              id_dia_aula: idDiaAula,
              entrada: entrada,
              saida: saida
            });

            horarioPromises.push(horarioPromise);
          }
        }

        await Promise.all(horarioPromises);
        diaPromises.push(`Dia de aula para ${diaSemana} cadastrado com sucesso!`);
      }

      return diaPromises;
    } catch (error) {
      console.error('Erro ao criar dia de aula ou horário de aula:', error);
      throw error;
    }
  }



  const HorarioSelecaoProfs = () => {


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
        <h6 style={{marginTop: 20, fontWeight: 'bold'}}>Seus horários de trabalho:</h6>
        <p>Informe abaixo os dias e horários nos quais você ministra aulas na FATEC Ipiranga</p>
        <div className='SignUpInfo_Cards_grid'>
          {diasSemana.map(dia => (
            <Card key={dia} style={{ marginBottom: '10px', padding: '10px', width: 300, color:'#345059', backgroundColor: '#E6E6E6' }}>
              <div>
                <Form.Check 
                  type="checkbox"
                  label={dia}
                  checked={diasSelecionados.includes(dia)}
                  onChange={e => handleDiaChange(dia, e.target.checked)}
                  className='SignUpInfo_Checkbox'
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
                                <Form.Label>Entrada:</Form.Label>
                                <Form.Control
                                  type="time"
                                  style={{ width: 'fit-content', backgroundColor: '#fff', color: '#345059' }}
                                  onChange={e =>
                                    handleHorarioChange(dia, periodo, 'entrada', e.target.value)
                                  }
                                  value={horarios[dia]?.[periodo]?.entrada || ''} />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group controlId={`${dia}-${periodo}-saida`}>
                                <Form.Label>Saída:</Form.Label>
                                <Form.Control
                                  type="time"
                                  style={{ width: 'fit-content', backgroundColor: '#fff', color: '#345059'  }}
                                  onChange={e =>
                                    handleHorarioChange(dia, periodo, 'saida', e.target.value)
                                  }
                                  value={horarios[dia]?.[periodo]?.saida || ''} />
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



  const handleSubmitProfessor = async (e) => {
    e.preventDefault();

    const fullEmail = `${username}@fatec.sp.gov.br`;
    if (fullEmail === "@fatec.sp.gov.br") {
      alert("Digite seu endereço de e-mail institucional")
    } else {
      // alert(fullEmail);
      console.log(fullEmail)
      setEmail(fullEmail)
      setUsername('')
    }

    setShowConfirmationModalProf(true);
  }



  const handleConfirmProfessor = async () => {
    setShowConfirmationModalProf(false);

    try {
      const idProfessor = await CadastrarProfessor({
        user_id,
        nome,
        email,
        coordenador
      });

      toast.success('Professor cadastrado com sucesso!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.log('Professor cadastrado com sucesso');

      navigate("/sgb");

    } catch (error) {
      toast.error('Erro ao cadastrar professor. Tente novamente mais tarde.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.error('Erro ao cadastrar professor:', error);
    }
  };



  return (
    <>
    <div className='sidebar-cadastro'>
      <img src={banca_cad} alt="Banca montada" />
      <h3>Finalize seu cadastro!!</h3>
      <p>Para concluir seu acesso à plataforma, por favor, insira seu email institucional. Mas antes...</p>
    </div>
    <div className='vocee'>
      <h4>Você é:</h4>
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

      <img src={img_fundo} alt="Imagem de fundo" />

      {selectedProfile === 'aluno' && (
        <Form onSubmit={handleSubmitAluno}>
          <Form.Group>
            <Form.Label htmlFor="email"><b>E-mail Institucional:</b></Form.Label>
            <InputGroup style={{ width: '47.25rem' }} className="mb-3">
              <Form.Control
                id="email"
                type="text"
                placeholder="seu email"
                aria-label="seu email"
                aria-describedby="basic-addon2"
                value={username}
                onChange={handleUsernameChange}
              />
              <InputGroup.Text style={{
                width: 'fit-content',
                fontStyle: 'italic',
                color: 'white',
                paddingLeft: 5,
                //borderStyle: 'none',
                marginLeft: 4,
                backgroundColor: '#345059'
              }}
                id="basic-addon2">@fatec.sp.gov.br</InputGroup.Text>
            </InputGroup>

            <InputGroup style={{ width: '47.25rem' }} className="mb-3">
              <InputGroup className="mb-3">
                <InputGroup.Text style={{backgroundColor: '#345059', color: 'white'}} id="basic-addon1">RA:</InputGroup.Text>
                <Form.Control
                  id="ra"
                  type="text"
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  value={ra}
                  onChange={(e) => setRA(e.target.value)}
                />
              </InputGroup>
              <InputGroup.Text style={{backgroundColor: '#345059', color: 'white', borderRadius:'7px 0 0 7px'}}  id="basic-addon1">Nome completo:</InputGroup.Text>
              <Form.Control
                id="nomeCompleto"
                type="text"
                placeholder=""
                aria-label=""
                aria-describedby="basic-addon1"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </InputGroup>
            <InputGroup.Text style={{ gap: 10, color: '#345059', fontWeight: 'bold',marginBottom: '1rem', width: '47.25rem'}} id="basic-addon1">
              Curso:<Form.Select id="curso" aria-label="Selecione o curso" value={curso} onChange={(e) => setCurso(e.target.value)}>
                <option value="">Selecione uma opção</option> {/* Adicionada a opção default */}
                <option value="ads">Análise e Desenvolvimento de Sistemas</option>
                <option value="bigdata">Big Data</option>
                <option value="rh">Recursos Humanos</option>
                <option value="eventos">Eventos</option>
              </Form.Select>
            </InputGroup.Text>

            <InputGroup.Text style={{ gap: 10, color: '#345059', fontWeight: 'bold',marginBottom: 10, padding: 10, width: '47.25rem' }} id="basic-addon1">
              Período:<Form.Select id="periodo" aria-label="Selecione o curso" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option value="">Selecione uma opção</option> {/* Adicionada a opção default */}
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </Form.Select>
            </InputGroup.Text>
          </Form.Group>

          <Button
            style={{ marginTop: '53px', width: '47.25rem', fontWeight: 'bold', fontSize: '12px', backgroundColor: '#345059', height: '45px' }}
            type="submit">
            ENVIAR
          </Button>
        </Form>
      )}

      {selectedProfile === 'professor' && (
        <Form onSubmit={handleSubmitProfessor}>
          <Form.Group>
            <Form.Label htmlFor="basic-url"><b>E-mail Institucional:</b></Form.Label>
            <InputGroup style={{ width: '46.5rem'}} className="mb-3">
              <Form.Control
                placeholder="seu email"
                aria-label="digite"
                aria-describedby="basic-addon2"
                value={username}
                onChange={handleUsernameChange}
              />
              <InputGroup.Text style={{
                width: 'fit-content',
                fontStyle: 'italic',
                color: 'white',
                paddingLeft: 5,
                //borderStyle: 'none',
                marginLeft: 4,
                backgroundColor: '#345059'
              }} id="basic-addon2">@fatec.sp.gov.br</InputGroup.Text>
            </InputGroup>
            <InputGroup style={{ width: '46.5rem' }} className="mb-3">
              <InputGroup.Text style={{backgroundColor: '#345059', color: 'white'}}  id="basic-addon1">Nome completo:</InputGroup.Text>
              <Form.Control
                placeholder=""
                aria-label=""
                aria-describedby="basic-addon1"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </InputGroup>
            <Form.Group>
              <h6 style={{fontWeight: 'bold'}}>Marque abaixo somente caso você seja um coordenador:</h6>
              <Form.Check
                type="checkbox"
                label="Sim, sou um professor-coordenador"
                checked={coordenador}
                onChange={() => setCoordenador(prevCoordenador => !prevCoordenador)}
              />
            </Form.Group>
            <HorarioSelecaoProfs />
            <Button
              style={{ marginTop: '53px', width: '47.25rem', fontWeight: 'bold', fontSize: '12px', backgroundColor: '#345059', height: '45px'}}
              variant="primary"
              type="submit"
            >
              ENVIAR
            </Button>
          </Form.Group>
        </Form>
      )}

      {/* MODAL DE CONFIRMAÇÃO ----------------- */}
      <Modal show={showConfirmationModalAluno} onHide={() => setShowConfirmationModalAluno(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Cadastro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Um email de validação será enviado para o endereço de email que você forneceu, a fim de confirmar sua identidade e validar seu cadastro.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModalAluno(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAluno}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL DE CONFIRMAÇÃO ----------------- */}

      {/* MODAL DE CONFIRMAÇÃO ----------------- */}
      <Modal show={showConfirmationModalProf} onHide={() => setShowConfirmationModalProf(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Cadastro Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Um email de validação será enviado para o endereço de email que você forneceu, a fim de confirmar sua identidade e validar seu cadastro.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModalProf(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmProfessor}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL DE CONFIRMAÇÃO ----------------- */}
      {/* <p className='copyright'>© 2023 SGB Fatec Ipiranga</p> */}
    </div>
    </>
  )
}

export default SignUpInfo;