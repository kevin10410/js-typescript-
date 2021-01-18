import { ValidatorConfig } from '../interface/configs';

export function isInputValid(validatableInput: ValidatorConfig): boolean {
  const { value } = validatableInput;
  let isValid = true;
  
  if (validatableInput.required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  if (validatableInput.minLength !== undefined && typeof value === 'string') {
    isValid = isValid && value.length >= validatableInput.minLength;
  }

  if (validatableInput.maxLength !== undefined && typeof value === 'string') {
    isValid = isValid && value.length <= validatableInput.maxLength;
  }

  if (validatableInput.min !== undefined && typeof value === 'number') {
    isValid = isValid && value >= validatableInput.min;
  }

  if (validatableInput.max !== undefined && typeof value === 'number') {
    isValid = isValid && value <= validatableInput.max;
  }

  return isValid;
};
