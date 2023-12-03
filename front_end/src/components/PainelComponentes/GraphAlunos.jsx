import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

 const  GraphAluno = () => {
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
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            // width={180}
            area={true}
            showHighlight={showHighlight}
            showTooltip={showTooltip}  
            colors={['#FFA500']}
            sx={{
              '.MuiLineElement-root': {
                stroke: '#333',
                strokeWidth: 2,
              },
              '.MuiAreaElement-root': {
                // fill: '#f9fada',
                fill: '#999',
              },
              '.MuiHighlightElement-root': {
               fill: '#FFA500',
              },           
            }}
          />
        </Box>
        {/* <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
          />
        </Box> */}
      </Stack>
    </Stack>
  );
}

export default GraphAluno;