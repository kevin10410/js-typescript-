interface UserInputConfig {
  title: string,
  people: number,
  description: string,
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

    const isValid = title.trim().length !== 0
      && people.trim().length !== 0
      && description.trim().length !== 0;

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
