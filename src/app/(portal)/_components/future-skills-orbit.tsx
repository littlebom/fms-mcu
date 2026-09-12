"use client";

import { useEffect, useRef } from "react";

interface NodeItem {
  name: string;
  x: number;
  y: number;
  z: number;
  deg: number;
  weight: number;
  r: number;
  tone: number;
}

interface ProjectedShot {
  p: NodeItem;
  i: number;
  x: number;
  y: number;
  r: number;
  ndc: number;
}

const NAMES = [
  "AI Literacy", "Prompt Engineering", "Critical Thinking", "Data Fluency",
  "Systems Thinking", "Creativity", "Collaboration", "Adaptability",
  "Digital Ethics", "Complex Problem Solving", "Human-AI Teaming", "Learning Agility",
  "Communication", "Emotional Intelligence", "Cyber Security", "Design Thinking",
  "Storytelling", "Leadership", "Data Visualization", "Machine Learning",
  "Cloud Computing", "Sustainability", "Media Literacy", "Project Management",
  "Innovation", "Coaching & Mentoring", "Cultural Fluency", "Computational Thinking",
];

export function FutureSkillsOrbit() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const DOT_SCALE = 0.72;
    const Y_STRETCH = 1.95;
    const SPREAD = 210;
    const FLATTEN = 1.7;
    const PASSES = 60;
    const PULL = 0.004;
    const SEPARATION = 3.0 / DOT_SCALE;
    const FOV = 50;
    const IDLE_SPIN = 0.025;
    const GROW_RATE = 3.2;
    const BEAT_RATE = 0.22;
    const ASIDE = 0.16;
    const RING_GAP = 4;
    const RING_WIDTH = 0.75;
    const MAX_LABELS = 70;

    const N = NAMES.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const items: NodeItem[] = [];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      items.push({
        name: NAMES[i],
        x: Math.cos(th) * ring * SPREAD * FLATTEN,
        y: y * SPREAD * Y_STRETCH,
        z: Math.sin(th) * ring * SPREAD * FLATTEN,
        deg: 0,
        weight: 1,
        r: 6,
        tone: 0.5,
      });
    }

    const links: [number, number][] = [];
    const seen: Record<string, number> = {};
    for (let i = 0; i < N; i++) {
      const d: [number, number][] = [];
      for (let j = 0; j < N; j++) {
        if (j !== i) {
          const ax = items[i].x - items[j].x;
          const ay = items[i].y - items[j].y;
          const az0 = items[i].z - items[j].z;
          d.push([ax * ax + ay * ay + az0 * az0, j]);
        }
      }
      d.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < 2; k++) {
        const a = Math.min(i, d[k][1]);
        const b = Math.max(i, d[k][1]);
        const key = `${a}-${b}`;
        if (!seen[key]) {
          seen[key] = 1;
          links.push([a, b]);
          items[a].deg++;
          items[b].deg++;
        }
      }
    }

    let maxDeg = 1;
    for (let i = 0; i < N; i++) maxDeg = Math.max(maxDeg, items[i].deg);
    for (let i = 0; i < N; i++) {
      items[i].weight = Math.sqrt(items[i].deg / maxDeg);
      items[i].r = (4 + items[i].weight * 8.5) * DOT_SCALE;
      items[i].tone = 0.3 + items[i].weight * 0.62;
    }

    const near: Record<number, number[]> = {};
    for (let i = 0; i < links.length; i++) {
      const A = links[i][0];
      const B = links[i][1];
      (near[A] = near[A] || []).push(B);
      (near[B] = near[B] || []).push(A);
    }

    for (let pass = 0; pass < PASSES; pass++) {
      for (let i = 0; i < links.length; i++) {
        const p1 = items[links[i][0]];
        const p2 = items[links[i][1]];
        const dx = (p2.x - p1.x) * PULL;
        const dy = (p2.y - p1.y) * PULL;
        const dz = (p2.z - p1.z) * PULL;
        p1.x += dx; p1.y += dy; p1.z += dz;
        p2.x -= dx; p2.y -= dy; p2.z -= dz;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < Math.min(N, i + 14); j++) {
          const q1 = items[i];
          const q2 = items[j];
          const ex = q2.x - q1.x;
          const ey = q2.y - q1.y;
          const ez = q2.z - q1.z;
          const d2 = ex * ex + ey * ey + ez * ez;
          const min = (q1.r + q2.r) * SEPARATION;
          if (d2 > 0.01 && d2 < min * min) {
            const dd = Math.sqrt(d2);
            const push = ((min - dd) / dd) * 0.5;
            q1.x -= ex * push; q1.y -= ey * push; q1.z -= ez * push;
            q2.x += ex * push; q2.y += ey * push; q2.z += ez * push;
          }
        }
      }
    }

    const TAN = Math.tan((FOV * Math.PI) / 360);
    function quant(v: number[]) {
      const s = v.slice().sort((a, b) => a - b);
      return s[Math.min(s.length - 1, Math.floor(0.9 * s.length))];
    }

    function homeFor(aspect: number) {
      const ph: number[] = [];
      const py: number[] = [];
      for (let m = 0; m < N; m++) {
        ph.push(Math.hypot(items[m].x, items[m].z));
        py.push(Math.abs(items[m].y));
      }
      const soft = Math.max(320, Math.max(quant(py), quant(ph) / aspect) * 2.2);
      let hard = 320;
      for (let m = 0; m < N; m++) {
        const Rh = ph[m];
        hard = Math.max(hard, Math.max(Rh / (TAN * aspect), Math.abs(items[m].y) / TAN) / 0.95 + Rh);
      }
      return Math.max(soft, hard);
    }

    let ink = [27, 39, 64];
    let mark = [5, 86, 202];
    let colorAge = 99;

    function readColors() {
      const c = getComputedStyle(cv!).color.match(/[\d.]+/g);
      if (c) ink = [+c[0], +c[1], +c[2]];
      const a = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
      if (/^#[0-9a-f]{6}$/i.test(a)) {
        mark = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
      }
    }

    function rgba(c: number[], a: number) {
      return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let grow = reduce ? 1 : 0;
    let beat = 0;
    let az = 0.6;
    let tilt = 0;
    let hover: number | null = null;
    let dragging = false;
    let last: { x: number; y: number } | null = null;
    let moved = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    const shots: ProjectedShot[] = [];
    let widths: Record<string, number> = {};

    function resize() {
      const w = cv!.clientWidth;
      const h = cv!.clientHeight;
      if (!w || !h) return false;
      const r = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== W || h !== H || r !== dpr) {
        W = w; H = h; dpr = r;
        cv!.width = w * r;
        cv!.height = h * r;
        widths = {};
      }
      return true;
    }

    function project() {
      const D = homeFor(Math.max(0.2, W / Math.max(1, H)));
      const uPixels = H / (2 * TAN);
      const ca = Math.cos(az);
      const sa = Math.sin(az);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      shots.length = 0;
      for (let m = 0; m < N; m++) {
        const p = items[m];
        const x1 = p.x * ca - p.z * sa;
        const z1 = p.x * sa + p.z * ca;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const depth = D - z2;
        if (depth <= 1) continue;
        const s = uPixels / depth;
        shots.push({ p, i: m, x: W / 2 + x1 * s, y: H / 2 - y2 * s, r: p.r * grow * s, ndc: z2 / D });
      }
      shots.sort((a, b) => a.ndc - b.ndc);
    }

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      const at: Record<number, ProjectedShot> = {};
      for (let m = 0; m < shots.length; m++) at[shots[m].i] = shots[m];

      // Network lines
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = rgba(ink, 0.08);
      ctx!.beginPath();
      for (let m = 0; m < links.length; m++) {
        const a = at[links[m][0]];
        const b = at[links[m][1]];
        if (!a || !b) continue;
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
      }
      ctx!.stroke();

      const focus = hover != null ? at[hover] : null;
      const kin: Record<number, number> = {};
      if (focus) {
        const list = near[hover!] || [];
        for (let m = 0; m < list.length; m++) {
          kin[list[m]] = 1;
          const t2 = at[list[m]];
          if (!t2) continue;
          ctx!.strokeStyle = rgba(ink, 0.35);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(focus.x, focus.y);
          ctx!.lineTo(t2.x, t2.y);
          ctx!.stroke();

          // Animated particle pulses along connected lines
          const span = Math.hypot(t2.x - focus.x, t2.y - focus.y);
          const beads = Math.max(3, Math.min(14, Math.round(span / 34)));
          for (let q = 0; q < beads; q++) {
            const t = (q / beads + beat) % 1;
            const fade = Math.sin(Math.PI * t);
            ctx!.fillStyle = rgba(ink, 0.5 * fade);
            ctx!.beginPath();
            ctx!.arc(focus.x + (t2.x - focus.x) * t, focus.y + (t2.y - focus.y) * t, 1.5 * fade + 0.5, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      // Nodes
      for (let m = 0; m < shots.length; m++) {
        const s = shots[m];
        const emph = !focus || s.i === hover || kin[s.i] ? 1 : ASIDE;
        ctx!.fillStyle = rgba(ink, s.p.tone * emph);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, Math.max(0, s.r * (0.86 + 0.14 * emph)), 0, Math.PI * 2);
        ctx!.fill();
      }

      // Focus Ring
      if (focus) {
        ctx!.beginPath();
        ctx!.arc(focus.x, focus.y, focus.r + RING_GAP, 0, Math.PI * 2);
        ctx!.strokeStyle = rgba(mark, 1);
        ctx!.lineWidth = RING_WIDTH;
        ctx!.stroke();
      }

      // Ranked labels
      interface RankedLabel {
        s: ProjectedShot;
        rank: number;
      }
      const ranked: RankedLabel[] = [];
      for (let m = 0; m < shots.length; m++) {
        const sh = shots[m];
        const rank = sh.i === hover ? 3 : kin[sh.i] ? 2 : Math.min(1, sh.r / (26 * DOT_SCALE));
        if (rank > 0.12) ranked.push({ s: sh, rank });
      }
      ranked.sort((a, b) => b.rank - a.rank || a.s.ndc - b.s.ndc);
      const topLabels = ranked.slice(0, MAX_LABELS);
      const taken: { x: number; y: number; w: number; h: number }[] = [];
      ctx!.textBaseline = "alphabetic";

      for (let m = 0; m < topLabels.length; m++) {
        const sp = topLabels[m].s;
        const rk = topLabels[m].rank;
        const pp = sp.p;
        const fs = Math.max(9, Math.min(12.5, 9 + pp.weight * 4)) * Math.max(0.78, Math.min(1, H / 500));
        const font = `500 ${fs.toFixed(1)}px ui-monospace, "SF Mono", Menlo, "Sarabun", monospace`;
        const text = pp.name.length > 28 ? `${pp.name.slice(0, 27)}…` : pp.name;
        const key = `${fs.toFixed(1)}|${text}`;
        let w = widths[key];
        if (w === undefined) {
          ctx!.font = font;
          w = ctx!.measureText(text).width + text.length * 0.8;
          widths[key] = w;
        }
        const ly = sp.y - sp.r - 7;
        const box = { x: sp.x - w / 2, y: ly - fs, w, h: fs + 3 };
        if (box.y < 4 || box.y > H - 4) continue;
        let shift = Math.min(0, W - 4 - (box.x + w)) || Math.max(0, 4 - box.x);
        if (Math.abs(shift) > w * 0.5) shift = 0;
        box.x += shift;

        let clash = false;
        for (let t3 = 0; t3 < taken.length; t3++) {
          const T = taken[t3];
          if (box.x < T.x + T.w + 6 && T.x < box.x + box.w + 6 && box.y < T.y + T.h + 3 && T.y < box.y + box.h + 3) {
            clash = true;
            break;
          }
        }
        if (clash && rk < 2) continue;
        taken.push(box);

        const depth = Math.max(0.3, Math.min(1, 1.25 - sp.ndc));
        const aside = focus && rk < 2 ? ASIDE + 0.14 : 1;
        ctx!.font = font;
        ctx!.fillStyle =
          rk === 3
            ? rgba(ink, 0.95)
            : rk >= 2
            ? rgba(ink, Math.max(0.62, 0.8 * depth))
            : rgba(ink, 0.5 * depth * aside);
        ctx!.fillText(text, box.x, ly);
      }
    }

    let prev: number | null = null;
    let animId: number;
    let isVisible = true;

    function loop(ts: number) {
      if (!isVisible) return;
      animId = requestAnimationFrame(loop);
      if (!resize()) return;
      const dt = prev === null ? 0 : Math.min(0.1, (ts - prev) / 1000);
      prev = ts;
      if (++colorAge > 30) {
        colorAge = 0;
        readColors();
      }
      grow += (1 - grow) * (1 - Math.exp(-GROW_RATE * dt));
      beat = (beat + dt * BEAT_RATE) % 1;
      if (!reduce && !dragging && hover === null) az += IDLE_SPIN * dt;
      project();
      draw();
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        animId = requestAnimationFrame(loop);
      }
    }, { threshold: 0.05 });

    observer.observe(cv);
    animId = requestAnimationFrame(loop);

    // Pointer events for interactive 3D drag & hover
    function pick(e: PointerEvent | MouseEvent) {
      const b = cv!.getBoundingClientRect();
      const mx = e.clientX - b.left;
      const my = e.clientY - b.top;
      let best: number | null = null;
      let bz = Infinity;
      for (let m = 0; m < shots.length; m++) {
        const s = shots[m];
        const reach = Math.max(11, s.r * 1.3);
        if (Math.hypot(s.x - mx, s.y - my) <= reach && s.ndc < bz) {
          bz = s.ndc;
          best = s.i;
        }
      }
      return best;
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      last = { x: e.clientX, y: e.clientY };
      cv.classList.add("dragging");
      cv.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging && last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        az -= (dx * 2 * Math.PI) / Math.max(1, H);
        tilt = Math.max(-1.2, Math.min(1.2, tilt + (dy * 2 * Math.PI) / Math.max(1, H)));
        last = { x: e.clientX, y: e.clientY };
        return;
      }
      hover = pick(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging) {
        dragging = false;
        last = null;
        cv.classList.remove("dragging");
      }
      if (moved <= 6) hover = pick(e);
    };

    const onPointerLeave = () => {
      hover = null;
      dragging = false;
      last = null;
      cv.classList.remove("dragging");
    };

    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);
    cv.addEventListener("pointerleave", onPointerLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerup", onPointerUp);
      cv.removeEventListener("pointercancel", onPointerUp);
      cv.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="orbit"
      role="img"
      aria-label="ผังทักษะแห่งอนาคต 28 ด้านที่เชื่อมโยงกัน หมุนช้า ๆ และสามารถลากหมุนได้"
    />
  );
}
