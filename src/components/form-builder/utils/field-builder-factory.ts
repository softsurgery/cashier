import { DynamicField, FieldVariant } from "../form-builder.types";

export const getFieldBuilderObjectFactory = (): DynamicField => {
  return {
    label: "",
    variant: FieldVariant.EMPTY,
    description: "",
    class: "",
    isRequired: false,
    isHidden: true,
    props: {},
  };
};
