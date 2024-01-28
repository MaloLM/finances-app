import { ErrorMessage, Field } from 'formik';
import React, { useState } from 'react';

interface SliderFieldProps {
  name?: string;
  withLabel?: boolean;
  className?: string;
}

const SliderField = (props: SliderFieldProps) => {
  return (
    <Field name={props.name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <div className={'flex w-full ' + props.className}>
          <div className={"relative w-3/4 " + (props.withLabel ? "mb-6" : "")}>
            <input {...field} type="range" min="0" max="100" className="w-full h-2  rounded-lg cursor-pointer accent-nobleGold" />
            {props.withLabel &&
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-3">0%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-3">25%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-3">75%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-3">100%</span>
              </div>
            }
          </div>
          <div className='flex justify-center items-center w-1/4'>{field.value}%</div>
          {meta.touched && meta.error && (
            <ErrorMessage name={props.name || "field"} component="div" className="text-red-700" />
          )}
        </div>
      )}
    </Field>
  );
};

export default SliderField;