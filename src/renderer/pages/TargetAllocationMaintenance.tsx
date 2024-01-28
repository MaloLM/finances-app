import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/TargetAllocationMaintenance.css";
import { ChartData, parseToTamResponse, convertToChartData, TamFormData, TAMFormResponse } from "../utils";
import { useIpcRenderer } from "../api/electron";
import { Card, Loading, TAMChart, TAMForm } from "../components";
import { Button } from "../components/Button";

export const TargetAllocationMaintenance = (props: { Data: TamFormData }) => {
    const [resultIsDisplayed, setResultIsDisplayed] = useState<boolean>(false);
    const [chartData, setChartData] = useState<ChartData>({} as ChartData);
    const [configIsUpdated, setConfigIsUpdated] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [save, setSave] = useState<boolean>(false);
    const [newAssetValues, setNewAssetValues] = useState<TAMFormResponse>({} as TAMFormResponse);
    const { sendWriteData, onWriteResponse, saveFormData } = useIpcRenderer();

    useEffect(() => {
        if (props.Data && props.Data.assets && props.Data.budget && props.Data.currency) {
            setIsloading(false);
        }
    }, [props.Data]);

    const saveConfig = (values) => {
        const { assets, budget, currency } = values;
        const formData = {
            assets: assets,
            currency: currency,
            budget: parseFloat(budget),
        };
        saveFormData(formData);
    }

    const handleResponse = (event, responseData) => {
        if (event.error) {
            console.error(event.error);
        } else {
            let result = parseToTamResponse(responseData.message);
            setNewAssetValues(result);
            setChartData(convertToChartData(result));
            setResultIsDisplayed(true);
        }
    };


    return (
        <div className="flex flex-col gap-2 p-5 h-full">
            {isLoading ? <Loading /> :
                <>
                    <div>
                        <Button onClick={() => setSave(false)}>Save</Button>
                        <TAMForm
                            assets={props.Data.assets}
                            budget={props.Data.budget}
                            currency={props.Data.currency}
                            onSubmit={(formData) => {
                                sendWriteData(formData);
                                onWriteResponse(handleResponse);
                            }}
                            result={newAssetValues}
                            configIsUpdated={configIsUpdated}
                            setConfigIsUpdated={setConfigIsUpdated}
                            saveConfig={saveConfig}
                            save={save}
                            setSave={setSave}
                        />
                    </div>
                    {resultIsDisplayed &&
                        <div>
                            <div>
                                <h1 className="hidden*£" id="resultTitle" >Result</h1>
                                <button className="px-2 bg-orange-400" onClick={() => setConfigIsUpdated(true)}> Update Config</button>
                            </div>
                            <div id="chart-container" className="min-h-12 p-2 border-solid border-cyan-200">
                                <TAMChart chartData={chartData} />
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    );
}