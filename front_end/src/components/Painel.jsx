import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Typography, Grid, Paper, Container } from "@mui/material";
import CardProfessor from "./PainelComponentes/CardProfessor";
import CardAluno from "./PainelComponentes/CardAluno";
import CardTema from "./PainelComponentes/CardTema";
import CardTemaDisponivel from "./PainelComponentes/CardTemaDisponivel";
import CardTrabAtivos from "./PainelComponentes/CardTrabAtivos";
import CardTrabConcluidos from "./PainelComponentes/CardTrabConcluidos";
import CardBancas from "./PainelComponentes/CardBancas";
import CardNotaMedia from "./PainelComponentes/CardNotaMedia";
import CardGraphBar from "./PainelComponentes/CardGraphBar";
import CardGraphPie from "./PainelComponentes/CardGraphPie";
import CardGraphLine from "./PainelComponentes/CardGraphLine";

const Painel = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [professor, setProfessor] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const dados = {
    numProfessores: <CardProfessor />,
    numAlunos: <CardAluno />,
    numTemasCadastrados: <CardTema />,
    numTemasDisponiveis: <CardTemaDisponivel />,
    numTrabalhosAtivos: <CardTrabAtivos />,
    numTrabalhosConcluidos: <CardTrabConcluidos />,
    numBancasAgendadas: <CardBancas />,
    notaMediaTrabalhos: <CardNotaMedia />,

    /*Gráfico Maior e Menor Nota no período*/
    maiorEMenorNotaPeriodo: <CardGraphBar />,
     /*Gráfico Bancas por Curso*/
     graficoLinhas: <CardGraphLine />,
     
    /*Gráfico percentual*/
    percentualSemestre: <CardGraphPie />,

   
  //   
  };

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        console.log(user.sub.split("|")[1]);
        buscarProfessor(userIdHandler(user.sub.split("|")[1]));
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const buscarProfessor = async (idDoProfessor) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/professores/${idDoProfessor}`
      );
      const resultado = response.data;
      console.log(process.env.REACT_APP_AUTH0_CLIENT_ID);
      setProfessor(resultado);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar o professor:", error);
    }
  };

  const userIdHandler = (valor) => {
    return valor;
  };

  return (
    <div className="Painel_Container">
      {loading ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100vh",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ alignSelf: "center" }}>Carregando...</p>
          <Spinner
            style={{ alignSelf: "center", marginBottom: "50px" }}
            animation="grow"
          />
        </div>
      ) : professor.email_inst_verif === true ? (
        <>
          <Container maxWidth>
            <Typography variant="h4" gutterBottom className="painel-controle">
              Painel de Indicadores
            </Typography>
            <Grid container spacing={3} className="mb-5 justify-content-between">
              {Object.keys(dados).map((key) => (
                <Grid item xs={12} sm={6} md={key === 'graficoLinhas' ? 6 : 3} key={key}>
                  <Paper
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #ccc",
                      // padding: "10px",
                      textAlign: "center",
                      color: "text.primary",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      width: '100%',
                    }}
                  >
                    <Typography style={{ fontSize: '15px', color: '#333'}}></Typography>
                    {key === 'maiorEMenorNotaPeriodo' ? ' ' : null}
                    {key === 'notaMediaTrabalhos' ? ' ' : null}
                    {key === 'percentualSemestre' ? ' ' : null}
                    {key === 'numTemasDisponiveis' ? ' ' : null}
                    {key === 'numTemasCadastrados' ? ' ' : null}
                    {key === 'numTrabalhosAndamento' ? ' ' : null}
                    {key === 'numTrabalhosConcluidos' ? ' ' : null}
                    {key === 'numBancasAgendadas' ? ' ' : null}
                    {key === 'bancasPorCurso' ? ' ' : null}
                    {key === 'numAlunos' ? ' ' : null}
                    {key === 'numProfessores' ? ' ' : null}
                    {key === 'graficoLinhas' ? ' ' : null}

                    <Typography variant="h4" style={{ fontSize: '35px', color: '#FFA500' }}>{dados[key]}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      ) : (
        <div>
          <h2 style={{ width: "50%" }}>Bem vindo ao SGB-Fatec-Ipiranga!</h2>
          <h3 style={{ width: "50%", marginTop: "30px" }}>
            Para ter acesso completo às funcionalidades do sistema, por favor,{" "}
            <b>verifique seu e-mail</b> e clique no link de ativação.
          </h3>
          <h4 style={{ marginTop: "30px" }}>
            Caso não tenha recebido o link, entre em contato com o suporte:
          </h4>
          <a href="">algumEmailDeSuporte@fatec.sp.gov.br</a>
        </div>
      )}
    </div>
  );
};

export default Painel;
