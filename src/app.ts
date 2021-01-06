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

  private submitHandler(event: Event) {
    event.preventDefault();
  }

  private initHandler() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const projectForm = new ProjectForm();
