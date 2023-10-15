import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import '../index.css';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const data = [
  { label: 'Bancas', value: 50, color: '#252364' },
  { label: 'Alunos', value: 68, color: '#EE4138' },
  { label: 'Certificados', value: 40, color: '#01878A' },
  { label: 'Trabalhos', value: 40, color: '#4F2050' },
  { label: 'Professores', value: 50, color: '#F7AC23' },
];

const Painel = () => {

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    isAuthenticated &&
      console.log(user.sub.split('|')[1])
  }, [isAuthenticated]);

  return (
    <div className='Painel_Container'>
      <Stack direction="row">
        <PieChart
          series={[
            {
              paddingAngle: 5,
              innerRadius: 100,
              outerRadius: 150,
              data,
            },
          ]}
          margin={{ right: 5 }}
          width={400}
          height={400}
          legend={{ hidden: true }}
        />
      </Stack>
      {/* Início do primeiro gráfico - professores */}
      {/* <div className='graficos'>
        <div class="retangulo">
          <div class="metade-superior"></div>
          <div class="metade-inferior"></div>
        </div>
        <div class="poligono">
          <div class="poligono-metade-superior"></div>
          <div class="poligono-metade-inferior"></div>
          
        </div>
        <span className='figura'>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
            <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" />
          </svg>
        </span>
          <Stack direction="row" sx={{ width: '30%'}} className='grafico-professores'>
            <Box sx={{ flexGrow: 1}}>
              <SparkLineChart
                data={[3, 10, 3, 15, 9, 14, 4, 6]}
                height={60}
                curve="natural"
                area
              />
            </Box>
          </Stack>
      </div> */}
       {/* fim do primeiro gráfico - professores */}

      {/* Início do segundo gráfico - alunos */}
      {/* <div className='graficos'>
        <div class="retangulo">
          <div class="metade-superior"></div>
          <div class="metade-inferior"></div>
        </div>
        <div class="poligono">
          <div class="poligono-metade-superior"></div>
          <div class="poligono-metade-inferior"></div>
          
        </div>
        <span className='figura'>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
            <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" />
          </svg>
        </span>
          <Stack direction="row" sx={{ width: '30%'}} className='grafico-professores'>
            <Box sx={{ flexGrow: 1}}>
              <SparkLineChart
                data={[3, 10, 3, 15, 9, 14, 4, 6]}
                height={60}
                curve="natural"
                area
              />
            </Box>
          </Stack>
      </div> */}
      {/* fim do segundo gráfico - alunos */}

    </div>
  )
}

export default Painel