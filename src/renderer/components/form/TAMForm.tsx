import { Form, Formik } from "formik";
import React from "react";
import { Asset, TAMFormResponse, TAMFormSchema, ChartData } from "../../utils";
import { NumberField } from "./NumberField";
import { AssetForm } from "./AssetForm";
import { Card } from "../Card";
import { SelectorField } from "./SelectorField";
import { Button } from "../Button";
import { TAMChart, DonutChart } from "../charts";
import { AlertCircle, Plus, RotateCcw, Save } from "lucide-react";
import { chartDataMock, CURRENCIES } from "../../utils/constants";

interface TAMFormProps {
    assets: Asset[];
    budget: number;
    currency: string;
    onSubmit: (values: any) => void;
    result: TAMFormResponse;
    chartData: ChartData;
    updateChart: () => void;
    saveConfig: (values: any) => void;
}

export const TAMForm = (props: TAMFormProps) => {
    const updateFormValues = (setFieldValue) => {
        props.result.assets.forEach((asset, index) => {
            setFieldValue(`assets[${index}].quantityOwned`, asset.newQuantity);
        });
    };

    const errorMessage = (error) => {
        let totalPercentError = typeof error === 'string' ? error : "";
        let unitPriceError, nameError, quantityError, targetPercentError = ""
        if (typeof error === 'object' && error.length > 0) {
            error.forEach((assetError) => {
                if (assetError && assetError.unitPrice) {
                    unitPriceError = assetError.unitPrice;
                }
                if (assetError && assetError.assetName) {
                    nameError = assetError.assetName;
                }
                if (assetError && assetError.quantityOwned) {
                    quantityError = assetError.quantityOwned;
                }
                if (assetError && assetError.targetPercent) {
                    targetPercentError = assetError.targetPercent;
                }
            });
        }
        return (
            <div className="flex flex-col">
                {unitPriceError && <p className="text-error text-xs">{unitPriceError}</p>}
                {nameError && <p className="text-error text-xs">{nameError}</p>}
                {quantityError && <p className="text-error text-xs">{quantityError}</p>}
                {totalPercentError && <p className="text-error text-xs">{totalPercentError}</p>}
                {targetPercentError && <p className="text-error text-xs">{targetPercentError}</p>}
            </div>
        );
    }

    return (
        <Formik
            initialValues={{ assets: props.assets, budget: props.budget, currency: props.currency }}
            validationSchema={TAMFormSchema}
            onSubmit={(values, { setSubmitting }) => {
                const formData = {
                    assets: values.assets,
                    currency: values.currency,
                    budget: values.budget
                };
                props.onSubmit(formData);
                setSubmitting(false);
            }}
        >
            {({ values, errors, handleSubmit, isSubmitting, setFieldValue }) => {
                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Card className=" relative " title="Current Allocation" titleButton={
                            () => (
                                <Button className=" " onClick={() => props.saveConfig(values)}><Save size={20} /></Button>
                            )

                        }>
                            <div className="flex flex-col gap-3 pb-6 md:pb-0">
                                <div className="flex flex-col-reverse gap-3 md:flex-row">
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col gap-1 w-full md:min-h-80  max-h-110 overflow-y-scroll pr-4 py-1">
                                            {values.assets.map((asset, index) => (
                                                <AssetForm currency={CURRENCIES.get(values.currency)} key={index} assetIndex={index} error={(errors.assets && errors.assets[index]) !== undefined && typeof (errors.assets && errors.assets[index]) !== "string"} onDelete={() => {
                                                    const newAssets = values.assets.filter((_, idx) => idx !== index);
                                                    setFieldValue('assets', newAssets);
                                                }} />
                                            ))}
                                            {values.assets.length === 0 &&
                                                <div className="flex justify-center items-center h-20">
                                                    <p className="text-softWhite">No assets added</p>
                                                </div>
                                            }
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <Button filled className="flex items-center pr-4 w-fit rounded-full" onClick={() => setFieldValue('assets', [...values.assets, { assetName: "Asset Name", unitPrice: 1, quantityOwned: 0, targetPercent: 0 }])}>
                                                <Plus size={20} />Asset
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-center relative">
                                        <DonutChart className=" md:mb-40" assets={values.assets} />
                                    </div>
                                    {errors.assets &&
                                        <div className="flex justify-center absolute bottom-3 right-0 left-0 md:bottom-24 md:left-1/2 md:mr-8 ">
                                            <div className="flex items-center border border-error rounded-lg p-3 text-error">
                                                <AlertCircle className="mr-2" />
                                                {errorMessage(errors.assets)}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Card>
                        <Card title="Next Buy Estimation" >
                            <div className="flex items-center">
                                <p className="text-softWhite">Budget</p>
                                <NumberField className=" text-xl  max-w-24 text-center " name="budget" tooltip="Enter budget" displayError />
                                <SelectorField name="currency"
                                    options={Array.from(CURRENCIES.keys())}
                                />

                                {props.result.assets &&
                                    <>
                                        <Button filled className="ml-3 py-1 bg-lightNobleBlack" type="submit" disabled={isSubmitting}><RotateCcw size={20} strokeWidth={2.5} /></Button>
                                        <Button className="ml-3 bg-lightNobleBlack py-1 text-sm md:text-base" onClick={() => { props.updateChart(); updateFormValues(setFieldValue) }}>Update Config</Button>
                                    </>
                                }
                            </div>
                            {props.result.assets ?
                                <div className="w-full  mt-12 ">
                                    <TAMChart chartData={props.chartData} />
                                </div>
                                :
                                <div className="relative ">
                                    <div className="blur-xl">
                                        <TAMChart chartData={chartDataMock} />
                                    </div>
                                    <div className="flex items-center justify-center absolute w-full h-full top-0">
                                        <Button filled className=" bg-lightNobleBlack w-1/4 h-20 text-2xl" type="submit" disabled={isSubmitting}>Compute</Button>
                                    </div>
                                </div>
                            }
                        </Card>
                    </Form>
                )
            }}
        </Formik>
    )
}