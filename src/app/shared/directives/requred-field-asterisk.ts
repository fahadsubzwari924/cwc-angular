import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[requiredField]',
})
export class MarkFeildRequired implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const asteriskElement = document.createElement('span');
    asteriskElement.textContent = '*';
    asteriskElement.style.color = 'red';
    asteriskElement.className = 'ml-1';
    const labelElement = this.el.nativeElement;
    labelElement.appendChild(asteriskElement);
  }
}
