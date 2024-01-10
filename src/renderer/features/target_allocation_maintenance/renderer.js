let assetId = 0;

parent.postMessage({ action: "requestData" }, "*");

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

function removeAsset(button) {
  button.parentElement.remove();
}

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

function display(labels, oldQuantities, newQuantities) {
  var context = document.getElementById("stackedChartID").getContext("2d");

  // Check if a chart instance exists and destroy it if it does
  if (myChart) {
    myChart.destroy();
  }

  // Create a new chart instance
  myChart = new Chart(context, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Current Volume",
          backgroundColor: "blue",
          data: oldQuantities,
        },
        {
          label: "Next Buy",
          backgroundColor: "rgba(255, 222, 0, 0.2)",
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

function showResultTtile() {
  // Function to display the result title
  document.getElementById("resultTitle").style.display = "block";

  // Additional code to compute and display results
}
