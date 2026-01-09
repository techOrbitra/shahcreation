"use client";

import { PRODUCT_TYPE_CONFIG, type AttributeField } from "@/config/productTypes";
import type { ProductAttributes, ProductType } from "@/types";

interface DynamicAttributesProps {
  productType: ProductType;
  attributes: ProductAttributes;
  onChange: (attributes: ProductAttributes) => void;
}

export default function DynamicAttributes({
  productType,
  attributes,
  onChange,
}: DynamicAttributesProps) {
  const config = PRODUCT_TYPE_CONFIG[productType];

  if (!config) return null;

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...attributes, [key]: value });
  };

  const handleMultiSelectToggle = (key: string, option: string) => {
    const currentValues = (attributes[key] as string[]) || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter((v) => v !== option)
      : [...currentValues, option];
    handleFieldChange(key, newValues);
  };

  const renderField = (field: AttributeField) => {
    const value = attributes[field.key];

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            value={value || ""}
            onChange={(e) =>
              handleFieldChange(
                field.key,
                field.type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder={field.placeholder}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder={field.placeholder}
          />
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        const selectedValues = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelectToggle(field.key, option)}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  selectedValues.includes(option)
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-gray-700">Yes</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {config.label} Specific Attributes
      </h3>
      {config.attributeFields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
