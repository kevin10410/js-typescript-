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

enum ProjectStatus { Active, Finished }

type Listener<T> = (projects: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus,
  ) {}
}

class ProjectState extends State<Project>{
  private projects: Project[] = [];
  private static state: ProjectState;

  constructor() {
    super();
  } 

  static getState() {
    return this.state
      ? this.state
      : new ProjectState();
  }

  addProject(project: UserInputConfig) {
    const newProject = new Project(
      Math.random().toString(),
      project.title,
      project.description,
      project.people,
      ProjectStatus.Active, 
    );

    this.projects.push(newProject);

    for (const listener of this.listeners) {
      listener([...this.projects]);
    }
  }
}

const projectState = ProjectState.getState();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateElId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElId?: string,
  ) {
    this.templateElement = <HTMLTemplateElement>document.querySelector(templateElId);
    this.hostElement = <T> document.querySelector(hostElId);
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <U> importedNode.firstElementChild;
    if (newElId) {
      this.element.id = newElId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract render(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('#single-project', `#${hostId}`, false, project.id);
    this.project = project;

    this.configure();
    this.render();
  }

  configure() {};

  render() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.project.people.toString();
    this.element.querySelector('p')!.textContent = this.project.description;
  };
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('#project-list', '#app', false, `${type}-projects`)
    this.assignedProjects = [];

    this.configure();
    this.render();
  }

  private renderProjects() {
    const listEl = <HTMLElement> document.getElementById(`${this.type}-project-list`);
    listEl.innerHTML = '';

    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const matchedProjects = projects.filter(project =>
        this.type === 'active'
          ? project.status === ProjectStatus.Active
          : project.status === ProjectStatus.Finished
      );

      this.assignedProjects = matchedProjects;
      this.renderProjects();
    });
  }

  render() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `
      ${this.type.toUpperCase()} PROJECTS
    `;
  }
}

class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
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
}

const projectForm = new ProjectForm();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
