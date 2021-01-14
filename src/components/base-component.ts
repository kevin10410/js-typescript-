namespace App {
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}
