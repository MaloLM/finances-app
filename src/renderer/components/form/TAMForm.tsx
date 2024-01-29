import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Asset, TAMFormResponse, TAMFormSchema, ChartData } from "../../utils";
import { NumberField } from "./NumberField";
import { AssetForm } from "./AssetForm";
import { Card } from "../Card";
import { SelectorField } from "./SelectorField";
import { Button } from "../Button";
import { DonutChart } from "../charts/DonutChart";
import { TAMChart } from "../charts/TAMChart";

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
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
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
                        <Card title="Current Allocation">
                            <div className="flex flex-col gap-3 relative">
                                <div className="flex flex-col-reverse gap-3 md:flex-row">
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col gap-3 w-full h-96 overflow-y-auto pr-4">
                                            {values.assets.map((asset, index) => (
                                                <AssetForm key={index} assetIndex={index} onDelete={() => {
                                                    const newAssets = values.assets.filter((_, idx) => idx !== index);
                                                    setFieldValue('assets', newAssets);
                                                }} />
                                            ))}
                                        </div>
                                        <Button className="mt-3 mr-4" onClick={() => setFieldValue('assets', [...values.assets, { assetName: "", unitPrice: 0, quantityOwned: 0, targetPercent: 0 }])}>
                                            Add Asset
                                        </Button>
                                    </div>
                                    <div className="flex w-full items-center justify-center">
                                        <DonutChart assets={values.assets} />
                                    </div>
                                </div>
                                <Button className=" absolute top-0 right-0 " onClick={() => setSave(false)}>Save</Button>
                            </div>
                        </Card>
                        <Card title="Next Buy Estimation">
                            <div className="flex items-center ">
                                <p className="text-softWhite">Budget</p>
                                <NumberField className=" text-xl  max-w-28 text-center " name="budget" placeholder="Enter budget" />
                                <SelectorField name="currency"
                                    options={["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNH", "SEK", "NZD"]}
                                />
                                <Button className="ml-3 bg-lightNobleBlack" type="submit" disabled={isSubmitting}>Compute</Button>
                                {props.result.assets &&
                                    <Button className="ml-3 bg-lightNobleBlack text-sm md:text-base" onClick={() => props.setConfigIsUpdated(true)}>Update Config</Button>
                                }
                            </div>
                            {props.result.assets &&
                                <div className="w-full">
                                    <TAMChart chartData={props.chartData} />
                                </div>
                            }
                        </Card>
                    </Form>
                )
            }}
        </Formik>
    )
}