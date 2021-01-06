interface UserInputConfig {
  title: string,
  people: number,
  description: string,
};

interface ValidatorConfig {
  value: string | number,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  min?: number,
  max?: number, 
};

function isInputValid(validatableInput: ValidatorConfig): boolean {
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

function autobind (
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor,
) {
  const originMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originMethod.bind(this);
    },
  };
  return adjDescriptor;
};

class ProjectForm {
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  descInputElement: HTMLInputElement;
  titleInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  templateElement: HTMLTemplateElement;

  constructor() { 
    this.templateElement = <HTMLTemplateElement> document.querySelector('#project-input');
    this.hostElement = <HTMLDivElement> document.querySelector('#app');

    const importedNode = document.importNode(this.templateElement.content, true);
    this.formElement = <HTMLFormElement> importedNode.firstElementChild;
    this.formElement.id = 'user-input';

    this.descInputElement = <HTMLInputElement> this.formElement.querySelector('#description');
    this.titleInputElement = <HTMLInputElement> this.formElement.querySelector('#title');
    this.peopleInputElement = <HTMLInputElement> this.formElement.querySelector('#people');

    this.attach();
    this.initHandler();
  }

  private clearInput(): void {
    this.titleInputElement.value = '';
    this.peopleInputElement.value = '';
    this.descInputElement.value = '';
  }

  private getUserInputConfig(): UserInputConfig | void {
    const title = this.titleInputElement.value;
    const people = this.peopleInputElement.value;
    const description = this.descInputElement.value;

    const isTitleValid = isInputValid({
      value: title,
      required: true,
    });

    const isPeopleValid = isInputValid({
      value: +people,
      required: true,
      min: 1,
      max: 5,
    });

    const isDescriptionValid = isInputValid({
      value: description,
      required: true,
      minLength: 5,
    });

    const isValid = isTitleValid && isPeopleValid && isDescriptionValid;

    return isValid
      ? { title, description, people: +people, }
      : alert('Invalid input, try again!');
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    this.getUserInputConfig();
    this.clearInput();
  }

  private initHandler() {
    this.formElement.addEventListener('submit', this.submitHandler); 
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const projectForm = new ProjectForm();
