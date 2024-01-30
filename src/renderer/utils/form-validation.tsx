import * as Yup from 'yup';

const assetSchema = Yup.object().shape({
  assetName: Yup.string().required("Asset name is required"),
  unitPrice: Yup.number().min(1, "Unit price must be positive").required("Unit price is required"),
  quantityOwned: Yup.number().min(0, "Quantity must be non-negative").required("Quantity is required"),
  targetPercent: Yup.number().min(0, "Target % must be positive").max(100, "Target % must be between 0 and 100").required("Target % is required"),
});

export const TAMFormSchema = Yup.object().shape({
  assets: Yup.array().of(assetSchema).test('total-target-percent', 'Total target % must equal 100', assets => {
    const total = assets?.reduce((acc, asset) => acc + asset.targetPercent, 0);
    return total === 100;
  }),
  budget: Yup.number().min(0, "Budget must be positive").required("Budget is required"),
  currency: Yup.string().required("Currency is required"),
});
