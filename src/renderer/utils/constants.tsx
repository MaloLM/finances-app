import { ChartData, TamFormData } from './types'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

export const COLORS = {
    nobleGold: fullConfig.theme.colors.nobleGold,
    darkerNobleGold: fullConfig.theme.colors.darkerNobleGold,
    nobleBlack: fullConfig.theme.colors.nobleBlack,
    lightNobleBlack: fullConfig.theme.colors.lightNobleBlack,
    softWhite: fullConfig.theme.colors.softWhite,
    lightGray: fullConfig.theme.colors.lightGray,
    secondaryGold: fullConfig.theme.colors.secondaryGold,
    error: fullConfig.theme.colors.error,
}

// This is a mock chart data to display in the blured section
export const MOCK_CHART_DATA: ChartData = {
    labels: ['BTC', 'ETH', 'USDT', 'ADA', 'BNB', 'XRP', 'SOL', 'DOT', 'DOGE', 'USDC'],
    nbsToBuy: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    targets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    datasets: [
        {
            label: 'Current',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: COLORS.secondaryGold,
            order: 1,
        },
        {
            label: 'Target',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: COLORS.darkerNobleGold,
            order: 2,
        },
    ],
}

export const CURRENCIES = new Map<string, string>([
    ['USD', '$'], // US Dollar
    ['EUR', '€'], // Euro
    ['JPY', '¥'], // Japanese Yen
    ['GBP', '£'], // British Pound
    ['AUD', 'A$'], // Australian Dollar
    ['CAD', 'C$'], // Canadian Dollar
    ['CHF', 'CHF'], // Swiss Franc, no widely recognized symbol, use code
    ['CNH', '¥'], // Chinese Yuan (Offshore), same symbol as Yen
    ['SEK', 'kr'], // Swedish Krona
    ['NZD', 'NZ$'], // New Zealand Dollar
])

export const INIT_TAM_DATA: TamFormData = {
    assets: [
        {
            assetName: 'BTC',
            unitPrice: 10000,
            quantityOwned: 1,
            targetPercent: 70,
        },
        {
            assetName: 'ETH',
            unitPrice: 1000,
            quantityOwned: 10,
            targetPercent: 15,
        },
        {
            assetName: 'USDT',
            unitPrice: 1,
            quantityOwned: 100,
            targetPercent: 15,
        },
    ],
    budget: 100000,
    currency: 'USD',
}
