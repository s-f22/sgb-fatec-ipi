import React, { useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';

const HorarioSelecaoProfs = () => {
  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const periodos = ['Manhã', 'Tarde', 'Noite'];
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horarios, setHorarios] = useState({});

  const handleDiaChange = (dia, isChecked) => {
    setDiasSelecionados(prevState => {
      const updatedDias = isChecked
        ? [...prevState, dia]
        : prevState.filter(d => d !== dia);

      // Remove os horários do dia desmarcado
      setHorarios(prevHorarios => {
        const updatedHorarios = { ...prevHorarios };
        if (!isChecked) {
          delete updatedHorarios[dia];
        }
        return updatedHorarios;
      });

      return updatedDias;
    });
  };

  const handlePeriodoChange = (dia, periodo, isChecked) => {
    setHorarios(prevHorarios => {
      const updatedHorarios = { ...prevHorarios };
      if (isChecked) {
        if (!updatedHorarios[dia]) {
          updatedHorarios[dia] = {};
        }
        updatedHorarios[dia][periodo] = { entrada: '', saida: '' };
      } else {
        delete updatedHorarios[dia][periodo];
        if (Object.keys(updatedHorarios[dia]).length === 0) {
          delete updatedHorarios[dia];
        }
      }
      return updatedHorarios;
    });
  };

  const handleHorarioChange = (dia, periodo, tipo, value) => {
    setHorarios(prevHorarios => {
      const updatedHorarios = { ...prevHorarios };
      if (!updatedHorarios[dia]) {
        updatedHorarios[dia] = {};
      }
      if (!updatedHorarios[dia][periodo]) {
        updatedHorarios[dia][periodo] = { entrada: '', saida: '' };
      }
      updatedHorarios[dia][periodo][tipo] = value;
      return updatedHorarios;
    });
  };

  return (
    <Form style={{display: 'flex', flexDirection: 'column'}}>
      <h3>Horários de trabalho:</h3>
      <p>Selecione abaixo os dias e horários que você trabalha na FATEC Ipiranga.</p>
      <div style={{display: 'grid', gridTemplateColumns: 'auto auto auto'}}>
        {diasSemana.map(dia => (
          <Card key={dia} style={{ marginBottom: '10px', padding: '10px', width: 300 }}>
            <div>
              <Form.Check
                type="checkbox"
                label={dia}
                checked={diasSelecionados.includes(dia)}
                onChange={e => handleDiaChange(dia, e.target.checked)}
              />
              {diasSelecionados.includes(dia) && (
                <div>
                  {periodos.map(periodo => (
                    <div key={`${dia}-${periodo}`} style={{ marginLeft: '20px' }}>
                      <Form.Check
                        type="checkbox"
                        label={periodo}
                        checked={!!(horarios[dia]?.[periodo])}
                        onChange={e => handlePeriodoChange(dia, periodo, e.target.checked)}
                      />
                      {horarios[dia]?.[periodo] && (
                        <Row>
                          <Col>
                            <Form.Group controlId={`${dia}-${periodo}-entrada`}>
                              <Form.Label>Entrada</Form.Label>
                              <input
                                type="time"
                                onChange={e =>
                                  handleHorarioChange(dia, periodo, 'entrada', e.target.value)
                                }
                                value={horarios[dia]?.[periodo]?.entrada || ''}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId={`${dia}-${periodo}-saida`}>
                              <Form.Label>Saída</Form.Label>
                              <input
                                type="time"
                                onChange={e =>
                                  handleHorarioChange(dia, periodo, 'saida', e.target.value)
                                }
                                value={horarios[dia]?.[periodo]?.saida || ''}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Form>
  );
};

export default HorarioSelecaoProfs;
