import { Component } from '../components/base-component.js';
import { Project } from '../model/project-model.js';
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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
