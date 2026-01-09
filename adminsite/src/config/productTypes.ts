export interface ProductTypeConfig {
  label: string;
  icon: string;
  attributeFields: AttributeField[];
}

export interface AttributeField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export const PRODUCT_TYPE_CONFIG: Record<string, ProductTypeConfig> = {
  clothes: {
    label: 'Clothes',
    icon: '👕',
    attributeFields: [
      {
        key: 'material',
        label: 'Material',
        type: 'text',
        placeholder: 'e.g., 100% Cotton',
      },
      {
        key: 'sizes',
        label: 'Available Sizes',
        type: 'multiselect',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      {
        key: 'fitType',
        label: 'Fit Type',
        type: 'select',
        options: ['Regular', 'Slim', 'Loose', 'Oversized', 'Athletic'],
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g., Black, Blue',
      },
      {
        key: 'pattern',
        label: 'Pattern',
        type: 'select',
        options: ['Solid', 'Striped', 'Checked', 'Printed', 'Embroidered'],
      },
      {
        key: 'careInstructions',
        label: 'Care Instructions',
        type: 'textarea',
        placeholder: 'Machine wash cold, tumble dry low...',
      },
    ],
  },
  bedsheets: {
    label: 'Bedsheets',
    icon: '🛏️',
    attributeFields: [
      {
        key: 'material',
        label: 'Material',
        type: 'text',
        placeholder: 'e.g., Cotton, Polyester',
      },
      {
        key: 'threadCount',
        label: 'Thread Count',
        type: 'number',
        placeholder: 'e.g., 300',
      },
      {
        key: 'sizes',
        label: 'Available Sizes',
        type: 'multiselect',
        options: ['Single', 'Double', 'Queen', 'King'],
      },
      {
        key: 'fabricType',
        label: 'Fabric Type',
        type: 'select',
        options: ['Plain Weave', 'Sateen', 'Percale', 'Jersey'],
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g., White, Ivory',
      },
      {
        key: 'pattern',
        label: 'Pattern',
        type: 'select',
        options: ['Solid', 'Striped', 'Floral', 'Geometric', 'Printed'],
      },
      {
        key: 'careInstructions',
        label: 'Care Instructions',
        type: 'textarea',
        placeholder: 'Washing and care instructions...',
      },
    ],
  },
  shoes: {
    label: 'Shoes',
    icon: '👟',
    attributeFields: [
      {
        key: 'material',
        label: 'Material',
        type: 'text',
        placeholder: 'e.g., Leather, Canvas',
      },
      {
        key: 'sizes',
        label: 'Available Sizes',
        type: 'multiselect',
        options: ['6', '7', '8', '9', '10', '11', '12'],
      },
      {
        key: 'sizeSystem',
        label: 'Size System',
        type: 'select',
        options: ['US', 'UK', 'EU', 'India'],
      },
      {
        key: 'closureType',
        label: 'Closure Type',
        type: 'select',
        options: ['Lace-up', 'Slip-on', 'Velcro', 'Buckle', 'Zipper'],
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g., Black, White',
      },
      {
        key: 'careInstructions',
        label: 'Care Instructions',
        type: 'textarea',
        placeholder: 'Cleaning and maintenance instructions...',
      },
    ],
  },
  accessories: {
    label: 'Accessories',
    icon: '👜',
    attributeFields: [
      {
        key: 'material',
        label: 'Material',
        type: 'text',
        placeholder: 'e.g., Leather, Metal',
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g., Gold, Silver',
      },
      {
        key: 'dimensions',
        label: 'Dimensions',
        type: 'text',
        placeholder: 'e.g., 10x5x2 cm',
      },
      {
        key: 'weight',
        label: 'Weight',
        type: 'text',
        placeholder: 'e.g., 100g',
      },
    ],
  },
  'home-decor': {
    label: 'Home Decor',
    icon: '🏠',
    attributeFields: [
      {
        key: 'material',
        label: 'Material',
        type: 'text',
        placeholder: 'e.g., Wood, Metal, Ceramic',
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g., Natural, White',
      },
      {
        key: 'dimensions',
        label: 'Dimensions',
        type: 'text',
        placeholder: 'e.g., 30x20x15 cm',
      },
      {
        key: 'weight',
        label: 'Weight',
        type: 'text',
        placeholder: 'e.g., 500g',
      },
      {
        key: 'careInstructions',
        label: 'Care Instructions',
        type: 'textarea',
        placeholder: 'Maintenance and care instructions...',
      },
    ],
  },
};
