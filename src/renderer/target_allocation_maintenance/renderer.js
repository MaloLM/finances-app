let assetId = 0;

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

    let { labels, oldQuantities, newQuantities } = prepareDataForChart(
      data.message
    );
    showResultTtile();
    display(labels, oldQuantities, newQuantities);
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
  let newQuantities = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let line = data[key];
      labels.push(line.assetName);
      oldQuantities.push(line.oldQuantity);
      newQuantities.push(line.newQuantity);
    }
  }
  return { labels, oldQuantities, newQuantities };
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
function display(labels, oldQuantities, newQuantities) {
  var context = document.getElementById("stackedChartID").getContext("2d");

  // Check if a chart instance exists and destroy it if it does
  if (myChart) {
    myChart.destroy();
  }

  const OldQColor = "rgba(67, 125, 179, 1)";
  const newQColor = "rgba(84, 150, 150, 0.7)";

  // Create a new chart instance
  myChart = new Chart(context, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Current Volume",
          backgroundColor: OldQColor,
          data: oldQuantities,
        },
        {
          label: "Next Buy",
          backgroundColor: newQColor,
          data: newQuantities,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "New Target Allocation",
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
 * Displays the result title on the webpage. This function is used to make the element with
 * the ID 'resultTitle' visible on the page. It is typically called to indicate that results
 * (such as chart data or calculation outputs) are available and displayed to the user.
 *
 * The function assumes that an element with the ID 'resultTitle' exists in the DOM and is
 * initially set to not be displayed ('display: none' or similar).
 *
 * Note: This function may also contain additional code to compute and display results,
 * as indicated by the placeholder comment.
 */
function showResultTtile() {
  document.getElementById("resultTitle").style.display = "block";
}
