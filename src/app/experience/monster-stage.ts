import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { injectBeforeRender, injectObjectEvents, injectStore, NgtArgs, NgtEuler, NgtVector3 } from 'angular-three';
import { NgtsRoundedBox, NgtsText } from 'angular-three-soba/abstractions';
import { injectTexture } from 'angular-three-soba/loaders';
import { NgtsMeshPortalMaterial } from 'angular-three-soba/materials';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import CameraControls from 'camera-controls';
import { easing } from 'maath';
import { BackSide, ColorRepresentation, DoubleSide, Vector3 } from 'three';
import { MonsterName } from './active-monster';

@Component({
  selector: 'app-monster-stage',
  standalone: true,
  template: `
    <ngt-group [position]="position()" [rotation]="rotation()">
      <ngts-text [text]="name()" [options]="{ fontSize: 0.25, position: [0, -1.5, 0.051], anchorY: 'bottom' }">
        <ngt-mesh-basic-material [color]="color()" [toneMapped]="false" />
      </ngts-text>

      <ngts-rounded-box [options]="{ width: 2, height: 3, depth: 0.1 }">
        <ngts-mesh-portal-material [options]="{ side: DoubleSide }">
          <ng-template>
            <ngt-ambient-light [intensity]="Math.PI * 0.5" />
            <ngts-environment [options]="{ preset: 'sunset' }" />

            <ng-content />

            <ngt-mesh>
              <ngt-sphere-geometry *args="[5, 64, 64]" />
              <ngt-mesh-standard-material [map]="texture()" [side]="BackSide" />
            </ngt-mesh>
          </ng-template>
        </ngts-mesh-portal-material>
      </ngts-rounded-box>
    </ngt-group>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, NgtsEnvironment, NgtsMeshPortalMaterial, NgtsRoundedBox, NgtsText],
})
export class MonsterStage {
  protected readonly Math = Math;
  protected readonly BackSide = BackSide;
  protected readonly DoubleSide = DoubleSide;

  name = input.required<MonsterName>();
  color = input.required<ColorRepresentation>();
  texturePath = input.required<string>();
  position = input<NgtVector3>([0, 0, 0]);
  rotation = input<NgtEuler>([0, 0, 0]);

  protected texture = injectTexture(this.texturePath);

  private portalMaterialRef = viewChild.required(NgtsMeshPortalMaterial);
  private roundedBoxRef = viewChild.required(NgtsRoundedBox);

  private store = injectStore();
  private controls = this.store.select('controls') as Signal<CameraControls>;

  private active = signal(false);

  constructor() {
    injectObjectEvents(() => this.roundedBoxRef().meshRef(), {
      dblclick: () => {
        this.active.update((active) => !active);
      },
    });

    effect(() => {
      const [isActive, roundedBox, controls] = [
        this.active(),
        this.roundedBoxRef().meshRef().nativeElement,
        this.controls(),
      ];
      if (isActive) {
        const targetPosition = new Vector3(0, 0, 0);
        roundedBox.getWorldPosition(targetPosition);
        void controls.setLookAt(0, 0, 5, targetPosition.x, targetPosition.y, targetPosition.z, true);
      } else {
        void controls.setLookAt(0, 0, 10, 0, 0, 0, true);
      }
    });

    injectBeforeRender(({ delta }) => {
      const isActive = this.active();
      const material = this.portalMaterialRef().materialRef().nativeElement;
      easing.damp(material, 'blend', isActive ? 1 : 0, 0.2, delta);
    });
  }
}
