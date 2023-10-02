import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';

const TrabalhoListar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trabalhosResponse, professoresResponse, temasResponse, gruposResponse, alunosResponse] = await Promise.all([
          axios.get('http://localhost:4005/trabalhos'),
          axios.get('http://localhost:4001/professores'),
          axios.get('http://localhost:4004/temas'),
          axios.get('http://localhost:4006/grupos'),
          axios.get('http://localhost:4000/alunos')
        ]);

        setTrabalhos(trabalhosResponse.data);
        setProfessores(professoresResponse.data);
        setTemas(temasResponse.data);
        setGrupos(gruposResponse.data);
        setAlunos(alunosResponse.data);

        setDadosCarregados(true);

        console.log('Trabalhos:', trabalhosResponse.data);
        console.log('Professores:', professoresResponse.data);
        console.log('Temas:', temasResponse.data);
        console.log('Grupos:', gruposResponse.data);
        console.log('Alunos:', alunosResponse.data);
      } catch (error) {
        console.error('Erro ao obter os dados:', error);
      }
    };

    fetchData();
  }, []);


  const getProfessorNameById = (id) => {
    const professor = professores.find(p => p.id_professor === id);
    return professor ? professor.nome : 'Professor não encontrado';
  }

  const getTemaTitleById = (id) => {
    const tema = temas.find(t => t.id_tema === id);
    return tema ? tema.titulo : 'Tema não encontrado';
  }

  const getAlunosByTrabalhoId = (id_trabalho) => {
    const alunosDoTrabalho = grupos.filter(grupo => grupo.id_trabalho === id_trabalho);
    return alunosDoTrabalho.map(grupo => {
      const aluno = alunos.find(a => a.id_aluno === grupo.id_aluno);
      return aluno ? aluno.nome : 'Aluno não encontrado';
    });
  };



  if (!dadosCarregados) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Container fluid className='Temas_Container'>
      <h1>Lista de Trabalhos</h1>
      <Row>
        {trabalhos.map(trabalho => (
          <Col key={trabalho.id_trabalho} lg={4} md={6} sm={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{`Tema: ${getTemaTitleById(trabalho.id_tema)}`}</Card.Title>
                <Card.Text>{`Orientador: ${getProfessorNameById(trabalho.id_orientador)}`}</Card.Text>
                <Card.Text>{`Alunos: ${getAlunosByTrabalhoId(trabalho.id_trabalho).join(', ')}`}</Card.Text>
                <Card.Text>{`Previsão Defesa: ${trabalho.previsao_defesa}`}</Card.Text>
                <Card.Text>{`Nota Final: ${(trabalho.nota_final === null) ? "ainda não avaliado" : trabalho.nota_final}`}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}

      </Row>
    </Container>
  );
};

export default TrabalhoListar;
