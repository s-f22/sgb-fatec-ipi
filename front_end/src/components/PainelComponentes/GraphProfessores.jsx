import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

 const  GrapphAluno = () => {
  const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event) => {
    setShowHighlight(event.target.checked);    
  };

  const handleTooltipChange = (event) => {
    setShowTooltip(event.target.checked);
  };

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
            colors={['#FFA500']}
            sx={{
              '.MuiBarElement-root': {
                fill: '#777',
              },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default GrapphAluno;