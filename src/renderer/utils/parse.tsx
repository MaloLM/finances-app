import { TamFormData } from "./types";

export function parseTamFormData(jsonString: string): TamFormData {
  try {
    const data = JSON.parse(jsonString) as TamFormData;
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON data");
  }
}


// TODO: create a type for the data returned by the TAM algorithm
export function prepareDataForTAMChart(data) {
  let labels: string[] = [];
  let oldQuantities: number[] = [];
  let quantitiesTobuy: number[] = [];
  let nbsToBuy: number[] = [];
  let targets: number[] = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let asset = data[key];
      let label = `${asset.assetName} (${asset.newProp}%)`;
      let oldQ = asset.oldQuantity * asset.unitPrice;
      let nbToBuy = asset.additionalQuantity;
      let QtoBuy = nbToBuy * asset.unitPrice;
      let target = asset.assetProp * asset.unitPrice;

      labels.push(label);
      oldQuantities.push(oldQ);
      quantitiesTobuy.push(QtoBuy);
      nbsToBuy.push(nbToBuy);
      targets.push(target);
    }
  }

  return { labels, oldQuantities, quantitiesTobuy, nbsToBuy, targets };
}
