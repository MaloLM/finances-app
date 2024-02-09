import { Field } from 'formik'
import React from 'react'

interface SelectorFieldProps {
    name?: string
    className?: string
    options?: string[]
}

export const SelectorField = ({ name, className, options }: SelectorFieldProps) => {
    return (
        <Field name={name} as="select" className={'field border-transparent ' + className}>
            {options?.map((option, index) => <option key={index}>{option}</option>)}
        </Field>
    )
}
