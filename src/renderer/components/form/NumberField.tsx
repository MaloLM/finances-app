import { ErrorMessage, Field } from "formik";
import React, { useEffect } from "react";

interface NumberFieldProps {
    name?: string;
    tooltip?: string;
    className?: string;
    currency?: string;
    displayError?: boolean;
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
                <div className={`flex flex-col`}>
                    {props.inputElement ? <props.inputElement {...field} /> :
                        <>
                            <div className="flex items-center">
                                <input type="number"  {...field}
                                    title={props.tooltip}
                                    className={`max-w-14 p-1 rounded-none text-softWhite text-center
                                 border-b   bg-lightNobleBlack 
                                focus:outline-none focus:ring-0
                                border-0
                                hover:brightness-125 hover:border-nobleGold
                                relative 
                                ${meta.touched && meta.error ? " border-error " : " border-lightNobleBlack "}` + props.className} >
                                </input>
                                {props.currency &&
                                    <span className={` opacity-50 flex items-center text-softWhite`}>{props.currency}</span>
                                }
                            </div>
                            {props.displayError && meta.touched && meta.error && (
                                <ErrorMessage name={props.name || "field"} component="div" className="text-error text-xs" />
                            )}
                        </>
                    }
                </div>
            )}
        </Field>
    );
}