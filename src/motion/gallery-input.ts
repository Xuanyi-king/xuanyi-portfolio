import type { GalleryController } from "./gallery-controller";
import { gallerySpacing } from "./gallery-model";
import { gestureIntent, type GalleryIntent } from "./gallery-gesture";
export function bindGalleryInput(
  stage: HTMLElement,
  engine: GalleryController,
) {
  let pointer: number | null = null,
    startX = 0,
    startY = 0,
    startPosition = 0,
    started = 0,
    lastTime = 0,
    lastPosition = 0,
    speed = 0,
    blockUntil = 0,
    intent: GalleryIntent = "pending";
  const clear = () => {
    const id = pointer;
    pointer = null;
    delete stage.dataset.dragging;
    if (id !== null && stage.hasPointerCapture(id))
      stage.releasePointerCapture(id);
  };
  const down = (e: PointerEvent) => {
    if (
      pointer !== null ||
      e.button !== 0 ||
      e.isPrimary === false ||
      (e.target as Element).closest("button,input")
    )
      return;
    pointer = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    started = lastTime = performance.now();
    intent = "pending";
    speed = 0;
    engine.press();
    startPosition = lastPosition = engine.read().position;
  };
  const move = (e: PointerEvent) => {
    if (pointer !== e.pointerId) return;
    const now = performance.now(),
      dx = e.clientX - startX,
      dy = e.clientY - startY;
    if (intent === "pending") intent = gestureIntent(dx, dy, now - started);
    if (intent === "horizontal") {
      if (!stage.hasPointerCapture(e.pointerId))
        stage.setPointerCapture(e.pointerId);
      stage.dataset.dragging = "true";
      e.preventDefault();
      const position = startPosition - dx / gallerySpacing(innerWidth);
      const elapsed = Math.max(8, now - lastTime);
      speed =
        speed * 0.35 + ((position - lastPosition) / (elapsed / 1000)) * 0.65;
      lastPosition = position;
      lastTime = now;
      engine.drag(position);
    }
  };
  const up = (e: PointerEvent) => {
    if (pointer !== e.pointerId) return;
    const now = performance.now(),
      dragged = intent === "horizontal";
    if (dragged || intent === "longpress" || now - started > 500)
      blockUntil = now + 350;
    clear();
    if (dragged && e.type === "pointerup")
      engine.release(now - lastTime > 100 ? 0 : speed);
    else engine.cancel();
  };
  const click = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;
    if (e.detail > 0 && performance.now() < blockUntil) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const card = (e.target as Element).closest<HTMLElement>(".gallery-card");
    if (!card) return;
    const index = Number(card.dataset.index);
    if (index !== engine.read().active) {
      e.preventDefault();
      engine.select(index);
    }
  };
  const preventDrag = (e: DragEvent) => e.preventDefault();
  const cancel = () => {
    clear();
    engine.cancel();
  };
  stage.addEventListener("pointerdown", down);
  stage.addEventListener("pointermove", move, { passive: false });
  stage.addEventListener("click", click, true);
  stage.addEventListener("dragstart", preventDrag);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("blur", cancel);
  return {
    cancel,
    dispose() {
      clear();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("click", click, true);
      stage.removeEventListener("dragstart", preventDrag);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", cancel);
    },
  };
}
