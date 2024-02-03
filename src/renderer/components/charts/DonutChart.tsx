// DonutChart.tsx
import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Asset } from '../../utils/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    className?: string;
    assets: Asset[];
}

export const DonutChart = ({ assets, className }: DonutChartProps) => {
    const [borderColor, setBorderColor] = React.useState<string>("#262626");
    const [totalPurcentage, setTotalPurcentage] = React.useState<number>(0);

    useEffect(() => {
        const total = assets.reduce((acc, asset) => acc + asset.targetPercent, 0);
        setTotalPurcentage(total);
        if (total > 100) {
            setBorderColor("#d10000"); // red color for the border
        } else if (total === 100) {
            setBorderColor("#D4AF37");
        } else {
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
                    '#eccba0',
                    '#a69151',
                    '#ad8851',
                    '#241935',
                    '#8c9364',
                    '#cfc1b2',
                    '#947c5c',
                    '#4c3c24',
                    '#d4c9b3',
                ],
                hoverOffset: 4,
                borderColor: borderColor, // softWhite color for the border
                borderWidth: 2, // Set the width of the border

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
        <div className={'flex items-center justify-center relative '+ className}>
            <Doughnut data={data} options={options} />
            <span className={`absolute text-4xl font-bold ${totalPurcentage > 100 ? "text-error" : totalPurcentage === 100 ? "text-nobleGold" : ""}`}>{totalPurcentage > 999 ||totalPurcentage < 0.1? "???" : totalPurcentage+"%"}</span>
        </div>
    );
};
