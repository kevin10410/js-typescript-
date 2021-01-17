import { Component } from '../components/base-component.js';
import { autobind } from '../decorators/autobind.js';
import { isInputValid } from '../utils/validation.js';
import { UserInputConfig } from '../interface/configs.js';
import { projectState } from '../state/project-state.js';

export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  descInputElement: HTMLInputElement;
  titleInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor () {
    super('#project-input', '#app', true, 'user-input');
    this.descInputElement = <HTMLInputElement> this.element.querySelector('#description');
    this.titleInputElement = <HTMLInputElement> this.element.querySelector('#title');
    this.peopleInputElement = <HTMLInputElement> this.element.querySelector('#people');

    this.configure();
  }
  
  configure() {
    this.element.addEventListener('submit', this.submitHandler); 
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputConfig = this.getUserInputConfig();
    if (inputConfig) {
      projectState.addProject(inputConfig);
      this.clearInput();
    }
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

  render() {}
};
