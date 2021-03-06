import { Component } from '../components/base-component';
import { ProjectItem } from '../components/project-item';
import { Project, ProjectStatus } from '../model/project-model';
import { projectState } from '../state/project-state';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> {
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
