import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
// require('dotenv').config({ path: '../../.env' });

const VerifyEmailProfessor = () => {
  const { id_professor, codigo } = useParams();
  const [validationSuccess, setValidationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`http://localhost:4001/professores/${id_professor}/${codigo}`)
    axios.patch(`http://localhost:4001/professores/${id_professor}/${codigo}`, { email_inst_verif: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setValidationSuccess(true);

        setTimeout(() => {
          navigate("/sgb");
        }, 3000);
      })
      .catch(error => {
        console.error('Erro ao atualizar o atributo:', error);
      });
  }, [id_professor, codigo, process.env.MSS_PORTA_PROFESSORES]);

  return (
    <div>
      {validationSuccess ? (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <h3 style={{ alignSelf: 'center' }}>Validação do e-mail efetuada com sucesso!</h3>
          <p style={{ alignSelf: 'center' }}>Redirecionando...</p>
          <Spinner style={{ alignSelf: 'center' }} animation="grow" />
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <p style={{ alignSelf: 'center' }}>Redirecionando...</p>
          <Spinner style={{ alignSelf: 'center' }} animation="grow" />
        </div>
      )}
    </div>
  )
};

export default VerifyEmailProfessor;
