import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Grid } from '@mui/material';

const CardGraphPie = () => {

    const data = [
        { id: 0, value: 10, label: 'Temas', color: '#82230F' },
        { id: 1, value: 15, label: 'Trabalhos', color: '#ffa500' },
        { id: 2, value: 20, label: 'Bancas', color: '#333' },
    ];

    return (
        <Grid style={{ display: 'flex' }}>
            <PieChart
                series={[
                    {
                        data,
                        innerRadius: 50,
                        outerRadius: 110,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                height={350}
                width={400}
            />
        </Grid>
    );
}


export default CardGraphPie;