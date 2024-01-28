import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Asset, TAMFormResponse, TAMFormSchema } from "../../utils";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { AssetForm } from "./AssetForm";
import { Card } from "../Card";
import { SelectorField } from "./SelectorField";
import { Button } from "../Button";

interface TAMFormProps {
    assets: Asset[];
    budget: number;
    currency: string;
    onSubmit: (values: any) => void;
    result: TAMFormResponse;
    configIsUpdated: boolean;
    setConfigIsUpdated: (configIsUpdated: boolean) => void;
    saveConfig: (values: any) => void;
    save: boolean;
    setSave: (save: boolean) => void;
}

export const TAMForm = (props: TAMFormProps) => {
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
                    if (props.save) {
                        props.saveConfig(values);
                        props.setSave(false);
                    }
                }, [props.configIsUpdated, props.save]);

                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Card title="Current Allocation">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                    {values.assets.map((asset, index) => (
                                        <AssetForm assetIndex={index} onDelete={() => {
                                            const newAssets = values.assets.filter((_, idx) => idx !== index);
                                            setFieldValue('assets', newAssets);
                                        }} />
                                    ))}
                                </div>
                                <Button onClick={() => setFieldValue('assets', [...values.assets, { assetName: "", unitPrice: 0, quantityOwned: 0, targetPercent: 0 }])}>
                                    Add Asset
                                </Button>
                            </div>
                        </Card>
                        <Card title="Next Buy Budget">
                            <div className="flex ">
                                <NumberField name="budget" placeholder="Enter budget" />
                                <SelectorField name="currency"
                                    options={["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNH", "SEK", "NZD"]}
                                />
                            </div>
                        </Card>
                        <button className="bg-lightNobleBlack" type="submit" disabled={isSubmitting}>Compute</button>
                    </Form>
                )
            }}
        </Formik>
    )
}