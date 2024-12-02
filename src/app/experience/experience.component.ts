import { DOCUMENT } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { extend, getLocalState, injectBeforeRender, injectObjectEvents } from 'angular-three';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { GhostSkullModel, GhostSkullModelAnimationApi } from './ghost-skull-model';

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

    <app-ghost-skull-model [(animations)]="ghostSkullAnimations" />
    <ngts-environment [options]="{ preset: 'city' }" />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CursorPointer, GhostSkullModel, NgtsEnvironment],
})
export class Experience {
  private meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  ghostSkullAnimations = signal<GhostSkullModelAnimationApi>(null);

  protected hovered = signal(false);
  protected clicked = signal(false);

  constructor() {
    extend({ Mesh, BoxGeometry, MeshBasicMaterial });
    injectBeforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += delta;
      mesh.rotation.y += delta;
    });

    effect(() => {
      const animations = this.ghostSkullAnimations();
      if (!animations) return;

      animations.actions.Flying_Idle?.reset().fadeIn(0.5).play();
    });
  }
}
