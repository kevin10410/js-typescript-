import { UserInputConfig } from '../interface/configs';
import { Project, ProjectStatus } from '../model/project-model';

type Listener<T> = (projects: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

export class ProjectState extends State<Project>{
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


export const projectState = ProjectState.getState();
