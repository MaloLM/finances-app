let assetId = 0;
let result;

parent.postMessage({ action: "requestData" }, "*");

/**
 * Event listener for 'message' events on the window object. It handles two types of actions:
 * 'responseData' and 'writeResponse', each processing data received through the event differently.
 *
 * For 'responseData' action:
 * - Parses the event data, extracts assets information and updates the UI accordingly.
 * - Validates the assets structure before processing. Each asset should have 'assetName',
 *   'unitPrice', 'quantityOwned', and 'targetPercent' properties.
 * - Updates budget and currency values in the UI if they are present in the data.
 *
 * For 'writeResponse' action:
 * - Extracts and processes data for chart display.
 * - Calls functions to prepare data for the chart, show the result title, and display the chart.
 *
 * @param {Event} event - The event object received from the message event.
 */
window.addEventListener("message", (event) => {
  if (event.data.action === "responseData") {
    let dataString = event.data.data;

    const data = JSON.parse(dataString);

    let assets = data.assets;

    if (
      Object.keys(assets).length > 0 &&
      Object.keys(assets).every(
        (key) =>
          assets[key].hasOwnProperty("assetName") &&
          assets[key].hasOwnProperty("unitPrice") &&
          assets[key].hasOwnProperty("quantityOwned") &&
          assets[key].hasOwnProperty("targetPercent")
      )
    ) {
      Object.keys(assets).forEach((key) => {
        const line = assets[key];
        addAsset(
          line.assetName,
          line.unitPrice,
          line.quantityOwned,
          line.targetPercent
        );
      });
    } else {
      addAsset();
    }
    if (data.budget) {
      document.getElementById("budget").value = data.budget;
    }
    if (data.currency) {
      document.getElementById("currency").value = data.currency;
    }
  } else if (event.data.action === "writeResponse") {
    const data = event.data.data;

    result = data.message;

    let { labels, oldQuantities, quantitiesTobuy, nbsToBuy, targets } =
      prepareDataForChart(data.message);

    showResultTitle();
    showUpdateButton();
    display(labels, oldQuantities, quantitiesTobuy, nbsToBuy, targets);
  }
});

/**
 * Adds an asset input row to the assets form in the UI. It creates a new div element with
 * input fields for asset name, unit price, quantity owned, and target percentage. Each field
 * is pre-populated with the provided values, if any. Also, a delete button is added to each
 * asset row to allow removal of the asset.
 *
 * @param {string} [name=""] - The name of the asset. Defaults to an empty string.
 * @param {number|null} [unitPrice=null] - The unit price of the asset. Defaults to null.
 * @param {number|null} [quantityOwned=null] - The quantity of the asset owned. Defaults to null.
 * @param {number|null} [targetPercent=null] - The target percentage for the asset. Defaults to null.
 */
function addAsset(
  name = "",
  unitPrice = null,
  quantityOwned = null,
  targetPercent = null
) {
  const form = document.getElementById("assets-form");
  const newAsset = document.createElement("div");
  newAsset.innerHTML = `
        <input type="text" placeholder="Asset Name" name="assetName-${assetId}" value="${name}">
        <input type="number" placeholder="Unit Price" name="unitPrice-${assetId}" value="${unitPrice}">
        <input type="number" placeholder="Quantity Owned" name="quantityOwned-${assetId}" value="${quantityOwned}">
        <input type="number" placeholder="Target %" name="targetPercent-${assetId}" value="${targetPercent}">
        <button onclick="removeAsset(this)">Delete</button>
    `;
  newAsset.classList.add("asset-row");
  form.appendChild(newAsset);
  assetId++;
}

/**
 * Removes an asset row from the UI. This function is typically called from a delete button
 * within an asset row. It removes the parent element of the button, effectively deleting
 * the entire asset row from the form.
 *
 * @param {HTMLButtonElement} button - The button element that triggered the function call,
 *                                     typically the delete button in an asset row.
 */
function removeAsset(button) {
  button.parentElement.remove();
}

/**
 * Retrieves and constructs an object representing the assets from the asset form in the UI.
 * Each asset is identified by its name and contains details such as unit price, quantity owned,
 * and target percentage. This function iterates over each asset row in the form, extracting
 * and parsing the values from the input fields.
 *
 * Note: It assumes that the asset names are unique. If asset names are not unique, it is
 * advisable to use a different unique identifier for each asset.
 *
 * @returns {Object} An object where each key is the name of an asset and the value is an
 *                   object containing details of the asset (assetName, unitPrice,
 *                   quantityOwned, targetPercent).
 */
