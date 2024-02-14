import React, { useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Asset } from '../../../utils/types'
import { DonutChart } from '../../DonutChart'
import { COLORS } from '../../../utils/constants'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
    className?: string
    assets: Asset[]
}

export const TamDonutChart = ({ assets, className }: DonutChartProps) => {
    const [borderColor, setBorderColor] = React.useState<string>('#262626')
    const [totalPurcentage, setTotalPurcentage] = React.useState<number>(0)

    useEffect(() => {
        let total: number = assets.reduce(
            (acc: number, asset) =>
                acc + (typeof asset.targetPercent === 'string' ? parseInt(asset.targetPercent) : asset.targetPercent),
            0,
        )

        setTotalPurcentage(total)
        if (total > 100) {
            setBorderColor(COLORS.error)
        } else if (total === 100) {
            setBorderColor(COLORS.nobleGold)
        } else {
            setBorderColor(COLORS.lightNobleBlack)
        }
    }, [assets])

    const data = {
        labels: assets.map((asset) => asset.assetName),
        datasets: [
            {
                label: 'Asset Allocation',
                data: assets.map((asset) => asset.targetPercent),
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
                borderColor: borderColor,
                borderWidth: 2,
            },
        ],
    }

    return (
        <div className={'relative flex items-center justify-center ' + className}>
            <DonutChart data={data} />
            <span
                className={`absolute text-4xl font-bold ${totalPurcentage > 100 ? 'text-error' : totalPurcentage === 100 ? 'text-nobleGold' : ''}`}
            >
                {totalPurcentage > 999 || totalPurcentage < 0.1 || isNaN(totalPurcentage)
                    ? '???'
                    : totalPurcentage + '%'}
            </span>
        </div>
    )
}
