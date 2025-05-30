# Diagnosis Debug Functionality

## Overview

Debug buttons have been added to every step in the diagnosis tool to help developers and testers quickly fill forms with realistic random medical values. This functionality is controlled by a feature flag and can be easily enabled/disabled.

## Features

### 1. Debug Feature Flag

- **Environment Variable**: `VITE_ENABLE_DIAGNOSIS_DEBUG`
- **Default**: `false` (disabled in production)
- **Location**: `frontend/src/config/constants.js`

### 2. Debug Components

#### DebugFieldButton

- **Location**: `frontend/src/components/debug/DebugFieldButton.jsx`
- **Purpose**: Individual field debug button that fills a single form field with random data
- **Icon**: Bug Report icon (🐛)
- **Color**: Orange theme to distinguish from regular UI elements

#### DebugSectionButton

- **Location**: `frontend/src/components/debug/DebugSectionButton.jsx`
- **Purpose**: Section-level debug button that fills all fields in a form section
- **Style**: Outlined button with bug icon

### 3. Random Value Generators

#### Patient Information

- **Patient Name**: Random combination of common first and last names
- **Age**: Random age between 18-98 years
- **Sex**: Random selection of "Male" or "Female"

#### Lab Results (Medical Reference Ranges)

- **ALP (Alkaline Phosphatase)**: 30-150 U/L
- **AST (Aspartate Aminotransferase)**: 10-60 U/L
- **CHE (Cholinesterase)**: 3500-12000 U/L
- **CREA (Creatinine)**: 0.6-1.5 mg/dL
- **GGT (Gamma-Glutamyl Transferase)**: 5-60 U/L

#### Optional Parameters

- **ALB (Albumin)**: 3.5-5.0 g/dL
- **BIL (Bilirubin)**: 0.2-1.2 mg/dL
- **CHOL (Cholesterol)**: 120-300 mg/dL
- **PROT (Protein)**: 6.0-8.5 g/dL
- **ALT (Alanine Aminotransferase)**: 7-60 U/L

#### Clinical Symptoms

Random selection of 0-3 symptoms from:

- Fatigue, Nausea, Abdominal Pain, Jaundice, Dark Urine
- Loss of Appetite, Weight Loss, Fever, Joint Pain, Clay-colored Stools

## Implementation Details

### Form Integration

Debug buttons are integrated into each diagnosis form step:

1. **PatientInfoStep.jsx**

   - Individual debug buttons next to each form field
   - Section-level "Fill Patient Info with Random Data" button

2. **LabResultsStep.jsx**

   - Individual debug buttons for each lab result field
   - Section-level "Fill Lab Results with Random Data" button

3. **AdditionalDataStep.jsx**
   - Individual debug buttons for optional parameters
   - Special debug button for symptoms that handles multiple selection

### Conditional Rendering

Debug buttons only appear when `FEATURES.ENABLE_DIAGNOSIS_DEBUG` is `true`:

```jsx
{
  FEATURES.ENABLE_DIAGNOSIS_DEBUG && (
    <DebugFieldButton
      fieldName="patientName"
      handleChange={handleChange}
      formData={formData}
    />
  );
}
```

### Environment Configuration

#### Development (.env)

```bash
VITE_ENABLE_DIAGNOSIS_DEBUG=true
```

#### Production (.env.production)

```bash
VITE_ENABLE_DIAGNOSIS_DEBUG=false
```

## Usage Instructions

### For Developers

1. Set `VITE_ENABLE_DIAGNOSIS_DEBUG=true` in your `.env` file
2. Restart the development server
3. Navigate to the diagnosis page (`/diagnosis`)
4. Debug buttons (🐛) will appear next to form fields and sections
5. Click individual field buttons to fill specific fields
6. Click section buttons to fill entire form sections

### For Testing

- Use debug buttons to quickly create test scenarios
- Generate realistic medical data for comprehensive testing
- Test form validation with various data combinations
- Verify diagnosis tool functionality with sample data

### For Production

- Ensure `VITE_ENABLE_DIAGNOSIS_DEBUG=false` in production environment
- Debug buttons will be completely hidden from end users
- No performance impact when disabled

## Security Considerations

1. **Production Safety**: Debug functionality is completely disabled in production
2. **No Data Leakage**: Random generators use predefined ranges, no real patient data
3. **UI Distinction**: Debug buttons are clearly marked and styled differently
4. **Development Only**: Feature is intended for development and testing only

## Technical Implementation

### Random Value Generation

```javascript
const randomValueGenerators = {
  patientName: () => {
    const firstNames = ["John", "Jane", ...];
    const lastNames = ["Smith", "Johnson", ...];
    return `${firstName} ${lastName}`;
  },
  age: () => Math.floor(Math.random() * 80) + 18,
  // ... other generators
};
```

### Form Integration Pattern

```jsx
<Box sx={{ display: "flex", alignItems: "center" }}>
  <TextField
    fullWidth
    label="Field Label"
    name="fieldName"
    value={formData.fieldName}
    onChange={handleChange}
  />
  <DebugFieldButton
    fieldName="fieldName"
    handleChange={handleChange}
    formData={formData}
  />
</Box>
```

## Benefits

1. **Faster Development**: Quickly populate forms for testing
2. **Realistic Data**: Medical reference ranges ensure realistic test data
3. **Comprehensive Testing**: Easy generation of various data combinations
4. **User Experience Testing**: Test form behavior with different data sets
5. **Zero Production Impact**: Completely disabled in production builds

## Future Enhancements

1. **Custom Scenarios**: Pre-defined medical scenarios (e.g., liver disease patterns)
2. **Data Export**: Export generated test data for documentation
3. **Validation Testing**: Generate edge cases for form validation testing
4. **Bulk Generation**: Generate multiple patient records for load testing
