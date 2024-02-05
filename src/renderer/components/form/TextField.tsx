import { ErrorMessage, Field } from "formik";
import React, { useEffect } from "react";

interface TextFieldProps {
    children?: React.ReactNode;
    name?: string;
    tooltip?: string;
    displayError?: boolean;
    className?: string;
}

export const TextField = (props: TextFieldProps) => {
    return (
        <Field name={props.name}>
            {({
                field, // { name, value, onChange, onBlur }
                form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                meta,
            }) => (
                <div className="flex flex-col">
                    <input className={`rounded-none border-0 border-b hover:brightness-125 
                     hover:border-nobleGold 
                    focus:outline-none focus:ring-0
                    text-softWhite p-1 bg-transparent
                    ${meta.touched && meta.error ? " border-error " : " border-transparent "} 
                    ${props.className}`}
                        type="text" title={props.tooltip}  {...field}
                    />
                    {props.displayError && meta.touched && meta.error && (
                        <ErrorMessage name={props.name || "field"} component="div" className="text-error text-xs" />
                    )}
                </div>
            )}
        </Field>
    );
}