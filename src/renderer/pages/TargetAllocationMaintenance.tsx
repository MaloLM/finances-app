import React, { useEffect } from "react";
import Chart from 'chart.js/auto';
import { useState } from "react";
import "../styles/TargetAllocationMaintenance.css";
import { Asset, ChartData, prepareDataForTAMChart, TamFormData, TAMFormSchema } from "../utils";
import { useIpcRenderer } from "../api/electron";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { TAMChart } from "../components";

// TODO: add update config feature
export const TargetAllocationMaintenance = (props: { Data: TamFormData }) => {
    const [data, setData] = useState<TamFormData>(props.Data || {} as TamFormData);
    const [assets, setAssets] = useState<Asset[]>(props.Data.assets || [] as Asset[]);
    const [resultIsDisplayed, setResultIsDisplayed] = useState<boolean>(false);
    const [chartData, setChartData] = useState<ChartData>({} as ChartData);
    const { sendWriteData, onWriteResponse } = useIpcRenderer();

    useEffect(() => {
        setData(props.Data);
        setAssets(props.Data.assets);
    }, [props.Data]);
    const handleResponse = (event, responseData) => {
        if (event.error) {
            console.error(event.error);
        } else {
            let { labels, oldQuantities, quantitiesTobuy, nbsToBuy, targets } =
                prepareDataForTAMChart(responseData.message);

            const data = {
                labels: labels,
                nbsToBuy: nbsToBuy,
                targets: targets,
                datasets: [
                    {
                        label: 'Current Volume',
                        data: oldQuantities,
                        backgroundColor: 'rgba(67, 125, 179, 1)',
                        order: 2,
                    },
                    {
                        label: 'Next Buy',
                        data: quantitiesTobuy,
                        backgroundColor: 'rgba(84, 150, 150, 0.7)',
                        order: 2,
                    },
                ]
            };

            setChartData(data);
            setResultIsDisplayed(true);
        }
    };

    const updateConfig = () => {

    }

    return (
        <div>
            {
                props.Data != undefined &&
                <Formik
                    initialValues={{ assets: assets, budget: props.Data.budget, currency: props.Data.currency }}
                    validationSchema={TAMFormSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const formData = {
                            assets: values.assets,
                            currency: values.currency,
                            budget: values.budget
                        };
                        sendWriteData(formData);
                        onWriteResponse(handleResponse);
                        setSubmitting(false);
                    }}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>
                            <h1>Current Allocation</h1>
                            {values.assets.map((asset, index) => (
                                <div key={index} className="asset-row">
                                    <Field type="text" name={`assets[${index}].assetName`} placeholder="Asset Name" />
                                    <ErrorMessage name={`assets[${index}].assetName`} component="div" className="error" />

                                    <Field type="number" name={`assets[${index}].unitPrice`} placeholder="Unit Price" />
                                    <ErrorMessage name={`assets[${index}].unitPrice`} component="div" className="error" />

                                    <Field type="number" name={`assets[${index}].quantityOwned`} placeholder="Quantity Owned" />
                                    <ErrorMessage name={`assets[${index}].quantityOwned`} component="div" className="error" />

                                    <Field type="number" name={`assets[${index}].targetPercent`} placeholder="Target %" />
                                    <ErrorMessage name={`assets[${index}].targetPercent`} component="div" className="error" />

                                    <button type="button" onClick={() => {
                                        const newAssets = values.assets.filter((_, idx) => idx !== index);
                                        setFieldValue('assets', newAssets);
                                    }}>
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={() => setFieldValue('assets', [...values.assets, { assetName: "", unitPrice: 0, quantityOwned: 0, targetPercent: 0 }])}>
                                Add Asset
                            </button>

                            <h1>Next Buy Budget</h1>
                            <Field type="number" name="budget" placeholder="Enter budget" />
                            <ErrorMessage name="budget" component="div" className="error" />

                            <Field as="select" name="currency">
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="JPY">JPY</option>
                                <option value="GBP">GBP</option>
                                <option value="AUD">AUD</option>
                                <option value="CAD">CAD</option>
                                <option value="CHF">CHF</option>
                                <option value="CNH">CNH</option>
                                <option value="SEK">SEK</option>
                                <option value="NZD">NZD</option>
                            </Field>
                            <ErrorMessage name="currency" component="div" className="error" />

                            <button type="submit" disabled={isSubmitting}>Compute</button>
                        </Form>
                    )}
                </Formik>
            }

            {resultIsDisplayed &&
                <div>
                    <h1 className="hidden" id="resultTitle" >Result</h1>
                    <button className="px-2 bg-orange-400" onClick={updateConfig}> Update Config</button>
                    <div id="chart-container" className="min-h-12 p-2 border-solid border-cyan-200">
                        <TAMChart chartData={chartData}/>
                    </div>
                </div>
            }
        </div>
    );
}


// function updateFormOwnedQuantities(data) {
//     assets.forEach((element) => {
//         const name = element.assetName
//         const quantityOwned = element.quantityOwned

//         if (name && quantityOwned) {
//             const assetKey = name;
//             const correspondingData = data[assetKey];

//             if (
//                 correspondingData &&
//                 correspondingData.hasOwnProperty("newQuantity")
//             ) {
//                 quantityOwned.value = correspondingData.newQuantity;
//             } else {
//                 console.error(
//                     "No matching data found for asset:",
//                     assetKey,
//                     "or 'newQuantity' property is missing"
//                 );
//             }
//         }
//     });
// }

// function update_config() {
//     if (data) {
//         const budget = (document.getElementById("budget") as HTMLInputElement).value;
//         const currency = (document.getElementById("currency") as HTMLInputElement).value;

//         // Convert the assets object into an array of its values
//         const assetsArray = Object.values(assets);

//         // Convert the result object into an array of its values
//         const resultArray = Object.values(result);

//         // Process each asset in the array
//         assetsArray.forEach((asset: any) => {
//             if (asset.hasOwnProperty("quantityOwned")) {
//                 // Use the resultArray for finding the corresponding result
//                 const correspondingResult = resultArray.find(
//                     (r: any) => r.assetName === asset.assetName
//                 );

//                 if (correspondingResult) {
//                     // asset.quantityOwned = correspondingResult.newQuantity;
//                 }
//             }
//         });

//         // Convert the assets array back to an object if necessary
//         const updatedAssetsObject = {};
//         assetsArray.forEach((asset) => {
//             updatedAssetsObject[asset.assetName || ""] = asset;
//         });

//         const formData = {
//             assets: updatedAssetsObject,
//             currency: currency,
//             budget: parseFloat(budget),
//         };

//         parent.postMessage({ action: "updateConfig", data: formData }, "*");
//         updateFormOwnedQuantities(result);
//     }
// }