// DonutChart.tsx
import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Asset } from '../../utils/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    assets: Asset[];
}

export const DonutChart = ({ assets }: DonutChartProps) => {
    const [borderColor, setBorderColor] = React.useState<string>("#262626");
    const [totalPurcentage, setTotalPurcentage] = React.useState<number>(0);

    useEffect(() => {
        const total = assets.reduce((acc, asset) => acc + asset.targetPercent, 0);
        setTotalPurcentage(total);
        if (total > 100) {
            setBorderColor("#FF0000");
        }else{
            setBorderColor("#262626");
        }
    }, [assets]);

    const data = {
        labels: assets.map(asset => asset.assetName),
        datasets: [
            {
                label: 'Asset Allocation',
                data: assets.map(asset => asset.targetPercent),
                backgroundColor: [
                    '#0E4D92', // Deep Sapphire
                    '#EE6C4D', // Burnt Sienna
                    '#8DAA91', // Sage Green
                    '#DDBDD5', // Dusky Pink
                    '#B09885', // Warm Taupe
                    '#487A7B', // Teal
                    '#708238', // Olive Green
                    '#AB4E52', // Crimson
                ],
                hoverOffset: 4,
                borderColor: borderColor, // softWhite color for the border
                borderWidth: 0.5, // Set the width of the border

            }
        ]
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom' as const,
                display: false,
            },
        },
    };


    return (
        <div className='flex items-center justify-center relative'>
            <Doughnut data={data} options={options} />
            <span className={`absolute text-4xl font-bold ${totalPurcentage>100? "text-red-600" : " "}`}>{totalPurcentage}%</span>
        </div>
    );
};
