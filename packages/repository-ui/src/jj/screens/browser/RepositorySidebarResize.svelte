<!-- SPDX-License-Identifier: Apache-2.0; extracted from the JJ Store file-tree resize flow for either body sidebar. -->
<script lang="ts">
  let {
    width = $bindable(256),
    side = "left",
    minimum = 208,
    maximum = 420,
    defaultWidth = 256,
    label,
    onResize,
  }: {
    width?: number;
    side?: "left" | "right";
    minimum?: number;
    maximum?: number;
    defaultWidth?: number;
    label: string;
    onResize?(width: number): void;
  } = $props();
  let pointer = $state<number | null>(null),
    startX = 0,
    startWidth = 0;
  const clamp = (value: number) =>
    Math.min(
      maximum,
      Math.max(
        minimum,
        Number.isFinite(value) ? Math.round(value) : defaultWidth,
      ),
    );
  function begin(event: PointerEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    pointer = event.pointerId;
    startX = event.clientX;
    startWidth = clamp(width);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (event.pointerId === pointer)
      width = clamp(
        startWidth + (event.clientX - startX) * (side === "left" ? 1 : -1),
      );
  }
  function finish(event: PointerEvent) {
    if (event.pointerId !== pointer) return;
    pointer = null;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId))
      target.releasePointerCapture(event.pointerId);
    onResize?.(clamp(width));
  }
  function keyboard(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const step = (event.shiftKey ? 32 : 16) * (side === "left" ? 1 : -1);
    width =
      event.key === "Home"
        ? minimum
        : event.key === "End"
          ? maximum
          : clamp(width + (event.key === "ArrowLeft" ? -step : step));
    onResize?.(width);
  }
</script>

<button
  type="button"
  class="repository-browser__file-tree-resize"
  data-side={side}
  data-resizing={pointer === null ? undefined : ""}
  data-min-width={minimum}
  data-max-width={maximum}
  data-current-width={clamp(width)}
  aria-label={label}
  title="Drag to resize. Double-click to reset width."
  onpointerdown={begin}
  onpointermove={move}
  onpointerup={finish}
  onpointercancel={finish}
  ondblclick={() => {
    width = defaultWidth;
    onResize?.(width);
  }}
  onkeydown={keyboard}><span aria-hidden="true"></span></button
>
