import { ChartData } from "./types";

export const chartDataMock: ChartData = {
    labels: ['BTC', 'ETH', 'USDT', 'ADA', 'BNB', 'XRP', 'SOL', 'DOT', 'DOGE', 'USDC'],
    nbsToBuy: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    targets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    datasets: [
        {
            label: 'Current',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: '#D4AF37',
            order: 1
        },
        {
            label: 'Target',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: '#3e9b39',
            order: 2
        }
    ]
  }