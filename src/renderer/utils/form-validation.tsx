import * as Yup from 'yup';

const assetSchema = Yup.object().shape({
  assetName: Yup.string().required("Asset name is required"),
  unitPrice: Yup.number().min(0, "Unit price must be positive"),
  quantityOwned: Yup.number().min(0, "Quantity must be non-negative"),
  targetPercent: Yup.number().min(0).max(100, "Target percent must be between 0 and 100"),
});

export const TAMFormSchema = Yup.object().shape({
  assets: Yup.array().of(assetSchema),
  budget: Yup.number().min(0, "Budget must be positive"),
  currency: Yup.string().required("Currency is required"),
});
