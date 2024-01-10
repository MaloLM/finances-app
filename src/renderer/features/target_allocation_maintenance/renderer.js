let assetId = 0;

parent.postMessage({ action: "requestData" }, "*");

window.addEventListener("message", (event) => {
  if (event.data.action === "responseData") {
    const data = event.data.data;

    if (
      Array.isArray(data.assets) &&
      data.assets.length > 0 &&
      data.assets.every(
        (item) =>
          item.hasOwnProperty("assetName") &&
          item.hasOwnProperty("unitPrice") &&
          item.hasOwnProperty("quantityOwned") &&
          item.hasOwnProperty("targetPercent")
      )
    ) {
      // Les données sont valides, itérez sur chaque élément et ajoutez un asset
      data.assets.forEach((line) => {
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
    console.log("EOIFCJZOIERFJZEFZEF DANS AFFICHAGE");
    console.log(data);
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
  const assets = [];
  const formElements = document.querySelectorAll("#assets-form .asset-row");
  formElements.forEach((element) => {
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
      const asset = {
        assetName: nameInput.value,
        unitPrice: parseFloat(unitPriceInput.value),
        quantityOwned: parseInt(quantityOwnedInput.value, 10),
        targetPercent: parseFloat(targetPercentInput.value),
      };
      assets.push(asset);
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

  console.log(formData);
  parent.postMessage({ action: "sendData", data: formData }, "*");
}

// CHART DRAWING -------------------------------------------------

let myChart = null;

function prepareDataForChart(data) {
  let labels = [];
  let oldQuantities = [];
  let newQuantities = [];
  console.log("incoming data for graph");
  console.log(data);
  for (let key in data) {
    console.log(key);
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