function getAssets() {
  const assets = {};
  const formElements = document.querySelectorAll("#assets-form .asset-row");
  formElements.forEach((element, index) => {
    const nameInput = element.querySelector("input[type='text']");
    const unitPriceInput = element.querySelector("input[name^='unitPrice']");
    const quantityOwnedInput = element.querySelector(
      "input[name^='quantityOwned']"
    );
    const targetPercentInput = element.querySelector(
      "input[name^='targetPercent']"
    );

    if (
      nameInput &&
      unitPriceInput &&
      quantityOwnedInput &&
      targetPercentInput
    ) {
      const assetKey = nameInput.value; // Using the asset name as the key; ensure it's unique
      // If asset names are not unique, consider using the index or another unique identifier

      assets[assetKey] = {
        assetName: nameInput.value,
        unitPrice: parseFloat(unitPriceInput.value),
        quantityOwned: parseInt(quantityOwnedInput.value, 10),
        targetPercent: parseFloat(targetPercentInput.value),
      };
    }
  });
  return assets;
}

/**
 * Collects and prepares data from the assets form, including the budget and currency, and
 * sends this data to the parent frame or window using postMessage. It first retrieves the
 * assets data using the `getAssets` function, then fetches the budget and currency values
 * from their respective input elements. The collected data is structured into a single object
 * and sent to the parent frame or window.
 *
 * Note: The postMessage function is used for sending data securely across different browsing
 * contexts in the same origin. The target origin is set to '*', which means it can send messages
 * to any origin. This should be used with caution and ideally replaced with a specific target origin
 * for security reasons.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage}
 */
function compute() {
  const assets = getAssets();
  const budget = document.getElementById("budget").value;
  const currency = document.getElementById("currency").value;

  const formData = {
    assets: assets,
    currency: currency,
    budget: parseFloat(budget),
  };

  parent.postMessage({ action: "sendData", data: formData }, "*");
}

/**
 * Updates the configuration of assets based on the global `result` object. This function takes
 * asset data from the form, processes it against the `result` data, and then posts the updated
 * configuration to the parent window. It also updates the form's displayed quantities using
 * `updateFormOwnedQuantities`.
 *
 * Global Dependencies:
 * - Assumes the existence of a global `result` object containing updated asset data.
 * - Relies on the `updateFormOwnedQuantities` function for updating form elements.
 * - Depends on the `getAssets` function to retrieve current asset data from the form.
 *
 * Side Effects:
 * - Modifies the DOM elements within the "#assets-form" based on `result` data.
 * - Sends a message to the parent window with the updated asset configuration.
 *
 * @throws {Error} Throws an error if `result` is not defined or in an unexpected format.
 */
function update_config() {
  if (result) {
    const assetsObject = getAssets(); // This is an object, not an array
    const budget = document.getElementById("budget").value;
    const currency = document.getElementById("currency").value;

    // Convert the assets object into an array of its values
    const assetsArray = Object.values(assetsObject);

    // Convert the result object into an array of its values
    const resultArray = Object.values(result);

    // Process each asset in the array
    assetsArray.forEach((asset) => {
      if (asset.hasOwnProperty("quantityOwned")) {
        // Use the resultArray for finding the corresponding result
        const correspondingResult = resultArray.find(
          (r) => r.assetName === asset.assetName
        );

        if (correspondingResult) {
          asset.quantityOwned = correspondingResult.newQuantity;
        }
      }
    });

    // Convert the assets array back to an object if necessary
    const updatedAssetsObject = {};
    assetsArray.forEach((asset) => {
      updatedAssetsObject[asset.assetName] = asset;
    });

    const formData = {
      assets: updatedAssetsObject,
      currency: currency,
      budget: parseFloat(budget),
    };

    parent.postMessage({ action: "updateConfig", data: formData }, "*");
    updateFormOwnedQuantities(result);
  }
}

