import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Asset, TAMFormResponse, TAMFormSchema, ChartData } from "../../utils";
import { NumberField } from "./NumberField";
import { AssetForm } from "./AssetForm";
import { Card } from "../Card";
import { SelectorField } from "./SelectorField";
import { Button } from "../Button";
import { DonutChart } from "../charts/DonutChart";
import { TAMChart } from "../charts/TAMChart";
import { BarChart4, Plus, RotateCcw, Save } from "lucide-react";
import { chartDataMock } from "../../utils/constants";
// import chartExample from "../../assets/svg/chart.svg";

interface TAMFormProps {
    assets: Asset[];
    budget: number;
    currency: string;
    onSubmit: (values: any) => void;
    result: TAMFormResponse;
    configIsUpdated: boolean;
    chartData: ChartData;
    setConfigIsUpdated: (configIsUpdated: boolean) => void;
    saveConfig: (values: any) => void;
}

export const TAMForm = (props: TAMFormProps) => {
    const [save, setSave] = useState<boolean>(false);

    const updateFormValues = (setFieldValue) => {
        props.result.assets.forEach((asset, index) => {
            setFieldValue(`assets[${index}].quantityOwned`, asset.newQuantity);
        });
    };

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
            {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (props.configIsUpdated) {
                        updateFormValues(setFieldValue);
                        props.setConfigIsUpdated(false);
                    }
                    if (save) {
                        props.saveConfig(values);
                        setSave(false);
                    }
                }, [props.configIsUpdated, save]);

                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Card className="relative " title="Current Allocation" titleButton={
                            () => (
                                <Button className=" " onClick={() => setSave(false)}><Save size={20} /></Button>
                            )

                        }>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col-reverse gap-3 md:flex-row">
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col gap-1 w-full md:min-h-80  max-h-110 overflow-y-scroll px-4 py-1">
                                            {values.assets.map((asset, index) => (
                                                <AssetForm key={index} assetIndex={index} onDelete={() => {
                                                    const newAssets = values.assets.filter((_, idx) => idx !== index);
                                                    setFieldValue('assets', newAssets);
                                                }} />
                                            ))}
                                        </div>
                                        <div className="flex justify-between p-4">
                                            <Button fill className="flex items-center pr-4 w-fit rounded-full" onClick={() => setFieldValue('assets', [...values.assets, { assetName: "", unitPrice: 0, quantityOwned: 0, targetPercent: 0 }])}>
                                                <Plus size={20} />Asset
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-center">
                                        <DonutChart assets={values.assets} />
                                        {typeof errors.assets === 'string' &&
                                            <ErrorMessage name={"assets"} component="div" className="text-red-700 absolute bottom-3" />
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Next Buy Estimation">
                            <div className="flex items-center ">
                                <p className="text-softWhite">Budget</p>
                                <NumberField className=" text-xl  max-w-28 text-center " name="budget" placeholder="Enter budget" />
                                <SelectorField name="currency"
                                    options={["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNH", "SEK", "NZD"]}
                                />

                                {props.result.assets &&
                                    <>
                                        <Button fill className="ml-3 py-1 bg-lightNobleBlack" type="submit" disabled={isSubmitting}><RotateCcw size={20} strokeWidth={2.5} /></Button>
                                        <Button className="ml-3 bg-lightNobleBlack py-1 text-sm md:text-base" onClick={() => props.setConfigIsUpdated(true)}>Update Config</Button>
                                    </>
                                }
                            </div>
                            {props.result.assets ?
                                <div className="w-full">
                                    <TAMChart chartData={props.chartData} />
                                </div>
                                :
                                <div className="relative">
                                    <div className="blur-xl">
                                        <TAMChart chartData={chartDataMock} />
                                    </div>
                                    <div className="flex items-center justify-center absolute w-full h-full top-0">
                                        <Button fill className=" bg-lightNobleBlack w-1/4 h-20 text-2xl" type="submit" disabled={isSubmitting}>Compute</Button>
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