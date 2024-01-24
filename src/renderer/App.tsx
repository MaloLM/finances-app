import React, { useEffect } from "react";
import { useIpcRenderer } from "./api/electron";
import "./styles/App.css";
import { TargetAllocationMaintenance } from "./pages/TargetAllocationMaintenance";
import { TamFormData, parseTamFormData } from "./utils";
import { Sidebar } from "./components";

const App = () => {
  const [data, setData] = React.useState<TamFormData>({} as TamFormData);
  const [dataRetreived, setDataRetreived] = React.useState<boolean>(false);
  const { sendRequestData, onResponseData } = useIpcRenderer();

  useEffect(() => {
    const handleResponse = (event, responseData) => {
      if (event.error) {
        console.error(event.error);
      } else {
        setData(parseTamFormData(responseData));
      }
      setDataRetreived(true);
    };

    onResponseData(handleResponse);
    sendRequestData();
  }, []);

  // TODO: Layout 
  // TODO: add routage
  // TODO: context ? 

  return (
    <div className="App">
      <Sidebar />
      {/* {dataRetreived &&
        <TargetAllocationMaintenance Data={data} />
      } */}
    </div>
  );
};

export default App;
