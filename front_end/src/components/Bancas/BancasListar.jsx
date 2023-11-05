import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "react-big-calendar/lib/css/react-big-calendar.css";

function BancasListar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4007/bancas_navigation")
      .then((response) => {
        const calendarEvents = response.data.map((banca) => {
          const convidados = banca.convidados_navigation
            .map((c) => c.professor_navigation.nome)
            .join(", ");
          const grupo = banca.trabalho_navigation.grupo_navigation
            .map((g) => g.aluno_navigation.nome)
            .join(", ");

          return {
            id: banca.id_banca,
            title: banca.trabalho_navigation.tema_navigation.titulo,
            start: new Date(banca.data_hora),
            end: horarioFinalBanca(banca.data_hora),
            orientador: banca.trabalho_navigation.orientador_navigation.nome,
            convidados: convidados,
            grupo: grupo,
          };
        });

        setEvents(calendarEvents);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados do servidor:", error);
      });
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const horarioFinalBanca = (horarioInicio) => {
    const inicio = new Date(horarioInicio);
    const final = new Date(inicio.setMinutes(inicio.getMinutes() + 30));
    console.log("Novo horario", final.toISOString());
    return final;
  };

  return (
    <Box className="Temas_Container" p={2}>
      <Paper elevation={3}>
        <Typography variant="h5" component="div" align="center" p={2}>
          Calendário de Bancas
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Detalhes da Banca</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div>
              <DialogContentText>
                <strong>Título:</strong> {selectedEvent.title}
              </DialogContentText>
              <DialogContentText>
                <strong>Grupo:</strong> {selectedEvent.grupo}
              </DialogContentText>
              <DialogContentText>
                <strong>Orientador:</strong> {selectedEvent.orientador}
              </DialogContentText>
              <DialogContentText>
                <strong>Data e Hora:</strong>{" "}
                {selectedEvent.start.toLocaleString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Até:</strong> {selectedEvent.end.toLocaleString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Convidados:</strong> {selectedEvent.convidados}
              </DialogContentText>
              
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BancasListar;
