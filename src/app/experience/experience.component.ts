import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component } from '@angular/core';
import { extend } from 'angular-three';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import * as THREE from 'three';
import { GhostSkullModel } from './ghost-skull-model';
import { MonsterStage } from './monster-stage';
import { MushroomKingModel } from './mushroom-king-model';
import { NinjaModel } from './ninja-model';

extend(THREE);

@Component({
  standalone: true,
  template: `
    <ngts-camera-controls [options]="{ makeDefault: true, maxPolarAngle: Math.PI / 2, minPolarAngle: Math.PI / 6 }" />

    <ngt-ambient-light [intensity]="Math.PI * 0.5" />
    <ngts-environment [options]="{ preset: 'sunset' }" />

    <app-monster-stage [position]="[0, 0, -0.5]" name="Ghost Skull" color="#221210" texturePath="ghost-town.jpg">
      <app-ghost-skull-model [options]="{ scale: 0.6, position: [0, -1, 0] }" />
    </app-monster-stage>

    <app-monster-stage
      [position]="[-2.5, 0, 0]"
      [rotation]="[0, Math.PI / 8, 0]"
      name="Mushroom King"
      color="#D7BBA3"
      texturePath="mushroom-forest.jpg"
    >
      <app-mushroom-king-model [options]="{ scale: 0.6, position: [0, -1, 0] }" />
    </app-monster-stage>

    <app-monster-stage
      [position]="[2.5, 0, 0]"
      [rotation]="[0, -Math.PI / 8, 0]"
      name="Ninja"
      color="#AD8A60"
      texturePath="ninja-town.jpg"
    >
      <app-ninja-model [options]="{ scale: 0.6, position: [0, -1, 0] }" />
    </app-monster-stage>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GhostSkullModel, NgtsEnvironment, MushroomKingModel, NinjaModel, NgtsCameraControls, MonsterStage],
})
export class Experience {
  protected readonly Math = Math;
}
