import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DragState = { id: string; x: number; y: number; w: number; content: ReactNode } | null;

/**
 * Sistem drag & drop berbasis Pointer Event.
 * Mendukung mouse, sentuhan (tablet/HP), dan mode "ketuk untuk memilih".
 */
export function useDragDrop(onDrop: (itemId: string, zoneId: string | null) => void) {
  const [drag, setDrag] = useState<DragState>(null);
  const [overZone, setOverZone] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const dragRef = useRef<DragState>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const zoneRef = useRef<string | null>(null);
  const pickedAt = useRef(0);

  const begin = useCallback((e: React.PointerEvent, id: string, content: ReactNode) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const d: DragState = { id, x: e.clientX, y: e.clientY, w: rect.width, content };
    dragRef.current = d;
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    setDrag(d);
  }, []);

  useEffect(() => {
    const findZone = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      const z = el?.closest("[data-zone]") as HTMLElement | null;
      return z?.dataset.zone ?? null;
    };
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      if (!movedRef.current) {
        const dist = Math.hypot(e.clientX - startRef.current.x, e.clientY - startRef.current.y);
        if (dist > 7) movedRef.current = true;
      }
      if (movedRef.current) e.preventDefault();
      const next = { ...d, x: e.clientX, y: e.clientY };
      dragRef.current = next;
      setDrag(next);
      const z = findZone(e.clientX, e.clientY);
      zoneRef.current = z;
      setOverZone(z);
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const z = findZone(e.clientX, e.clientY) ?? zoneRef.current;
      if (movedRef.current) {
        onDrop(d.id, z);
        setSelected(null);
      } else {
        // ketukan singkat -> pilih / batal pilih
        pickedAt.current = Date.now();
        setSelected((s) => (s === d.id ? null : d.id));
      }
      dragRef.current = null;
      zoneRef.current = null;
      setDrag(null);
      setOverZone(null);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [onDrop]);

  const zoneProps = useCallback(
    (zoneId: string) => ({
      "data-zone": zoneId,
      onClick: () => {
        // abaikan klik yang berasal dari ketukan pemilihan kartu
        if (Date.now() - pickedAt.current < 320) return;
        if (selected) {
          onDrop(selected, zoneId);
          setSelected(null);
        }
      },
    }),
    [onDrop, selected],
  );

  const itemProps = useCallback(
    (id: string, content: ReactNode) => ({
      onPointerDown: (e: React.PointerEvent) => begin(e, id, content),
      style: { touchAction: "none" as const },
    }),
    [begin],
  );

  const ghost = drag && movedRef.current && (
    <div className="drag-ghost" style={{ left: drag.x, top: drag.y, width: drag.w }}>
      {drag.content}
    </div>
  );

  return { ghost, overZone, selected, setSelected, zoneProps, itemProps, dragging: drag?.id ?? null };
}