function updateFormOwnedQuantities(data) {
  const formElements = document.querySelectorAll("#assets-form .asset-row");
  formElements.forEach((element) => {
    const nameInput = element.querySelector("input[type='text']");
    const quantityOwnedInput = element.querySelector(
      "input[name^='quantityOwned']"
    );

    if (nameInput && quantityOwnedInput) {
      const assetKey = nameInput.value;
      const correspondingData = data[assetKey];

      if (
        correspondingData &&
        correspondingData.hasOwnProperty("newQuantity")
      ) {
        quantityOwnedInput.value = correspondingData.newQuantity;
      } else {
        console.error(
          "No matching data found for asset:",
          assetKey,
          "or 'newQuantity' property is missing"
        );
      }
    }
  });
}

// CHART DRAWING -------------------------------------------------

let myChart = null;

/**
 * Processes data for chart visualization. It extracts asset names, old quantities, and new
 * quantities from the provided data object, organizing them into separate arrays. These arrays
 * are then used to populate labels and data points in a chart.
 *
 * The function iterates over each property in the data object, assuming each property represents
 * an asset with 'assetName', 'oldQuantity', and 'newQuantity' attributes.
 *
 * @param {Object} data - An object containing assets information. Each property of this object
 *                        should be an object with 'assetName', 'oldQuantity', and 'newQuantity' properties.
 * @returns {{labels: string[], oldQuantities: number[], newQuantities: number[]}} An object containing
 *          arrays of labels, old quantities, and new quantities, suitable for chart data structure.
 */
function prepareDataForChart(data) {
  let labels = [];
  let oldQuantities = [];
  let quantitiesTobuy = [];
  let nbsToBuy = [];
  let targets = [];

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

/**
 * Creates and displays a bar chart using Chart.js. The chart visualizes the data provided
 * through arrays of labels, old quantities, and new quantities. It constructs two datasets
 * for the chart: one representing the current volume (old quantities) and the other representing
 * the next buy (new quantities).
 *
 * This function assumes that a canvas element with the ID 'stackedChartID' exists in the DOM.
 * It also assumes the existence of a global variable 'myChart' to keep track of the Chart.js
 * instance, destroying the existing chart if it's already present before creating a new one.
 *
 * @param {string[]} labels - An array of labels for the chart, typically asset names.
 * @param {number[]} oldQuantities - An array of numbers representing the old quantities
 *                                   for each label.
 * @param {number[]} newQuantities - An array of numbers representing the new quantities
 *                                   for each label.
 */
function display(labels, oldQuantities, newQuantities, nbsToBuy, targets) {
  var canvas = document.getElementById("stackedChartID");
  var context = document.getElementById("stackedChartID").getContext("2d");

  // Check if a chart instance exists and destroy it if it does
  if (window.myChart) {
    window.myChart.destroy();
  }

  var barHeight = 50;
  canvas.height = labels.length * barHeight;

  const OldQColor = "rgba(67, 125, 179, 1)";
  const newQColor = "rgba(84, 150, 150, 0.7)";

  // Bar chart datasets
  const barDatasets = [
    {
      label: "Current Volume",
      backgroundColor: OldQColor,
      data: oldQuantities,
      order: 2,
    },
    {
      label: "Next Buy",
      backgroundColor: newQColor,
      data: newQuantities,
      order: 2,
    },
  ];

  // Create a new chart instance
  window.myChart = new Chart(context, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [...barDatasets],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "New Target Allocation",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";

              if (label === "Next Buy") {
                label += `: ${context.raw} (Quantity to buy: ${
                  nbsToBuy[context.dataIndex]
                })`;
              } else {
                label += `: ${context.raw}`;
              }

              return label;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

/**
 * Makes the 'resultTitle' element visible on the webpage.
 * Assumes the element is initially hidden and present in the DOM.
 * Can include additional code for result computation and display.
 */
function showResultTitle() {
  document.getElementById("resultTitle").style.display = "block";
}

/**
 * Shows the 'update configuration' button on the page.
 * This function selects the button element with the ID 'update-config-button'
 * and sets its display style to 'block', making it visible on the page.
 */
function showUpdateButton() {
  document.getElementById("update-config-button").style.display = "block";
}

/**
 * Hides the 'update configuration' button on the page.
 * This function selects the button element with the ID 'update-config-button'
 * and sets its display style to 'none', making it invisible on the page.
 */
function hideUpdateButton() {
  document.getElementById("update-config-button").style.display = "none";
}
