import React, { useEffect } from "react";
import { useIpcRenderer } from "./api/electron";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TargetAllocationMaintenance } from "./pages/TargetAllocationMaintenance";
import { TamFormData, parseTamFormData } from "./utils";
import { Layout } from "./components";
import { OtherFeature } from "./pages/OtherFeature";
import { NotFoundComponent } from "./pages/NotFound";

const App = () => {
  const [data, setData] = React.useState<TamFormData>({} as TamFormData);
  const { sendRequestData, onResponseData } = useIpcRenderer();

  useEffect(() => {
    const handleResponse = (event, responseData) => {
      if (event.error) {
        console.error(event.error);
      } else {
        setData(parseTamFormData(responseData));
      }
    };

    onResponseData(handleResponse);
    sendRequestData();
  }, []);

  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TargetAllocationMaintenance Data={data} />} />
            <Route path="/tam" element={<TargetAllocationMaintenance Data={data} />} />
            <Route path="/other-feature" element={< OtherFeature />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
