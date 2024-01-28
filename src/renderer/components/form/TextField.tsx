import { ErrorMessage, Field } from "formik";
import React from "react";

interface TextFieldProps {
    children?: React.ReactNode;
    name?: string;
    placeholder?: string;
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
                    <input className=" rounded-none border-0 border-b hover:brightness-125 border-lightNobleBlack hover:border-nobleGold text-softWhite p-1 bg-lightNobleBlack" type="text" placeholder={props.placeholder} {...field} />
                    {meta.touched && meta.error && (
                        <ErrorMessage name={props.name || "field"} component="div" className="text-red-700" />
                    )}
                </div>
            )}
        </Field>
    );
}