import * as React from 'react';

import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Grid } from '@mui/material';

const data = [
    { label: 'Por Alunos', value: 400, color: '#345059' },
    { label: 'Por Professores', value: 300, color: '#999' },
];

const sizing = {
    margin: { right: 3, left: 3, top: 0, bottom: 2 },
    width: 150,
    height: 100,
    legend: { hidden: true },
};
const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
};

const PieChartTemas = () => {
    return (
        <Grid
        style={{display: 'flex'}}
        >
            <PieChart
                series={[
                    {
                        outerRadius: 50,
                        innerRadius: 10,
                        data,
                        arcLabel: getArcLabel,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontSize: 14,
                    },
                }}
                {...sizing}
            />
        </Grid>
    );
}


export default PieChartTemas;