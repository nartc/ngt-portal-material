import { signal } from '@angular/core';

export type MonsterName = 'Ghost Skull' | 'Mushroom King' | 'Ninja';

export const activeMonster = signal<MonsterName | null>(null);
