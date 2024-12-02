import { DOCUMENT } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { extend, getLocalState, injectBeforeRender, injectObjectEvents } from 'angular-three';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

@Directive({
  selector: '[cursorPointer]',
  standalone: true,
})
export class CursorPointer {
  constructor() {
    const document = inject(DOCUMENT);
    const hostElement = inject<ElementRef<Mesh>>(ElementRef);
    const mesh = hostElement.nativeElement;

    const localState = getLocalState(mesh);
    if (!localState) return;

    injectObjectEvents(() => mesh, {
      pointerover: () => void (document.body.style.cursor = 'pointer'),
      pointerout: () => void (document.body.style.cursor = 'default'),
    });
  }
}

@Component({
  standalone: true,
  template: `
    <ngt-mesh
      #mesh
      cursorPointer
      (click)="clicked.set(!clicked())"
      (pointerover)="hovered.set(true)"
      (pointerout)="hovered.set(false)"
      [scale]="clicked() ? 1.5 : 1"
    >
      <ngt-box-geometry />
      <ngt-mesh-basic-material [color]="hovered() ? 'hotpink' : 'orange'" />
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CursorPointer],
})
export class Experience {
  private meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  protected hovered = signal(false);
  protected clicked = signal(false);

  constructor() {
    extend({ Mesh, BoxGeometry, MeshBasicMaterial });
    injectBeforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += delta;
      mesh.rotation.y += delta;
    });
  }
}