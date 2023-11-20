import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TablePagination, } from "@mui/material";
import { Link } from "react-router-dom";
import "moment/locale/pt-br";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";

function TemasListar() {
  const [alunos, setAlunos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const procurarAluno = (idAluno) => {
    const nomeAluno = alunos.find((a) => a.id_aluno === idAluno);
    return nomeAluno ? nomeAluno.nome : "Aluno não encontrado";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // const { value } = event.target;
    // const newRowsPerPage = +value;
    // const newPage = Math.floor(page * (rowsPerPage / newRowsPerPage));

    // setRowsPerPage(newRowsPerPage);
    // setPage(newPage);
    const { value } = event.target;
    const newRowsPerPage = +value;

    // Calcular a nova página com base na proporção atual
    const newPage = Math.floor(page * (rowsPerPage / newRowsPerPage));

    // Definir os novos valores de linhas por página e página
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  useEffect(() => {
    axios
      .get("https://140.238.186.186:4004/temas",  { timeout: 5000 })
      .then((response) => {
        setTemas(response.data);
        setDadosCarregados(true);
      })
      .catch((error) => {
        console.error("Erro ao buscar os temas:", error);
      });

    axios
      .get("https://140.238.186.186:4000/alunos")
      .then((response) => {
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os alunos:", error);
      });
  }, []);

  if (!dadosCarregados) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Container fluid className="Trabalhos_Listar_Container px-4">
      <h6 className="titulo-lis-temas mb-4">Lista de Temas</h6>
      <div style={{maxHeight: "500px", overflowY: "scroll"}}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#345059', color: '#FFFFFF', borderRight: '1px solid white' }}>Título</TableCell>
                <TableCell style={{ backgroundColor: '#345059', color: '#FFFFFF', borderRight: '1px solid white' }}>Descrição</TableCell>
                <TableCell style={{ backgroundColor: '#345059', color: '#FFFFFF', borderRight: '1px solid white' }}>Autor</TableCell>
                <TableCell style={{ backgroundColor: '#345059', color: '#FFFFFF', borderRight: '1px solid white' }}>Data</TableCell>
                <TableCell style={{ backgroundColor: '#345059', color: '#FFFFFF', borderRight: '1px solid white' }}>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tema) => (
                  <TableRow key={tema.id_tema}>
                    <TableCell>{tema.titulo}</TableCell>
                    <TableCell>
                      {tema.descricao}
                    </TableCell>
                    <TableCell>
                      {procurarAluno(tema.id_autor)}
                    </TableCell>
                    <TableCell>{moment(tema.data_cadastro).format("LLL")}</TableCell>
                    <TableCell>
                      <Link to={`/sgb/temas_editar/${tema.id_tema}`}>
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
          count={temas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Container>
  );
}

export default TemasListar;
