import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailAluno = () => {
  const { id_aluno, codigo } = useParams();
  //const history = useHistory();
  const [validationSuccess, setValidationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`http://localhost:4000/alunos/${id_aluno}/${codigo}`)
    axios.patch(`http://localhost:4000/alunos/${id_aluno}/${codigo}`, { email_inst_verif: true })
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
  }, [id_aluno, codigo, process.env.MSS_PORTA_ALUNOS]);

  return (
    <div>
      {validationSuccess ? (
        <div>
          <p>Validação do e-mail ocorreu com sucesso!</p>
          <p>Redirecionando para a rota...</p>
        </div>
      ) : (
        <div>Aguarde, validando o seu cadastro...</div>
      )}
    </div>
  );
};

export default VerifyEmailAluno;
