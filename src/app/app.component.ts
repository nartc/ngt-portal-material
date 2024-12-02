import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { Experience } from './experience/experience.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ngt-canvas [sceneGraph]="sceneGraph" [camera]="{ position: [0, 0, 10], fov: 30 }" />
  `,
  host: { class: 'block h-dvh w-full' },
  imports: [NgtCanvas],
})
export class AppComponent {
  sceneGraph = Experience;
}
