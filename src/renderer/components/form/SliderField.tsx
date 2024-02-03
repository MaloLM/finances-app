import { Field } from 'formik';
import React from 'react';
import { NumberField } from './NumberField';

interface SliderFieldProps {
  name?: string;
  withLabel?: boolean;
  tooltip?: string;
  min?: number;
  max?: number;
  className?: string;
}

const SliderField = (props: SliderFieldProps) => {
  return (
    <Field name={props.name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors },
        meta,
      }) => (
        <div className={'flex w-full items-center ' + props.className}>
          <div className={"relative w-3/4 " + (props.withLabel ? "mb-6" : "")}>
            <input title={props.tooltip}  {...field} type="range" min={props.min || 0} max={props.max || 100} className="w-full h-2  rounded-lg cursor-pointer accent-nobleGold" />
          </div>
          <NumberField tooltip={props.tooltip} name={props.name} className='text-center max-w-9 ' currency='%' />
        </div>
      )}
    </Field>
  );
};

export default SliderField;