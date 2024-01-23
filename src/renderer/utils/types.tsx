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

export interface TAMFormResponseAsset {
  assetName: string;
  unitPrice: number;
  oldQuantity: number;
  newQuantity: number;
  additionalQuantity: number;
  assetProp: number;
  newProp: number;
}

export interface TAMFormResponse {
  assets: TAMFormResponseAsset[];
};


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