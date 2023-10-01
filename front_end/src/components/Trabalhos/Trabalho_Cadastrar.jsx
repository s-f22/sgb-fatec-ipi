import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Overlay, Tooltip } from 'react-bootstrap';
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
  const [alunos, setAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [pesquisaAluno, setPesquisaAluno] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

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

    // Carregar alunos
    axios.get('http://localhost:4000/alunos')
      .then(response => setAlunos(response.data))
      .catch(error => console.error(error));
  }, []);



  const handleRemoverAluno = (alunoId) => {
    const updatedAlunosSelecionados = alunosSelecionados.filter(aluno => aluno.id_aluno !== alunoId);
    setAlunosSelecionados(updatedAlunosSelecionados);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pesquisaAluno') {
      setPesquisaAluno(value);
      setShowTooltip(value.length > 0);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleInserirAluno = (alunoId) => {
    const aluno = alunos.find(aluno => aluno.id_aluno === alunoId);

    if (!alunosSelecionados.includes(aluno)) {
      setAlunosSelecionados([...alunosSelecionados, aluno]);
      setPesquisaAluno(''); // Limpa a entrada de pesquisa após a inserção
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (alunosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um aluno.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const previsaoDefesa = `${semestre}|${ano}`;

    const dadosCadastroTrabalho = {
      id_orientador: formData.id_orientador,
      id_tema: formData.id_tema,
      previsao_defesa: previsaoDefesa,
    };

    try {
      const responseTrabalho = await axios.post('http://localhost:4005/trabalhos', dadosCadastroTrabalho);

      console.log('Trabalho cadastrado com sucesso:', responseTrabalho.data);

      const id_trabalho = responseTrabalho.data.id_trabalho;

      // Cadastrando alunos no grupo
      for (const aluno of alunosSelecionados) {
        const dadosCadastroGrupo = {
          id_aluno: aluno.id_aluno,
          id_trabalho: id_trabalho,
        };

        await axios.post('http://localhost:4006/grupos', dadosCadastroGrupo);
      }

      toast.success('Tema cadastrado com sucesso!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate('/sgb');

    } catch (error) {
      console.error('Erro ao cadastrar trabalho ou grupo:', error);
      toast.error('Erro ao cadastrar o tema ou grupo. Tente novamente mais tarde.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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

      <Form.Group controlId="formAlunos">
        <h3 style={{marginTop: 10}}>Grupo:</h3>
        <Form.Label>Insira abaixo os alunos que formam a equipe:</Form.Label>
        <Form.Control
          placeholder='Pesquise pelo nome do aluno'
          type="text"
          name="pesquisaAluno"
          value={pesquisaAluno}
          onChange={handleInputChange}
          data-tip
          id="tooltip-target" // Defina o id do elemento alvo
        />

        <Overlay
          target={document.getElementById('tooltip-target')}
          show={showTooltip}
          placement="top"
        // style={tooltipPosition}

        >
          {(props) => (
            <Tooltip id="tooltip" {...props}>
              {alunos
                .filter(aluno => aluno.nome.includes(pesquisaAluno))
                .map(aluno => (
                  <span key={aluno.id_aluno}>
                    {aluno.nome}
                    <Button
                    style={{marginLeft: 10}}
                      variant="success"
                      size="sm"
                      onClick={() => {
                        handleInserirAluno(aluno.id_aluno);
                        setShowTooltip(false);
                      }}
                    >
                      Inserir
                    </Button>
                  </span>
                ))
              }
            </Tooltip>
          )}
        </Overlay>




      </Form.Group>

      {alunosSelecionados.length > 0 && (
        <div>
          <h4 style={{marginTop: 10}}>Alunos Selecionados:</h4>
          <ol>
            {alunosSelecionados.map(aluno => (
              <li key={aluno.id_aluno}>
                {aluno.nome} ({aluno.ra})
                <Button
                style={{marginLeft: 10}}
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoverAluno(aluno.id_aluno)}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ol>
        </div>
      )}


      <Button style={{ marginTop: 10 }} variant="primary" type="submit">
        Cadastrar
      </Button>
    </Form>
  );
};

export default Trabalho_Cadastrar;
