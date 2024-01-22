export interface Asset {
  assetName: string;
  unitPrice: number;
  quantityOwned: number;
  targetPercent: number;
}

export interface TamFormData {
  assets: Asset[];
  currency: string;
  budget: number;
}

export interface ChartData {
  labels: string[],
  nbsToBuy: number[],
  targets: number[],
  datasets: {
      label: string,
      data: number[],
      backgroundColor: string,
      order: number
  }[]
}