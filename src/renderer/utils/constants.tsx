import { ChartData } from "./types";

// This is a mock chart data to display in the blured section
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
            backgroundColor: '#998d05',
            order: 2
        }
    ]
  }

  export const CURRENCIES = new Map<string, string>([
    ["USD", "$"], // US Dollar
    ["EUR", "€"], // Euro
    ["JPY", "¥"], // Japanese Yen
    ["GBP", "£"], // British Pound
    ["AUD", "A$"], // Australian Dollar
    ["CAD", "C$"], // Canadian Dollar
    ["CHF", "CHF"], // Swiss Franc, no widely recognized symbol, use code
    ["CNH", "¥"], // Chinese Yuan (Offshore), same symbol as Yen
    ["SEK", "kr"], // Swedish Krona
    ["NZD", "NZ$"] // New Zealand Dollar
]);
