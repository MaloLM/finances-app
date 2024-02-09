export interface Asset {
    assetName: string
    unitPrice: number
    quantityOwned: number
    targetPercent: number
}

export interface TamFormData {
    assets: Asset[]
    currency: string
    budget: number
}

export interface TamFormResponseAsset {
    assetName: string
    unitPrice: number
    oldQuantity: number
    newQuantity: number
    additionalQuantity: number
    assetProp: number
    newProp: number
}

export interface TamFormResponse {
    assets: TamFormResponseAsset[]
}

export interface ChartData {
    labels: string[]
    nbsToBuy: number[]
    targets: number[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string
        order: number
    }[]
}
