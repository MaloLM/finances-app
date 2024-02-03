import React from "react";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import SliderField from "./SliderField";
import { X } from "lucide-react";

interface AssetFormProps {
    assetIndex?: number;
    onDelete?: () => void;
    error?: boolean;
    currency?: string;
    className?: string;
}

export const AssetForm = (props: AssetFormProps) => {
    return (
        <div className={`flex items-center justify-between rounded-xl border  py-2 pb-2 pl-2 relative  pr-8 transition-transform   ${props.error ? "border-error border-opacity-80 hover:border-opacity-100 " : "border-softWhite  border-opacity-30 hover:border-opacity-50"} ${props.className}`}>
            <NumberField className="mx-2 font-bold " name={`assets[${props.assetIndex}].quantityOwned`} tooltip="Quantity Owned" />
            <div className="flex flex-col w-full">
                <div className="flex ">
                    <TextField name={`assets[${props.assetIndex}].assetName`} tooltip="Asset Name" />
                    <NumberField name={`assets[${props.assetIndex}].unitPrice`} tooltip="Unit Price" currency={props.currency} />
                </div>
                <div className="flex">
                    <SliderField max={100} min={0} tooltip="Target %" name={`assets[${props.assetIndex}].targetPercent`} />
                </div>
            </div>

            <button className="absolute opacity-30 hover:opacity-100 right-1 top-0 border-0 hover:bg-error m-1 p-0.5" type="button" onClick={props.onDelete}>
                <X className="text-white" size={"20"} />
            </button>
        </div>
    );
}