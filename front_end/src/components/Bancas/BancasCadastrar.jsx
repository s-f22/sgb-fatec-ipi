import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const BancasCadastrar = () => {
  const [idTema, setIdTema] = useState(0);

  const [dataHora, setDataHora] = useState(new Date);
  const [convidados, setConvidados] = useState([]);
  const [trabalhos, setTrabalhos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [dias_aula, setDias_aula] = useState([]);
  const [horarios_aula, setHorarios_aula] = useState([]);
  const [orientador, setOrientador] = useState({})
  const [diasAulaOrientador, setDiasAulaOrientador] = useState([]);
  const [horariosAulaOrientador, setHorariosAulaOrientador] = useState([]);
  const [horarios, setHorarios] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trabalhosResponse, temasResponse, professoresResponse, diaAulaResponse, horarioAulaResponse] = await Promise.all([
          axios.get('http://localhost:4005/trabalhos'),
          axios.get('http://localhost:4004/temas'),
          axios.get('http://localhost:4001/professores'),
          axios.get('http://localhost:4002/dia_aula'),
          axios.get('http://localhost:4003/horario_aula')
        ])
        setTrabalhos(trabalhosResponse.data)
        setTemas(temasResponse.data);
        setProfessores(professoresResponse.data);
        setDias_aula(diaAulaResponse.data);
        setHorarios_aula(horarioAulaResponse.data);

        console.log('Trabalhos:', trabalhosResponse.data);
        console.log('Temas:', temasResponse.data);
        console.log('Professores:', professoresResponse.data);
        console.log('Dias_aula:', diaAulaResponse.data);
        console.log('Horarios_aula:', horarioAulaResponse.data);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    }
    fetchData()

  }, [])



  const buscarOrientadorPeloTema = (tema) => {
    const trabalho = trabalhos.find((t) => t.id_tema === parseInt(tema));

    if (trabalho) {
      setOrientador(prevOrientador => {
        const novoOrientador = professores.find((p) => p.id_professor === trabalho.id_orientador);

        if (dias_aula.length > 0) {
          const diasFiltrados = dias_aula.filter((d) => d.id_professor === novoOrientador.id_professor);
          console.log('Dias de Aula do Orientador:', diasFiltrados);
          setDiasAulaOrientador(diasFiltrados)

          const horarios = diasFiltrados.map(diaAula => {
            return horarios_aula.find(horario => horario.id_dia_aula === diaAula.id_dia_aula);
          });

          const horariosFiltrados = horarios.filter(Boolean);

          setHorarios(horariosFiltrados);
        }

        return novoOrientador;
      });
    } else {
      setIdTema(0);
    }
  };





  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4007/bancas', {
        id_tema: idTema, // Alteração aqui para usar o id_tema selecionado
        data_hora: dataHora.toISOString()
      });

      // Limpar os campos após o envio bem-sucedido
      setIdTema('');
      setDataHora('');

      alert('Banca cadastrada com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar banca. Por favor, tente novamente.');
    }
  };

  return (
    <div className='Temas_Container'>
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
            {temas.map((tema) => (
              <option key={tema.id_tema} value={tema.id_tema}>
                {tema.titulo}
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

        <Button variant="primary" type="submit">
          Cadastrar Banca
        </Button>
      </Form>

      {idTema !== 0 && (
        <>
          <Form.Label style={{ marginTop: '1rem' }}>
            Professor Orientador:<span> {orientador.nome}</span>
          </Form.Label>
          
          {diasAulaOrientador.length > 0 && (
            <div>
              <h2>Dias de Aula do Orientador</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>Horários</th> {/* Adicionado uma nova coluna para os horários */}
                  </tr>
                </thead>
                <tbody>
                  {diasAulaOrientador.map((dia) => (
                    <tr key={dia.id_dia_aula}>
                      <td>{dia.dia_semana}</td>
                      <td>
                        <ul>
                          {horarios
                            .filter((horario) => horario.id_dia_aula === dia.id_dia_aula)
                            .map((horario) => (
                              <li key={horario.id_horario_aula}>
                                Entrada: {horario.entrada}, Saída: {horario.saida}
                              </li>
                            ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}



        </>
      )}

    </div>
  );

};

export default BancasCadastrar;