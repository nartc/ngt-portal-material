import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { Experience } from './experience/experience.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ngt-canvas [sceneGraph]="sceneGraph" />
  `,
  host: { class: 'block h-dvh w-full' },
  imports: [NgtCanvas],
})
export class AppComponent {
  sceneGraph = Experience;
}
