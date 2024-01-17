import React from "react";
import { useIpcRenderer } from "./api/electron";
import "./styles/App.css";
import { TargetAllocationMaintenance } from "./pages/TargetAllocationMaintenance";

const App = () => {
    return (
        <div className="App">
            <div className="header">
                <div className="menu-icon" onClick={() => toggleMenu()}>
                    <div className="menu-line"></div>
                    <div className="menu-line"></div>
                    <div className="menu-line"></div>
                </div>
                <span id="feature-title"></span>
            </div>
            <div className="menu-dropdown" id="menuDropdown">
                <a
                    href="#"
                    // onClick={() => loadFeature('target_allocation_maintenance/index.html','Target Allocation Maintenance')}
                >Target Allocation Maintenance</a>
                <a
                    href="#"
                    // onClick={() => loadFeature('feature_2/index.html','Another feature')}
                >Another feature</a>
            </div>
            <TargetAllocationMaintenance />
        </div>
    );
};

const { sendRequestData, sendWriteData, onResponseData, onWriteResponse } = useIpcRenderer();

function toggleMenu(): void {
  var menu = document.getElementById("menuDropdown") as HTMLDivElement;
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

// Define a type for the message event data
// type CustomMessageEventData = {
//   action: string;
//   data?: any;
// };

// Convert 'require' to ES6 import
// window.addEventListener("message", (event: MessageEvent) => {
//   const iframe = document.getElementById("feature-iframe") as HTMLIFrameElement;
//   const eventData = event.data as CustomMessageEventData;

//   if (
//     event.source === iframe.contentWindow &&
//     eventData.action === "requestData"
//   ) {
//     sendRequestData();
//   }
// });

// window.addEventListener("message", (event: MessageEvent) => {
//   const iframe = document.getElementById("feature-iframe") as HTMLIFrameElement;
//   const eventData = event.data as CustomMessageEventData;

//   if (
//     event.source === iframe.contentWindow &&
//     eventData.action === "sendData"
//   ) {
//     sendWriteData(eventData.data);
//   }
// });

// onResponseData( (_event: any, data: any) => {
//   const iframe = document.getElementById("feature-iframe") as HTMLIFrameElement;
//   iframe.contentWindow?.postMessage({ action: "responseData", data: data }, "*");
// });

// onWriteResponse( (_event: any, response: any) => {
//   const iframe = document.getElementById("feature-iframe") as HTMLIFrameElement;
//   iframe.contentWindow?.postMessage(
//     { action: "writeResponse", data: response },
//     "*"
//   );
// });



// function loadFeature(featurePath: string, featureName: string): void {
//   const iframe = document.getElementById("feature-iframe") as HTMLIFrameElement;
//   const featureTitle = document.getElementById("feature-title") as HTMLDivElement;
//   const menuDropdown = document.getElementById("menuDropdown") as HTMLDivElement;

//   iframe.src = featurePath;
//   featureTitle.textContent = featureName;
//   menuDropdown.style.display = "none";
// }

// document.addEventListener("DOMContentLoaded", () => {
//   loadFeature(
//     "target_allocation_maintenance/index.html",
//     "Target Allocation Maintenance"
//   );
// });


// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Renderer script loaded");

//   // Toggle menu
//   const menuIcon = document.getElementById('menuIcon');
//   menuIcon && menuIcon.addEventListener('click', toggleMenu);

//   // Load features
//   const loadFeature1 = document.getElementById('loadFeature1');
//   loadFeature1 &&loadFeature1.addEventListener('click', () => loadFeature('target_allocation_maintenance/index.html', 'Target Allocation Maintenance'));

//   const loadFeature2 = document.getElementById('loadFeature2');
//   loadFeature2 && loadFeature2.addEventListener('click', () => loadFeature('feature_2/index.html', 'Another feature'));

//   // Add more event listeners for other features as needed
// });




export default App;
