import { DOCUMENT } from '@angular/common';
import { effect, inject, signal } from '@angular/core';
import { NgtsAnimationApi, NgtsAnimationClip } from 'angular-three-soba/misc';

export function injectModelAnimation<TAnimationApi extends NgtsAnimationApi<NgtsAnimationClip>>(
  showCursor: () => boolean,
  animations: () => TAnimationApi | null | undefined,
  defaultAnimationName: keyof TAnimationApi['actions'],
  hoveredAnimationName: keyof TAnimationApi['actions'],
) {
  const document = inject(DOCUMENT);

  const animationName = signal(defaultAnimationName);

  effect(
    () => {
      const cursor = showCursor() ? 'pointer' : 'default';
      void (document.body.style.cursor = cursor);
      if (cursor === 'pointer') {
        animationName.set(hoveredAnimationName);
      } else {
        animationName.set(defaultAnimationName);
      }
    },
    { allowSignalWrites: true },
  );

  effect((onCleanup) => {
    const animationApi = animations();
    if (!animationApi) return;

    const animation = animationName();

    animationApi.actions[animation]?.reset().fadeIn(0.5).play();
    onCleanup(() => animationApi.actions[animation]?.fadeOut(0.5));
  });
}
