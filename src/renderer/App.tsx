import React, { useEffect } from "react";
import { useIpcRenderer } from "./api/electron";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TargetAllocationMaintenance } from "./pages/TargetAllocationMaintenance";
import { TamFormData, parseTamFormData } from "./utils";
import { CustomToaster, Layout } from "./components";
import { OtherFeature } from "./pages/OtherFeature";
import { NotFoundComponent } from "./pages/NotFound";
import toast from 'react-hot-toast';

const App = () => {
  const [data, setData] = React.useState<TamFormData>({} as TamFormData);
  const { sendRequestData, onResponseData } = useIpcRenderer();

  useEffect(() => {
    const handleResponse = (event, responseData) => {
      if (event.error) {
        console.error(event.error);
        toast.error(event.error);
      } else {
        setData(parseTamFormData(responseData));
      }
    };

    onResponseData(handleResponse);
    sendRequestData();
  }, []);

  return (
    <div className="App flex flex-col font-sans text-softWhite bg-nobleBlack">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TargetAllocationMaintenance Data={data} />} />
            <Route path="/tam" element={<TargetAllocationMaintenance Data={data} />} />
            <Route path="/other-feature" element={< OtherFeature />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
          <CustomToaster />
        </Layout>
      </Router>
    </div>
  );
};

export default App;
