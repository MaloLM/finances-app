import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "../../utils";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export const TAMChart = (props: { chartData: ChartData }) => {
    return (
        <Bar className="w-full h-full" data={props.chartData}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                        text: 'New Target Allocation',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || "";
                                if (label === "Next Buy") {
                                    label += `: ${context.raw} (Quantity to buy: ${props.chartData.nbsToBuy[context.dataIndex]})`;
                                } else {
                                    label += `: ${context.raw}`;
                                }
                                return label;
                            },
                        },
                    },
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true },
                },
            }} />
    )
};