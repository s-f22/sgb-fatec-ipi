import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const TrabalhoCadastrar = () => {
  const [orientadores, setOrientadores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [formData, setFormData] = useState({
    id_orientador: 0,
    id_tema: 0,
    previsao_defesa: "",
  });
  const [semestre, setSemestre] = useState("01");
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [alunos, setAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [pesquisaAluno, setPesquisaAluno] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Carregar orientadores
    axios
      .get("http://localhost:4001/professores")
      .then((response) => setOrientadores(response.data))
      .catch((error) => console.error(error));

    // Carregar temas
    axios
      .get("http://localhost:4004/temas")
      .then((response) => setTemas(response.data))
      .catch((error) => console.error(error));

    // Carregar alunos
    axios
      .get("http://localhost:4000/alunos")
      .then((response) => setAlunos(response.data))
      .catch((error) => console.error(error));
  }, []);

  // const handleRemoverAluno = (alunoId) => {
  //   const updatedAlunosSelecionados = alunosSelecionados.filter(
  //     (aluno) => aluno.id_aluno !== alunoId
  //   );
  //   setAlunosSelecionados(updatedAlunosSelecionados);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "pesquisaAluno") {
      setPesquisaAluno(value);
      setShowTooltip(value.length > 0);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // const handleInserirAluno = (alunoId) => {
  //   const aluno = alunos.find((aluno) => aluno.id_aluno === alunoId);

  //   if (!alunosSelecionados.includes(aluno)) {
  //     setAlunosSelecionados([...alunosSelecionados, aluno]);
  //     setPesquisaAluno(""); // Limpa a entrada de pesquisa após a inserção
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alunosSelecionados.length === 0) {
      toast.error("Selecione pelo menos um aluno.", {
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
      // Cadastrar o trabalho
      const responseTrabalho = await axios.post(
        "http://localhost:4005/trabalhos",
        dadosCadastroTrabalho
      );

      console.log("Trabalho cadastrado com sucesso:", responseTrabalho.data);

      const idTrabalho = responseTrabalho.data.id_trabalho;

      // Atualizar o tema do trabalho cadastrado
      const idTema = formData.id_tema;
      await axios.patch(`http://localhost:4004/tema/${idTema}`, {
        disponivel: false,
      });

      console.log("Tema atualizado com sucesso.");

      // Cadastrar alunos no grupo
      for (const aluno of alunosSelecionados) {
        const dadosCadastroGrupo = {
          id_aluno: aluno.id_aluno,
          id_trabalho: idTrabalho,
        };

        await axios.post("http://localhost:4006/grupos", dadosCadastroGrupo);
      }

      toast.success("Trabalho cadastrado com sucesso!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate("/sgb");
    } catch (error) {
      console.error("Erro ao cadastrar trabalho ou grupo:", error);
      toast.error(
        "Erro ao cadastrar o tema, trabalho ou grupo. Tente novamente mais tarde.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <Form className="Trabalhos_Container pr-3 mb-8" onSubmit={handleSubmit}>
      <Form.Group controlId="formOrientador">
        <h6 className="titulo-cad-trab">Cadastrar Trabalho</h6>
        <Container style={{ padding: 0 }} fluid>
          <Row>
            <h6 className="subtitulo-cad-trab">Previsão de entrega e apresentação:</h6>
            <Col md={2}>
              <Form.Group controlId="formSemestre" style={{marginTop: '18px'}}>
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
              <Form.Group controlId="formAno" style={{marginTop: '18px'}}>
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
        <Form.Group controlId="formTema" style={{marginTop: '18px'}}>
          <Form.Label>Tema</Form.Label>
          <Form.Control
            as="select"
            name="id_tema"
            value={formData.id_tema}
            onChange={handleInputChange}
          >
            <option value="">Selecione um tema</option>
            {temas.map((tema) => (
              <option key={tema.id_tema} value={tema.id_tema}>
                {tema.titulo}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Label style={{marginTop: '18px'}}>Orientador</Form.Label>
        <Form.Control
          as="select"
          name="id_orientador"
          value={formData.id_orientador}
          onChange={handleInputChange}
        >
          <option value="">Selecione um orientador</option>
          {orientadores.map((orientador) => (
            <option
              key={orientador.id_professor}
              value={orientador.id_professor}
            >
              {orientador.nome}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formAlunos">
        <h6 style={{ marginTop: 10, marginTop: 18 }} className="grupo-cad-trab">Grupo:</h6>
        <Form.Label>Insira abaixo os alunos que formam a equipe:</Form.Label>
        <Autocomplete
          options={alunos}
          getOptionLabel={(aluno) => aluno.nome}
          value={alunosSelecionados}
          onChange={(event, newValue) => {
            setAlunosSelecionados(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pesquise pelo nome do aluno"
              variant="outlined"
              fullWidth
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.id_aluno === value.id_aluno
          }
          multiple
        />
      </Form.Group>

      <Button style={{ marginTop: 10, width: '100%', height:45, marginTop: 26, backgroundColor: '#345059' }} type="submit">
        Cadastrar
      </Button>
    </Form>
  );
};

export default TrabalhoCadastrar;
