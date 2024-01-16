/**
 * Optimizes asset distribution in a portfolio to match target percentages.
 *
 * @param {Object} data - The portfolio data including assets, currency, and budget.
 * @returns {Object} The updated portfolio data and the new distribution of assets.
 */
// function run_tam_optimization(data) {
//   let totalValue = Object.values(data.assets).reduce(
//     (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
//     data.budget
//   );

//   // Calculer la valeur cible pour chaque actif
//   let targetValues = {};
//   for (let assetName in data.assets) {
//     let asset = data.assets[assetName];
//     targetValues[assetName] = totalValue * (asset.targetPercent / 100);
//   }

//   let budget = data.budget;
//   let res = {};

//   // Tant que le budget est positif, allouer de manière itérative
//   while (budget > 0) {
//     let allocationFound = false;

//     for (let assetName in data.assets) {
//       let asset = data.assets[assetName];
//       let currentValue = asset.unitPrice * asset.quantityOwned;
//       let gap = targetValues[assetName] - currentValue;
//       let additionalQuantity = 0;

//       if (gap > asset.unitPrice && budget >= asset.unitPrice) {
//         additionalQuantity = Math.min(
//           Math.floor(gap / asset.unitPrice),
//           Math.floor(budget / asset.unitPrice)
//         );
//         asset.quantityOwned += additionalQuantity;
//         budget -= additionalQuantity * asset.unitPrice;
//         allocationFound = true;
//       }

//       // Mise à jour des résultats
//       let newProp =
//         ((asset.unitPrice * asset.quantityOwned) / totalValue) * 100;
//       newProp = Math.round(newProp * 10) / 10;

//       res[assetName] = {
//         oldQuantity: asset.quantityOwned - additionalQuantity,
//         newQuantity: asset.quantityOwned,
//         unitPrice: asset.unitPrice,
//         assetName: asset.assetName,
//         assetProp: asset.targetPercent,
//         newProp: newProp,
//       };
//     }

//     if (!allocationFound) {
//       break;
//     }
//   }

//   return { data, res };
// }

function run_tam_optimization(data) {
  let totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    data.budget
  );

  // Déterminer les valeurs cibles pour chaque actif
  let targetValues = {};
  for (let assetName in data.assets) {
    let asset = data.assets[assetName];
    targetValues[assetName] = totalValue * (asset.targetPercent / 100);
  }

  let budget = data.budget;
  let res = {};

  // Allocation du budget
  for (let assetName in data.assets) {
    let asset = data.assets[assetName];
    let gap = targetValues[assetName] - asset.unitPrice * asset.quantityOwned;
    let additionalQuantity = 0;

    if (gap > 0 && budget >= asset.unitPrice) {
      additionalQuantity = Math.min(
        Math.floor(gap / asset.unitPrice),
        Math.floor(budget / asset.unitPrice)
      );

      asset.quantityOwned += additionalQuantity;
      budget -= additionalQuantity * asset.unitPrice;
    }

    res[assetName] = {
      oldQuantity: asset.quantityOwned - additionalQuantity,
      newQuantity: asset.quantityOwned,
      additionalQuantity: additionalQuantity,
      unitPrice: asset.unitPrice,
      assetName: asset.assetName,
      assetProp: asset.targetPercent,
    };
  }

  // Mise à jour de la valeur totale et des proportions après les achats
  totalValue = Object.values(data.assets).reduce(
    (sum, asset) => sum + asset.unitPrice * asset.quantityOwned,
    budget
  );

  for (let assetName in res) {
    let asset = res[assetName];
    let newProp = ((asset.unitPrice * asset.newQuantity) / totalValue) * 100;
    res[assetName].newProp = Math.round(newProp * 10) / 10;
  }

  return { data, res };
}

module.exports = { run_tam_optimization };
