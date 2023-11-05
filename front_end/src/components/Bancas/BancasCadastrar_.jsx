import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const BancasCadastrar = () => {
  const [trabalhos, setTrabalhos] = useState([]);
  const [idTrabalhoSelecionado, setIdTrabalhoSelecionado] = useState('');
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    axios.get("http://localhost:4005/trabalhos_navigation")
      .then((response) => {
        setTrabalhos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar trabalhos:", error);
      });
  }, []);

  const handleDataHoraChange = (event) => {
    setDataHora(event.target.value);
  };

  const handleIdTrabalhoChange = (event) => {
    setIdTrabalhoSelecionado(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const dataHoraStringToDate = new Date(dataHora);
      const response = await axios.post("http://localhost:4007/bancas", {
        id_trabalho: idTrabalhoSelecionado,
        data_hora: dataHoraStringToDate.toISOString(),
      });
      console.log(response.data); // Exiba a resposta do servidor (opcional)
    } catch (error) {
      console.error("Erro ao enviar dados para o servidor:", error);
    }
  };

  return (
    <Card className="Temas_Container">
      <CardContent>
        <FormControl fullWidth>
          <InputLabel>Selecione um trabalho</InputLabel>
          <Select
            value={idTrabalhoSelecionado}
            onChange={handleIdTrabalhoChange}
          >
            {trabalhos.map((trabalho) => (
              <MenuItem key={trabalho.id_trabalho} value={trabalho.id_trabalho}>
                {trabalho.tema_navigation.titulo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Data e Hora da Banca"
          type="datetime-local"
          value={dataHora}
          onChange={handleDataHoraChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Agendar Banca
        </Button>
      </CardContent>
    </Card>
  );
};

export default BancasCadastrar;
