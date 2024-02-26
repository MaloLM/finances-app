/**
 * Optimizes asset distribution in a portfolio to match target percentages.
 *
 * @param {Object} data - The portfolio data including assets, currency, and budget.
 * @returns {Object} The updated portfolio data and the new distribution of assets.
 */

function run_tam_optimization(data) {
    let totalValue = data.assets.reduce((sum, asset) => sum + asset.unitPrice * asset.quantityOwned, 0)
    let budget = data.budget

    // Prepare initial adjustments tracking
    let adjustments = data.assets.map((asset) => ({
        assetName: asset.assetName,
        oldQuantity: asset.quantityOwned,
        additionalQuantity: 0,
        unitPrice: asset.unitPrice,
        assetProp: asset.targetPercent,
        newQuantity: asset.quantityOwned,
        newProp: 0,
    }))

    // Function to update and sort assets by their need for adjustment
    let updateAndSortAssets = () => {
        totalValue = data.assets.reduce((sum, asset) => sum + asset.unitPrice * asset.quantityOwned, 0) + budget
        data.assets.forEach((asset) => {
            asset.currentValue = asset.unitPrice * asset.quantityOwned
            asset.currentProp = (asset.currentValue / totalValue) * 100
            asset.gap = asset.targetPercent - asset.currentProp
        })

        return [...data.assets].filter((a) => a.gap > 0).sort((a, b) => b.gap - a.gap)
    }

    let assetsByNeed = updateAndSortAssets()

    // Main loop to adjust asset quantities
    while (budget > 0 && assetsByNeed.length > 0) {
        let madePurchase = false

        for (let asset of assetsByNeed) {
            if (budget >= asset.unitPrice) {
                let quantityToBuy = 1 // Attempt to buy one unit at a time
                asset.quantityOwned += quantityToBuy
                budget -= asset.unitPrice * quantityToBuy

                let adjustment = adjustments.find((a) => a.assetName === asset.assetName)
                adjustment.additionalQuantity += quantityToBuy
                adjustment.newQuantity = asset.quantityOwned

                madePurchase = true
                break // Break after a successful purchase to re-evaluate needs
            }
        }

        if (!madePurchase) {
            break // Exit loop if no purchases were made in this iteration
        }

        assetsByNeed = updateAndSortAssets() // Re-evaluate and sort assets after each purchase
    }

    // Final update for new proportions
    totalValue = data.assets.reduce((sum, asset) => sum + asset.unitPrice * asset.quantityOwned, 0)
    adjustments.forEach((adjustment) => {
        let asset = data.assets.find((a) => a.assetName === adjustment.assetName)
        adjustment.newProp = ((asset.unitPrice * adjustment.newQuantity) / totalValue) * 100
    })

    // Filter out adjustments where no purchases were made
    return adjustments.filter((adjustment) => adjustment.additionalQuantity >= 0)
}

module.exports = { run_tam_optimization };
