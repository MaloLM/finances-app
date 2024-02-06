import { ChartData, TAMFormResponse, TAMFormResponseAsset, TamFormData } from "./types";

export function parseTamFormData(jsonString: string): TamFormData {
  try {
    const data = JSON.parse(jsonString) as TamFormData;
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON data");
  }
}

export function parseToTamResponse(input: any): TAMFormResponse {
  if (Array.isArray(input) && input.every(asset => typeof asset === 'object' && 'assetName' in asset)) {
    return { assets: input as TAMFormResponseAsset[] };
  } else {
    throw new Error("Invalid input type or structure for parseToTamResponse");
  }
}

export function convertToChartData(tamResponse: TAMFormResponse): ChartData {
  let labels: string[] = [];
  let oldQuantities: number[] = [];
  let quantitiesToBuy: number[] = [];
  let nbsToBuy: number[] = [];
  let targets: number[] = [];

  for (const asset of tamResponse.assets) {
    const label = `${asset.assetName} (${asset.newProp}%)`;
    const oldQ = asset.oldQuantity * asset.unitPrice;
    const nbToBuy = asset.additionalQuantity;
    const QtoBuy = nbToBuy * asset.unitPrice;
    const target = asset.assetProp * asset.unitPrice;

    labels.push(label);
    oldQuantities.push(oldQ);
    quantitiesToBuy.push(QtoBuy);
    nbsToBuy.push(nbToBuy);
    targets.push(target);
  }

  const data: ChartData = {
    labels: labels,
    nbsToBuy: nbsToBuy,
    targets: targets,
    datasets: [
      {
        label: 'Current Volume',
        data: oldQuantities,
        backgroundColor: '#d4b85b',
        order: 2,
      },
      {
        label: 'Next Buy',
        data: quantitiesToBuy,
        backgroundColor: '#998d05',
        order: 2,
      },
    ],
  };

  return data;
}