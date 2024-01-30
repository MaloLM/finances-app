import React from "react";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import SliderField from "./SliderField";
import { X } from "lucide-react";

interface AssetFormProps {
    assetIndex?: number;
    onDelete?: () => void;
    className?: string;
}

export const AssetForm = (props: AssetFormProps) => {
    return (
        <div className={"flex items-center justify-between rounded-xl border border-softWhite border-opacity-30 py-1 pb-2 pl-2 relative  pr-8 transition-transform duration-100 hover:scale-105 " + props.className}>
            <NumberField  className=" border-b-0 mx-2 font-bold "  name={`assets[${props.assetIndex}].quantityOwned`} placeholder="Quantity Owned" InMiddle />
            <div className="flex flex-col w-full">
                <div className="flex ">
                    <TextField name={`assets[${props.assetIndex}].assetName`} placeholder="Asset Name" />
                    <NumberField name={`assets[${props.assetIndex}].unitPrice`} placeholder="Unit Price" currency="€" />
                </div>
                <div className="flex">
                    <SliderField name={`assets[${props.assetIndex}].targetPercent`} />
                </div>
            </div>
            
            <button className="absolute opacity-30 hover:opacity-100 right-1 top-0 border-0 hover:bg-red-500 m-1 p-0.5" type="button" onClick={props.onDelete}>
                <X className="text-white" size={"20"} />
            </button>
        </div>
    );
}