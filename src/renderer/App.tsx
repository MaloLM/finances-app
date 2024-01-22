import React, { useEffect } from "react";
import { useIpcRenderer } from "./api/electron";
import "./styles/App.css";
import { TargetAllocationMaintenance } from "./pages/TargetAllocationMaintenance";
import { TamFormData, parseTamFormData } from "./utils";

const App = () => {
  const [data, setData] = React.useState<TamFormData>({} as TamFormData);
  const [dataRetreived, setDataRetreived] = React.useState<boolean>(false);
  const { sendRequestData, onResponseData } = useIpcRenderer();

  useEffect(() => {
    // Define the response handler
    const handleResponse = (event, responseData) => {
      if (event.error) {
        console.error(event.error);
      } else {
        setData(parseTamFormData(responseData));
      }
      setDataRetreived(true);
    };
    // Set up the listener for the response
    onResponseData(handleResponse);
    sendRequestData();
  }, []);

  function toggleMenu(): void {
    var menu = document.getElementById("menuDropdown") as HTMLDivElement;
    if (menu.style.display === "none" || menu.style.display === "") {
      menu.style.display = "flex";
    } else {
      menu.style.display = "none";
    }
  }

  return (
    <div className="App">
      <div className="header p-1">
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
        >Target Allocation Maintenance</a>
        <a
          href="#"
        >Another feature</a>
      </div>
      {dataRetreived &&
        <TargetAllocationMaintenance Data={data} />
      }
    </div>
  );
};

export default App;
