import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TablePagination } from '@mui/material';

const TrabalhoListar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trabalhosResponse,
          professoresResponse,
          temasResponse,
          gruposResponse,
          alunosResponse,
        ] = await Promise.all([
          axios.get("http://localhost:4005/trabalhos"),
          axios.get("http://localhost:4001/professores"),
          axios.get("http://localhost:4004/temas"),
          axios.get("http://localhost:4006/grupos"),
          axios.get("http://localhost:4000/alunos"),
        ]);

        setTrabalhos(trabalhosResponse.data);
        setProfessores(professoresResponse.data);
        setTemas(temasResponse.data);
        setGrupos(gruposResponse.data);
        setAlunos(alunosResponse.data);

        setDadosCarregados(true);

        console.log("Trabalhos:", trabalhosResponse.data);
        console.log("Professores:", professoresResponse.data);
        console.log("Temas:", temasResponse.data);
        console.log("Grupos:", gruposResponse.data);
        console.log("Alunos:", alunosResponse.data);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProfessorNameById = (id) => {
    const professor = professores.find((p) => p.id_professor === id);
    return professor ? professor.nome : "Professor não encontrado";
  };

  const getTemaTitleById = (id) => {
    const tema = temas.find((t) => t.id_tema === id);
    return tema ? tema.titulo : "Tema não encontrado";
  };

  const getAlunosByTrabalhoId = (id_trabalho) => {
    const alunosDoTrabalho = grupos.filter(
      (grupo) => grupo.id_trabalho === id_trabalho
    );
    return alunosDoTrabalho.map((grupo) => {
      const aluno = alunos.find((a) => a.id_aluno === grupo.id_aluno);
      return aluno ? aluno.nome : "Aluno não encontrado";
    });
  };

  if (!dadosCarregados) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Container className="Temas_Container" fluid>
      <h1>Lista de Trabalhos</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tema</TableCell>
              <TableCell>Orientador</TableCell>
              <TableCell>Alunos</TableCell>
              <TableCell>Previsão de Defesa</TableCell>
              <TableCell>Nota Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trabalhos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trabalho) => (
                <TableRow key={trabalho.id_trabalho}>
                  <TableCell>{getTemaTitleById(trabalho.id_tema)}</TableCell>
                  <TableCell>
                    {getProfessorNameById(trabalho.id_orientador)}
                  </TableCell>
                  <TableCell>
                    {getAlunosByTrabalhoId(trabalho.id_trabalho).join(", ")}
                  </TableCell>
                  <TableCell>{trabalho.previsao_defesa}</TableCell>
                  <TableCell>
                    {trabalho.nota_final === null
                      ? "ainda não avaliado"
                      : trabalho.nota_final}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trabalhos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default TrabalhoListar;
