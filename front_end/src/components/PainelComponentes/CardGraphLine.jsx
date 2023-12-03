import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Grid } from '@mui/material';


const CardGraphLine = () => {
 
  const colors = {
    primary: '#333',
    secondary: '#ffa500',
  };
  

  return (
    <>
      <Grid style={{display:'flex'}}>
        <LineChart
          xAxis={[{ data: [2, 3, 5, 8, 9, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
              // area: true,
              label: 'Trabalhos Cadastrados',
              color: '#333',
            },
          ]}
          width={900}
          height={350}
        />
      </Grid>
    </>
  );
}

export default CardGraphLine;

