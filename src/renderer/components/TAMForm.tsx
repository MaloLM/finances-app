import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Asset, TAMFormResponse, TAMFormSchema } from "../utils";

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
                    <Form onSubmit={handleSubmit}>
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
                )
            }}
        </Formik>
    )
}