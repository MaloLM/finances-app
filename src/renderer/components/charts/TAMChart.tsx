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
                    legend: {
                        labels: {
                            color: 'white', // Color for legends (can be rgba or hex)
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            color: '#0B0B0B', // Color for x-axis lines (can be rgba or hex)
                        },
                        ticks: {
                            color: '#F8F8F8', // Color for y-axis legends (can be rgba or hex)
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            color: '#0B0B0B', // Color for x-axis lines (can be rgba or hex)
                        },
                        ticks: {
                            color: '#F8F8F8', // Color for y-axis legends (can be rgba or hex)
                        }
                    },
                },
            }} />
    )
};