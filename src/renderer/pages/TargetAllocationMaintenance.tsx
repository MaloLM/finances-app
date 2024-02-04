import React, { useEffect } from "react";
import { useState } from "react";
import { ChartData, parseToTamResponse, convertToChartData, TamFormData, TAMFormResponse } from "../utils";
import { useIpcRenderer } from "../api/electron";
import { Loading, TAMForm } from "../components";
import toast from 'react-hot-toast';

export const TargetAllocationMaintenance = (props: { Data: TamFormData }) => {
    const [chartData, setChartData] = useState<ChartData>({} as ChartData);
    const [isLoading, setIsloading] = useState<boolean>(true);
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
        toast.success("Configuration saved");
    }

    const UpdateChart = () => {
        const newData: ChartData = { ...chartData };
        newData.datasets = newData.datasets.map(dataset => {
            if (dataset.label === 'Current Volume') {
                let targetData = chartData.datasets.find(d => d.label === 'Next Buy')?.data || [];
                let currentData = dataset.data.map((d, i) => d + targetData[i]);
                return {
                    ...dataset,
                    data: currentData,
                };
            } else if (dataset.label === 'Next Buy') {
                return {
                    ...dataset,
                    data: dataset.data.map(d => 0),
                };
            }
            return dataset;
        });
        setChartData(newData);
    }

    const handleResponse = (event, responseData) => {
        if (event.error) {
            toast.error(event.error);
        } else {
            let result = parseToTamResponse(responseData.message);
            setNewAssetValues(result);
            setChartData(convertToChartData(result));
        }
    };


    return (
        <div className="flex flex-col gap-2 p-5 h-full">
            {isLoading ? <Loading /> :
                <TAMForm
                    assets={props.Data.assets}
                    budget={props.Data.budget}
                    currency={props.Data.currency}
                    onSubmit={(formData) => {
                        sendWriteData(formData);
                        onWriteResponse(handleResponse);
                    }}
                    result={newAssetValues}
                    updateChart={UpdateChart}
                    saveConfig={saveConfig}
                    chartData={chartData}
                />
            }
        </div>
    );
}