import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BancasCadastrar = () => {
  const [idTema, setIdTema] = useState(0);

  const [dataHora, setDataHora] = useState(new Date());
  const [trabalhos, setTrabalhos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [dias_aula, setDias_aula] = useState([]);
  const [horarios_aula, setHorarios_aula] = useState([]);
  const [orientador, setOrientador] = useState({});
  const [diasAulaOrientador, setDiasAulaOrientador] = useState([]);
  const [horariosAulaOrientador, setHorariosAulaOrientador] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const navigate = useNavigate();
  const [trabalhosPorTema, setTrabalhosPorTema] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trabalhosResponse,
          temasResponse,
          professoresResponse,
          diaAulaResponse,
          horarioAulaResponse,
        ] = await Promise.all([
          axios.get("http://localhost:4005/trabalhos"),
          axios.get("http://localhost:4004/temas"),
          axios.get("http://localhost:4001/professores"),
          axios.get("http://localhost:4002/dia_aula"),
          axios.get("http://localhost:4003/horario_aula"),
        ]);
        setTrabalhos(trabalhosResponse.data);
        setTemas(temasResponse.data);
        setProfessores(professoresResponse.data);
        setDias_aula(diaAulaResponse.data);
        setHorarios_aula(horarioAulaResponse.data);

        console.log("Trabalhos:", trabalhosResponse.data);
        console.log("Temas:", temasResponse.data);
        console.log("Professores:", professoresResponse.data);
        console.log("Dias_aula:", diaAulaResponse.data);
        console.log("Horarios_aula:", horarioAulaResponse.data);
        // Organize os trabalhos por tema
        const trabalhosAgrupados = trabalhosResponse.data.reduce(
          (acc, trabalho) => {
            const temaId = trabalho.id_tema;
            if (!acc[temaId]) {
              acc[temaId] = [];
            }
            acc[temaId].push(trabalho);
            return acc;
          },
          {}
        );

        setTrabalhosPorTema(trabalhosAgrupados);
        setTemas(temasResponse.data);

        console.log("Trabalhos por Tema:", trabalhosAgrupados);
        console.log("Temas:", temasResponse.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, []);

  const determinarPeriodo = (entrada, saida) => {
    const horaEntrada = parseInt(entrada.split(":")[0]);
    const minutoEntrada = parseInt(entrada.split(":")[1]);
    const horaSaida = parseInt(saida.split(":")[0]);
    const minutoSaida = parseInt(saida.split(":")[1]);

    if (horaEntrada < 12) {
      return "Manhã";
    } else if (horaEntrada >= 12 && horaSaida < 19) {
      return "Tarde";
    } else {
      return "Noite";
    }
  };

  const buscarOrientadorPeloTema = (tema) => {
    const trabalho = trabalhos.find((t) => t.id_tema === parseInt(tema));

    if (trabalho) {
      setOrientador((prevOrientador) => {
        const novoOrientador = professores.find(
          (p) => p.id_professor === trabalho.id_orientador
        );

        if (dias_aula.length > 0) {
          const diasFiltrados = dias_aula.filter(
            (d) => d.id_professor === novoOrientador.id_professor
          );
          console.log("Dias de Aula do Orientador:", diasFiltrados);
          setDiasAulaOrientador(diasFiltrados);

          const horariosAulaOrientador = diasFiltrados.map((diaAula) => {
            return horarios_aula.find(
              (horario) => horario.id_dia_aula === diaAula.id_dia_aula
            );
          });

          const horariosFiltrados = horariosAulaOrientador.filter(Boolean);

          setHorariosAulaOrientador(horariosFiltrados);
        }

        return novoOrientador;
      });
    } else {
      setIdTema(0);
    }
  };

  // const trabalhoSelecionado = (idTema) => {
  //   // console.log("idTema:", idTema);
  //   // console.log("Trabalhos:", trabalhos);
  //   if (trabalhos) {
  //     const trabalhoSelecionado = trabalhos.find(
  //       (t) => t.id_tema === parseInt(idTema)
  //     );
  //     if (trabalhoSelecionado) {
  //       return trabalhoSelecionado.id_trabalho;
  //     } else {
  //       throw new Error(`Nenhum trabalho encontrado para o idTema ${idTema}`);
  //     }
  //   }
  //   // Se não houver um array de trabalhos, você pode lançar uma exceção ou tomar outra ação apropriada.
  //   throw new Error("Array de trabalhos não disponível");
  // };

  const trabalhoSelecionado = (idTema) => {
    const trabalho = trabalhos.find((t) => t.id_tema === parseInt(idTema));
    if (!trabalho) {
      throw new Error(`Nenhum trabalho encontrado para o idTema ${idTema}`);
    }
    return trabalho.id_trabalho;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const idTrabalho = trabalhoSelecionado(idTema);

      if (idTrabalho !== null) {
        const dataHoraStringToDate = new Date(dataHora);

        // Cadastrar a banca
        const response = await axios.post("http://localhost:4007/bancas", {
          id_trabalho: idTrabalho,
          data_hora: dataHoraStringToDate.toISOString(),
        });

        if (response.status === 201) {
          // Obter o ID da banca recém-cadastrada a partir da resposta
          const bancaId = response.data.id_banca;

          // Atualizar o atributo "banca_agendada" do trabalho relacionado
          const responseAtualizacaoTrabalho = await axios.patch(
            `http://localhost:4005/trabalhos/${idTrabalho}`,
            {
              banca_agendada: true,
            }
          );

          if (responseAtualizacaoTrabalho.status === 200) {
            // Enviar os professores convidados para o endpoint de convidados
            await Promise.all(
              convidados.map((professor) =>
                axios.post("http://localhost:4008/convidados", {
                  id_professor: professor.id_professor,
                  id_banca: bancaId,
                })
              )
            );

            console.log("Banca cadastrada com sucesso!");

            toast.success("Banca cadastrada com sucesso!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });

            navigate("/sgb");

            // Limpar os campos após o envio bem-sucedido
            setIdTema(0);
            setDataHora("");
            setConvidados([]);
          } else {
            console.error("Erro ao atualizar o trabalho.");
            toast.error("Erro ao atualizar o trabalho.", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else {
          console.error("Erro ao cadastrar a banca.");
          toast.error("Erro ao cadastrar a banca.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        // Lida com o caso em que não foi encontrado um trabalho correspondente ao idTema
        console.error("Nenhum trabalho encontrado para o idTema selecionado.");
        toast.error(
          "Nenhum trabalho encontrado para o idTema selecionado. Selecione um tema válido.",
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
    } catch (error) {
      console.error(
        "Erro ao cadastrar banca. Por favor, tente novamente.",
        error
      );
      toast.error("Erro ao cadastrar a Banca. Tente novamente mais tarde.", {
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
    <Container className="Temas_Container" fluid>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formIdTema">
              <h1>Cadastrar Banca</h1>
              <Form.Label>Trabalho</Form.Label>
              <Form.Control
                as="select"
                value={idTema}
                onChange={(e) => {
                  setIdTema(e.target.value);
                  buscarOrientadorPeloTema(e.target.value);
                }}
                required
              >
                <option key={0} value={0}>
                  Selecione o tema
                </option>
                {trabalhos.map((trabalho) => (
                  <option key={trabalho.id_trabalho} value={trabalho.id_tema}>
                    {
                      temas.find((tema) => tema.id_tema === trabalho.id_tema)
                        ?.titulo
                    }
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDataHora">
              <Form.Label>Data e Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
              />
            </Form.Group>
            {idTema !== 0 && (
              <>
                <h2>Professores Convidados:</h2>

                <Form.Group controlId="formProfessoresConvidados">
                  <Form.Label>Professores Convidados</Form.Label>
                  <Autocomplete
                    multiple
                    id="professores-convidados"
                    options={professores}
                    getOptionLabel={(option) => option.nome}
                    onChange={(event, newValue) => {
                      // Atualize o estado de convidados com os professores selecionados
                      setConvidados(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" fullWidth />
                    )}
                  />
                </Form.Group>
              </>
            )}

            <Button variant="primary" type="submit">
              Cadastrar Banca
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          {idTema !== 0 && (
            <>
              <h2 style={{ marginTop: "1rem" }}>
                Professor Orientador: {orientador.nome}
              </h2>
              {diasAulaOrientador.length > 0 && (
                <div>
                  <h2>Horários na FATEC Ipiranga:</h2>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow style={{ backgroundColor: "darkgray" }}>
                          <TableCell>Dia</TableCell>
                          <TableCell>Manhã - Entrada</TableCell>
                          <TableCell>Manhã - Saída</TableCell>
                          <TableCell>Tarde - Entrada</TableCell>
                          <TableCell>Tarde - Saída</TableCell>
                          <TableCell>Noite - Entrada</TableCell>
                          <TableCell>Noite - Saída</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[1, 2, 3, 4, 5, 6].map((diaSemana) => {
                          const diaComHorarios = diasAulaOrientador.find(
                            (dia) => dia.dia_semana === diaSemana
                          );

                          const horariosManha = [];
                          const horariosTarde = [];
                          const horariosNoite = [];

                          if (diaComHorarios) {
                            horariosAulaOrientador
                              .filter(
                                (horario) =>
                                  horario.id_dia_aula ===
                                  diaComHorarios.id_dia_aula
                              )
                              .forEach((horario) => {
                                const periodo = determinarPeriodo(
                                  horario.entrada,
                                  horario.saida
                                );
                                if (periodo === "Manhã") {
                                  horariosManha.push(horario);
                                } else if (periodo === "Tarde") {
                                  horariosTarde.push(horario);
                                } else if (periodo === "Noite") {
                                  horariosNoite.push(horario);
                                }
                              });
                          }

                          return (
                            <TableRow key={diaSemana}>
                              <TableCell>
                                {(() => {
                                  switch (diaSemana) {
                                    case 1:
                                      return "Segunda-feira";
                                    case 2:
                                      return "Terça-feira";
                                    case 3:
                                      return "Quarta-feira";
                                    case 4:
                                      return "Quinta-feira";
                                    case 5:
                                      return "Sexta-feira";
                                    case 6:
                                      return "Sábado";
                                    default:
                                      return "Desconhecido";
                                  }
                                })()}
                              </TableCell>
                              <TableCell>
                                {horariosManha.length > 0 && (
                                  <ul>
                                    {horariosManha.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.entrada}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                              <TableCell>
                                {horariosManha.length > 0 && (
                                  <ul>
                                    {horariosManha.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.saida}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                              <TableCell>
                                {horariosTarde.length > 0 && (
                                  <ul>
                                    {horariosTarde.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.entrada}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                              <TableCell>
                                {horariosTarde.length > 0 && (
                                  <ul>
                                    {horariosTarde.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.saida}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                              <TableCell>
                                {horariosNoite.length > 0 && (
                                  <ul>
                                    {horariosNoite.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.entrada}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                              <TableCell>
                                {horariosNoite.length > 0 && (
                                  <ul>
                                    {horariosNoite.map((horario) => (
                                      <li key={horario.id_horario_aula}>
                                        {horario.saida}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BancasCadastrar;
