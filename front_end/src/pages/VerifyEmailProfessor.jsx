import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailProfessor = () => {
  const { idProfessor } = useParams();

  useEffect(() => {
    axios.patch(`http://localhost:${process.env.MSS_PORTA_PROFESSORES}/professores/${idProfessor}`, { emailInstVerif: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar o atributo:', error);
      });
  }, [idProfessor]);

  return <div>Aguarde, validando o seu cadastro...</div>;
};

export default VerifyEmailProfessor;
