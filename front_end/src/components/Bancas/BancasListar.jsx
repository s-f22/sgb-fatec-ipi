import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import { Container } from "react-bootstrap";

const localizer = momentLocalizer(moment);

const BancasListar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [bancas, setBancas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trabalhosResponse, temasResponse, bancasResponse] =
          await Promise.all([
            axios.get("http://localhost:4005/trabalhos"),
            axios.get("http://localhost:4004/temas"),
            axios.get("http://localhost:4007/bancas"),
          ]);
        setTrabalhos(trabalhosResponse.data);
        setTemas(temasResponse.data);
        setBancas(bancasResponse.data);

        console.log("Trabalhos:", trabalhosResponse.data);
        console.log("Temas:", temasResponse.data);
        console.log("Bancas:", bancasResponse.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };
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

  const events = bancas.map((banca) => ({
    title: buscarTituloBanca(banca.id_trabalho),
    start: new Date(banca.data_hora),
    end: horarioFinalBanca(banca.data_hora),
  }));

  return (
    
    <Container className="Temas_Container" fluid>
      {bancas.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>
            Lista de Bancas
          </Typography>
          <Paper elevation={3}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </Paper>
        </>
      ) : (
        <h1>Ainda não há bancas cadastradas</h1>
      )}
    </Container>
  );
};

export default BancasListar;
