/**Auto-generated by: https://github.com/angular-threejs/gltf
Command: npx angular-three-gltf&#64;1.0.16 public/MushroomKing.gltf -o src/app/experience/mushroom-king-model.ts --selector app-mushroom-king-model --name MushroomKingModel --transform
**/

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import {
  extend,
  NgtArgs,
  NgtGroup,
  NgtObjectEvents,
  NgtObjectEventsInputs,
  NgtObjectEventsOutputs,
} from 'angular-three';
import { injectGLTF } from 'angular-three-soba/loaders';
import { injectAnimations, NgtsAnimationApi, NgtsAnimationClips } from 'angular-three-soba/misc';
import type * as THREE from 'three';
import { Group, SkinnedMesh } from 'three';
import { GLTF } from 'three-stdlib';
import { injectModelAnimation } from './model-animation';

type ActionName =
  | 'Death'
  | 'Duck'
  | 'HitReact'
  | 'Idle'
  | 'Jump'
  | 'Jump_Idle'
  | 'Jump_Land'
  | 'No'
  | 'Punch'
  | 'Run'
  | 'Walk'
  | 'Wave'
  | 'Weapon'
  | 'Yes';
type MushroomKingModelAnimationClips = NgtsAnimationClips<ActionName>;
export type MushroomKingModelAnimationApi = NgtsAnimationApi<MushroomKingModelAnimationClips> | null;
export type MushroomKingModelGLTFResult = GLTF & {
  animations: MushroomKingModelAnimationClips[];
  nodes: {
    Mushroom: THREE.SkinnedMesh;
    MushroomKing: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    Atlas: THREE.MeshStandardMaterial;
  };
};

@Component({
  selector: 'app-mushroom-king-model',
  standalone: true,
  template: `
    @if (gltf(); as gltf) {
      <ngt-group #model [parameters]="options()" (pointerover)="hovered.set(true)" (pointerout)="hovered.set(false)">
        <ngt-group name="Scene">
          <ngt-group name="CharacterArmature">
            <ngt-primitive *args="[gltf.nodes.Root]" />
            <ngt-skinned-mesh
              name="Mushroom"
              [geometry]="gltf.nodes.Mushroom.geometry"
              [material]="gltf.materials.Atlas"
              [skeleton]="gltf.nodes.Mushroom.skeleton"
            />
            <ngt-skinned-mesh
              name="MushroomKing"
              [geometry]="gltf.nodes.MushroomKing.geometry"
              [material]="gltf.materials.Atlas"
              [skeleton]="gltf.nodes.MushroomKing.skeleton"
            />
          </ngt-group>
        </ngt-group>

        <ng-content />
      </ngt-group>
    }
  `,
  imports: [NgtArgs],
  hostDirectives: [{ directive: NgtObjectEvents, inputs: NgtObjectEventsInputs, outputs: NgtObjectEventsOutputs }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MushroomKingModel {
  protected readonly Math = Math;

  options = input({} as Partial<NgtGroup>);
  animations = model<MushroomKingModelAnimationApi>();
  modelRef = viewChild<ElementRef<Group>>('model');

  protected gltf = injectGLTF(() => '/MushroomKing-transformed.glb', {
    useDraco: true,
  }) as unknown as Signal<MushroomKingModelGLTFResult | null>;
  protected hovered = signal(false);

  private scene = computed(() => {
    const gltf = this.gltf();
    if (!gltf) return null;
    return gltf.scene;
  });

  private objectEvents = inject(NgtObjectEvents, { host: true });

  constructor() {
    extend({ Group, SkinnedMesh });

    injectModelAnimation(this.hovered, this.animations, 'Idle', 'Wave');

    const animations = injectAnimations(this.gltf, this.scene);
    effect(
      () => {
        if (animations.ready()) {
          this.animations.set(animations);
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const modelRef = this.modelRef()?.nativeElement;
        if (!modelRef) return;

        this.objectEvents.ngtObjectEvents.set(modelRef);
      },
      { allowSignalWrites: true },
    );
  }
}
