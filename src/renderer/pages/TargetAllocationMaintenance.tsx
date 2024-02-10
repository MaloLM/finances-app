import React, { useEffect, useState } from 'react'
import { parseToTamResponse, TamFormResponse } from '../utils'
import { useIpcRenderer } from '../api/electron'
import { Loading, TamForm } from '../components'
import toast from 'react-hot-toast'
import { useAppContext } from '../context'

export const TargetAllocationMaintenance = () => {
    const { tamData } = useAppContext()
    const [isLoading, setIsloading] = useState<boolean>(true)
    const [computeResult, setComputeResult] = useState<TamFormResponse>({} as TamFormResponse)
    const { sendWriteData, onWriteResponse, saveFormData } = useIpcRenderer()

    useEffect(() => {
        if (tamData && tamData.assets && tamData.budget && tamData.currency) {
            setIsloading(false)
        }
    }, [tamData])

    const saveConfig = (values) => {
        const { assets, budget, currency } = values
        const formData = {
            assets: assets,
            currency: currency,
            budget: parseFloat(budget),
        }
        saveFormData(formData)
        toast.success('Configuration saved')
    }

    const handleResponse = (event, responseData) => {
        if (event.error) {
            toast.error(event.error)
        } else {
            let result = parseToTamResponse(responseData.message)
            setComputeResult(result)
        }
    }

    const handleSubmit = (formData) => {
        sendWriteData(formData)
        onWriteResponse(handleResponse)
    }

    return (
        <div className="flex h-full flex-col">
            {isLoading ? (
                <Loading />
            ) : (
                <TamForm
                    tamData={tamData}
                    onSubmit={handleSubmit}
                    computeResult={computeResult}
                    saveConfig={saveConfig}
                />
            )}
        </div>
    )
}
