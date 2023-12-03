import React from 'react';
import { Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';



const CardGraphBar = () => {

    const uData = [6, 6.3, 6.5];
    const pData = [10, 9.5, 8.8];
    const xLabels = [
        'Dez/22',
        'Jul/23',
        'Dez/23'
    ];


    return (
        <>
            <Grid style={{display: 'flex'}}>
                <BarChart
                    responsive
                    width={400}
                    height={350}
                    // Isso fará com que as dimensões se ajustem com base nos breakpoints
                    colors={['#333333', '#FFA500']}
                    series={[
                        { data: pData, label: 'Maior Nota', id: 'pvId' },
                        { data: uData, label: 'Menor Nota', id: 'uvId' },
                    ]}
                    xAxis={[{ data: xLabels, scaleType: 'band' }]}
                />
            </Grid>
        </>
    );

}


export default CardGraphBar;
