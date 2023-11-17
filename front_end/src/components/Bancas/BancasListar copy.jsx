import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";
import moment from "moment";
import axios from "axios";
import { Container } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const localizer = momentLocalizer(moment);

const BancasListar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const requests = [
        axios.get("http://localhost:4005/trabalhos"),
        axios.get("http://localhost:4004/temas"),
        axios.get("http://localhost:4007/bancas"),
        axios.get("http://localhost:4001/professores"),
        axios.get("http://localhost:4008/convidados"),
        axios.get("http://localhost:4006/grupos"),
        axios.get("http://localhost:4000/alunos")
        // Adicione outras requisições aqui
      ];
  
      const responses = await Promise.all(requests);
  
      setTrabalhos(responses[0].data);
      setTemas(responses[1].data);
      setBancas(responses[2].data);
      setProfessores(responses[3].data);
      setConvidados(responses[4].data);
      setGrupos(responses[5].data);
      setAlunos(responses[6].data);
      // Configure os outros estados aqui
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const horarioFinalBanca = (horarioInicio) => {
    const inicio = new Date(horarioInicio);
    const final = new Date(inicio.setMinutes(inicio.getMinutes() + 30));
    console.log("Novo horario", final.toISOString());
    return final.toISOString();
  };

  const buscarTituloBanca = (idTrabalhoBanca) => {
    if (trabalhos) {
      const trabalho = trabalhos.find(
        (t) => t.id_trabalho === parseInt(idTrabalhoBanca)
      );
      console.log("Trabalho Encontrado", trabalho);
      if (trabalho) {
        const tema = temas.find(
          (t) => t.id_tema === parseInt(trabalho.id_tema)
        );
        return tema ? tema.titulo : "Não informado";
      } else {
        throw new Error(
          `Nenhum tema encontrado para o idTrabalhoBanca ${idTrabalhoBanca}`
        );
      }
    }
  };

  const buscarNomeOrientador = (idTrabalho) => {
    if (trabalhos) {
      const trabalho = trabalhos.find(
        (t) => t.id_trabalho === parseInt(idTrabalho)
      );
      console.log("Trabalho Encontrado", trabalho);
      if (trabalho) {
        const orientador = professores.find(
          (p) => p.id_professor === parseInt(trabalho.id_orientador)
        );
        return orientador ? orientador.nome : "Não informado";
      } else {
        throw new Error(
          `Nenhum orientador encontrado para o ORIENTADOR ${trabalho.id_orientador}`
        );
      }
    }
  };

  const buscarListaConvidados = (idBanca) => {
    if (convidados) {
      const listaConvidados = convidados.filter(
        (c) => c.id_banca === parseInt(idBanca)
      );
      console.log("CONVIDADOS:", listaConvidados);

      // Extrair apenas os nomes dos convidados
      const nomesConvidados = listaConvidados.map((convidado) => {
        const professorCorrespondente = professores.find(
          (p) => p.id_professor === convidado.id_professor
        );
        return professorCorrespondente
          ? professorCorrespondente.nome
          : "Não informado";
      });

      return nomesConvidados;
    } else {
      throw new Error(`Não há convidados para ${idBanca}`);
    }
  };

  const buscarAlunosGrupo = (idTrabalho) => {
    if (grupos) {
      const grupo = grupos.find((grupo) => grupo.id_trabalho === idTrabalho);
      console.log("Grupo Encontrado", grupo);
      if (grupo) {
        const alunosDoGrupo = alunos.filter((aluno) =>
          grupo.alunos.includes(aluno.id_aluno)
        );
        return alunosDoGrupo.map((aluno) => aluno.nome);
      } else {
        return ["Nenhum aluno vinculado a este grupo"];
      }
    }
  };

  // DADOS DO CARD DE BANCA ----------------------------
  const events = bancas.map((banca) => ({
    title: buscarTituloBanca(banca.id_trabalho),
    start: new Date(banca.data_hora),
    end: horarioFinalBanca(banca.data_hora),
    orientador: buscarNomeOrientador(banca.id_trabalho),
    convidados: buscarListaConvidados(banca.id_banca),
    grupo: buscarAlunosGrupo(banca.id_trabalho),
  }));

  const handleEventClick = (event) => {
    setSelectedBanca(event);
    setShowModal(true);
  };
  

  return (
    <Container className="Bancas_Listar_Container  px-8" fluid>
      {bancas.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom className="agenda-bancas">
            Lista de Bancas
          </Typography>
          <Paper elevation={3}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleEventClick}
            />
          </Paper>
        </>
      ) : (
        <h1>Ainda não há bancas cadastradas</h1>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Banca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBanca && (
            <div>
              <p>Título: {selectedBanca.title}</p>
              <p>Data de Início: {moment(selectedBanca.start).format("LLL")}</p>
              <p>Data de Término: {moment(selectedBanca.end).format("LLL")}</p>
              <p>Orientador: {selectedBanca.orientador}</p>
              <p>Convidados:</p>
              <ul>
                {selectedBanca.convidados &&
                  selectedBanca.convidados.map((nome) => (
                    <li key={nome}>{nome}</li>
                  ))}
              </ul>
              <p>Alunos do Grupo:</p>
              <ul>
                {selectedBanca.grupo && selectedBanca.grupo.map(nome => (
                  <li key={nome}>{nome}</li>
                ))}
              </ul>

              {/* Adicione mais informações da banca aqui */}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button onClick={() => setShowModal(false)}>Fechar</button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BancasListar;
