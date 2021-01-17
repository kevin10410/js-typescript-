export interface UserInputConfig {
  title: string,
  people: number,
  description: string,
};

export interface ValidatorConfig {
  value: string | number,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  min?: number,
  max?: number, 
};
