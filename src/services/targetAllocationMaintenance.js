function run_tam_optimization(data) {
  let res = {};

  for (let assetName in data.assets) {
    // Assurez-vous que la propriété appartient bien à l'objet
    if (data.assets.hasOwnProperty(assetName)) {
      let asset = data.assets[assetName];

      // Calculer une nouvelle quantité aléatoire
      let randomIncrement = Math.floor(Math.random() * 101); // Nombre aléatoire entre 0 et 100
      let newQuantity = asset.quantityOwned + randomIncrement;

      // Mettre à jour la quantité dans 'data'
      asset.quantityOwned = newQuantity;

      // Ajouter les informations dans 'res'
      res[assetName] = {
        oldQuantity: asset.quantityOwned - randomIncrement,
        newQuantity: newQuantity,
        unitPrice: asset.unitPrice,
        assetName: asset.assetName,
      };
    }
  }

  return { data, res };
}

module.exports = { run_tam_optimization };
