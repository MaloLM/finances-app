import { ErrorMessage, Field } from "formik";
import React from "react";

interface NumberFieldProps {
    name?: string;
    placeholder?: string;
    className?: string;
    currency?: string;
    InMiddle?: boolean;
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
                <div className={`relative ${props.currency ? " pr-8 " : ""} `}>
                    {props.inputElement ? <props.inputElement placeholder={props.placeholder} {...field} /> :
                        <>
                            <input type="number" placeholder={props.placeholder} {...field}
                                className={`max-w-11 p-1 rounded-none text-softWhite
                                border-0 border-b border-lightNobleBlack  bg-lightNobleBlack 
                                hover:brightness-125 hover:border-nobleGold
                                relative 
                                ${props.InMiddle ? "text-center" : ""}
                                ${meta.touched && meta.error ? " border-red-700 " : " "}` + props.className} >
                            </input>
                            {props.currency &&
                                <span className={`absolute bg-lightNobleBlack opacity-50 right-5 flex items-center text-softWhite ${meta.touched && meta.error ? "top-1" : "top-1"}`}>{props.currency}</span>
                            }
                            {meta.touched && meta.error && (
                                <ErrorMessage name={props.name || "field"} component="div" className="text-red-700 text-xs" />
                            )}
                        </>
                    }
                </div>
            )}
        </Field>
    );
}