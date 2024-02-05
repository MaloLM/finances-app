import { Form, Formik } from "formik";
import React from "react";
import { Asset, TAMFormResponse, TAMFormSchema, ChartData } from "../utils";
import { NumberField } from "./form/NumberField";
import { AssetForm } from "./AssetForm";
import { Card } from "./Card";
import { SelectorField } from "./form/SelectorField";
import { Button } from "./Button";
import { TAMChart, DonutChart } from "./charts";
import { AlertCircle, Plus, RotateCcw, Save, X } from "lucide-react";
import { chartDataMock, CURRENCIES } from "../utils/constants";
import toast from "react-hot-toast";
import { HelpButton } from "./HelpButton";

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
    const MAX_ASSETS = 30;
    const formRef = React.useRef<HTMLDivElement>(null);
    const lastAssetRef = React.useRef<HTMLDivElement>(null);

    const scrollUp = () => {
        if (!formRef.current) return
        formRef.current.scrollIntoView({
            block: "start",
        });
    }

    const updateFormValues = (setFieldValue) => {
        props.result.assets.forEach((asset, index) => {
            setFieldValue(`assets[${index}].quantityOwned`, asset.newQuantity);
        });
    };

    const processErrors = (assetErrors) => {
        if (typeof assetErrors === 'string') {
            return [assetErrors];
        }

        const errorMessagesSet = new Set<string>();
        assetErrors.forEach((asset) => {
            asset && Object.values(asset).forEach((errorMessage) => {
                if (errorMessage && typeof errorMessage == 'string')
                    errorMessagesSet.add(errorMessage);
            });
        });

        return Array.from(errorMessagesSet);
    };

    const ErrorMessages = ({ errorMessages }) => {
        return (
            <div className="flex border border-error bg-transparent rounded-lg p-3 text-error ">
                <AlertCircle className="mr-2" />
                <div className="flex flex-col">
                    {errorMessages.map((message, index) => (
                        <p key={index} className="text-error">{message}</p>
                    ))}
                </div>
            </div>
        );
    }

    const AddAsset = (setFieldValue, values) => {
        if (values.assets.length >= MAX_ASSETS) {
            toast.error("Maximum number of assets reached");
            return;
        };
        setFieldValue('assets', [...values.assets, { assetName: "Asset Name", unitPrice: 1, quantityOwned: 0, targetPercent: 0 }])        
        toast.success("New asset created");
        // sleep for 100ms to wait for the new asset to be rendered
        setTimeout(() => {
            if (!lastAssetRef.current) return
            lastAssetRef.current.scrollIntoView({
                block: "nearest",
                behavior: "auto"
            });
        }, 100);

    }

    return (
        <Formik
            initialValues={{ assets: props.assets, budget: props.budget, currency: props.currency }}
            validationSchema={TAMFormSchema}
            onSubmit={(values) => {
                const formData = {
                    assets: values.assets,
                    currency: values.currency,
                    budget: values.budget
                };
                props.onSubmit(formData);
            }}
        >
            {({ values, errors, handleSubmit, isSubmitting, setFieldValue, isValidating, isValid }) => {
                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Card className=" relative " title="Current Allocation" titleButton={
                            <Button onClick={() => props.saveConfig(values)}> <Save size={20} /></Button>
                        }>
                            <div ref={formRef} className="flex flex-col gap-3">
                                <div className={`flex flex-col-reverse gap-3 md:flex-row ${errors.assets ? "pb-20    " : ""}  md:pb-0 min-h-110`}>
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col gap-1 w-full md:min-h-24  max-h-110 overflow-y-scroll pr-4 py-1">
                                            {values.assets.map((asset, index) => (
                                                <div ref={index === values.assets.length - 1 ? lastAssetRef : null} key={index}>
                                                    <AssetForm currency={CURRENCIES.get(values.currency)} key={index} assetIndex={index} error={(errors.assets && errors.assets[index]) !== undefined && typeof (errors.assets && errors.assets[index]) !== "string"} onDelete={() => {
                                                        const newAssets = values.assets.filter((_, idx) => idx !== index);
                                                        setFieldValue('assets', newAssets);
                                                    }} />
                                                </div>
                                            ))}
                                            {values.assets.length === 0 &&
                                                <div className="flex justify-center items-center h-20">
                                                    <p className="text-softWhite">No assets added</p>
                                                </div>
                                            }
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <Button filled className="flex items-center pr-4 w-fit rounded-full" onClick={() => AddAsset(setFieldValue, values)}>
                                                <Plus size={20} />Asset
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start justify-center">
                                        <DonutChart assets={values.assets} />
                                    </div>
                                    {errors.assets &&
                                        <div className="flex justify-center absolute bottom-3 right-0 left-0 md:bottom-24 md:left-1/2 md:mr-8 ">
                                            <ErrorMessages errorMessages={processErrors(errors.assets)} />
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
                                        <Button className="ml-3 bg-lightNobleBlack py-1 text-sm md:text-base" onClick={() => { props.updateChart(); updateFormValues(setFieldValue); toast.success("Configuration updated!") }}>Update Config</Button>
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
                                        <Button filled onClick={() => { if (!isValid) scrollUp() }} className={` bg-lightNobleBlack w-1/4 h-20 text-2xl ${errors.assets ? "bg-error" : ""} `} type="submit" disabled={isSubmitting}>Compute</Button>
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