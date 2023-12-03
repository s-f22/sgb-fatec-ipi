import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container} from "react-bootstrap";
import { Button, TableContainer,  Table,  TableHead,  TableBody,  TableRow,  TableCell,  Paper,  TablePagination,} from "@mui/material";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";


const TrabalhoListar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const [
        trabalhosResponse,
        professoresResponse,
        temasResponse,
        gruposResponse,
        alunosResponse,
      ] = await Promise.all([
        axios.get("https://140.238.186.186:4005/trabalhos"),
        axios.get("https://140.238.186.186:4001/professores"),
        axios.get("https://140.238.186.186:4004/temas"),
        axios.get("https://140.238.186.186:4006/grupos"),
        axios.get("https://140.238.186.186:4000/alunos"),
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTrabalhoEdit = (message) => {
    // Handle the edit success message or any other action
    console.log(message);
    // You may want to refresh the data after editing
    fetchData();
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
    return (
      <div
          style={{
            display: "flex",
            flex: 1,
            height: "100vh",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ alignSelf: "center" }}>Carregando...</p>
          <Spinner
            style={{ alignSelf: "center", marginBottom: "50px" }}
            animation="grow"
          />
        </div>
    );
  }

  return (
    <Container className="Temas_Container px-3" fluid>
      <h6 className="titulo-lis-trab mb-4">Lista de Trabalhos</h6>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Tema</TableCell>
              <TableCell  style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Orientador</TableCell> 
              <TableCell  style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Alunos</TableCell>
              <TableCell  style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Previsão de Defesa</TableCell>
              <TableCell  style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Nota Final</TableCell>
              <TableCell  style={{backgroundColor:'#345059', color:'#FFFFFF', borderRight:'1px solid white'}}>Editar</TableCell>
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
                  <TableCell>
                    <Link to={`/sgb/trabalho_editar/${trabalho.id_trabalho}`}>
                      <Button><i className="pi pi-file-edit"></i></Button>
                    </Link>
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
