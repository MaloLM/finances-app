import { Field } from "formik";
import React from "react";

interface SelectorFieldProps {
    name?: string;
    className?: string;
    options?: string[];
}

export const SelectorField = (props: SelectorFieldProps) => {
    return (
        <Field name={props.name} as="select" className={"rounded-none border-0 border-b border-lightNobleBlack hover:border-nobleGold text-softWhite p-1 bg-lightNobleBlack " + props.className}>
            {props.options?.map((option, index) =>
                <option key={index}>{option}</option>
            )}
        </Field>
    );
}