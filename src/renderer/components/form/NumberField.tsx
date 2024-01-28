import { ErrorMessage, Field } from "formik";
import React from "react";

interface NumberFieldProps {
    name?: string;
    placeholder?: string;
    className?: string;
    inputElement?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
}

export const NumberField = (props: NumberFieldProps) => {
    return (
        <Field name={props.name}>
            {({
                field, // { name, value, onChange, onBlur }
                form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                meta,
            }) => (
                <div>
                    {props.inputElement ? <props.inputElement placeholder={props.placeholder} {...field} /> :
                        <>
                            <input type="number" placeholder={props.placeholder} {...field}
                                className={"max-w-24  hover:brightness-125 rounded-none border-0 border-b border-lightNobleBlack hover:border-nobleGold text-softWhite p-1 bg-lightNobleBlack " + props.className} />
                            {meta.touched && meta.error && (
                                <ErrorMessage name={props.name || "field"} component="div" className="text-red-700" />
                            )}
                        </>
                    }
                </div>
            )}
        </Field>
    );
}