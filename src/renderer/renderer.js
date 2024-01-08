function toggleMenu() {
    var menu = document.getElementById("menuDropdown");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

function loadFeature(featurePath, featureName) {
    document.getElementById('feature-iframe').src = featurePath;
    document.getElementById('feature-title').textContent = featureName;
    document.getElementById('menuDropdown').style.display = 'none';
}
