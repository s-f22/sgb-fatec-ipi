import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Button, TableContainer,  Table,  TableHead,  TableBody,  TableRow,  TableCell,  Paper,  TablePagination,} from "@mui/material";
import TrabalhoEditar from "./TrabalhoEditar";
import { Link } from "react-router-dom";

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
        
      ] = await Promise.all([
        axios.get("http://localhost:4005/trabalhos_navigation"),
        
      ]);

      setTrabalhos(trabalhosResponse.data);
     
      setDadosCarregados(true);

      console.log("Trabalhos:", trabalhosResponse.data);
    
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
                  <TableCell>{trabalho.tema_navigation.titulo}</TableCell>
                  <TableCell>
                    {trabalho.orientador_navigation.nome}
                  </TableCell>
                  <TableCell>
                    {trabalho.grupo_navigation.map(g => g.aluno_navigation.nome).join(", ")}
                  </TableCell>
                  <TableCell>{trabalho.previsao_defesa}</TableCell>
                  <TableCell>
                    {trabalho.nota_final === null
                      ? "ainda não avaliado"
                      : trabalho.nota_final}
                  </TableCell>
                  <TableCell>
                    <Link to={`/sgb/trabalho_editar/${trabalho.id_trabalho}`}>
                      <Button>Editar</Button>
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
