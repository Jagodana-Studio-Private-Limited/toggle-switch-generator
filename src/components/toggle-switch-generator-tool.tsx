"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolEvents } from "@/lib/analytics";

type Size = "sm" | "md" | "lg";
type Shape = "pill" | "rounded" | "square";
type Speed = "none" | "fast" | "normal" | "slow";

interface Config {
  size: Size;
  shape: Shape;
  speed: Speed;
  onColor: string;
  offColor: string;
  knobColor: string;
  checked: boolean;
}

const SIZES: Record<Size, { width: number; height: number; knob: number; pad: number }> = {
  sm: { width: 44, height: 24, knob: 16, pad: 4 },
  md: { width: 60, height: 32, knob: 24, pad: 4 },
  lg: { width: 80, height: 44, knob: 36, pad: 4 },
};

const SPEEDS: Record<Speed, number> = {
  none: 0,
  fast: 150,
  normal: 300,
  slow: 600,
};

const SHAPES: Record<Shape, string> = {
  pill: "9999px",
  rounded: "8px",
  square: "2px",
};

const KNOB_RADII: Record<Shape, string> = {
  pill: "50%",
  rounded: "4px",
  square: "1px",
};

const DEFAULT_CONFIG: Config = {
  size: "md",
  shape: "pill",
  speed: "normal",
  onColor: "#3b82f6",
  offColor: "#d1d5db",
  knobColor: "#ffffff",
  checked: true,
};

function getTranslateX(size: Size): number {
  const s = SIZES[size];
  return s.width - s.knob - s.pad * 2;
}

function generateCSS(cfg: Config): string {
  const s = SIZES[cfg.size];
  const radius = SHAPES[cfg.shape];
  const knobRadius = KNOB_RADII[cfg.shape];
  const ms = SPEEDS[cfg.speed];
  const tx = getTranslateX(cfg.size);

  return `.toggle-switch {
  position: relative;
  display: inline-block;
  width: ${s.width}px;
  height: ${s.height}px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: ${cfg.offColor};
  border-radius: ${radius};
  transition: background-color ${ms}ms ease;
}

.toggle-slider::before {
  position: absolute;
  content: "";
  width: ${s.knob}px;
  height: ${s.knob}px;
  left: ${s.pad}px;
  top: ${s.pad}px;
  background-color: ${cfg.knobColor};
  border-radius: ${knobRadius};
  transition: transform ${ms}ms ease;
}

input:checked + .toggle-slider {
  background-color: ${cfg.onColor};
}

input:checked + .toggle-slider::before {
  transform: translateX(${tx}px);
}

input:focus-visible + .toggle-slider {
  outline: 2px solid ${cfg.onColor};
  outline-offset: 2px;
}`;
}

function generateHTML(): string {
  return `<label class="toggle-switch" aria-label="Toggle">
  <input type="checkbox">
  <span class="toggle-slider"></span>
</label>`;
}

function generateReact(cfg: Config): string {
  const s = SIZES[cfg.size];
  const radius = SHAPES[cfg.shape];
  const knobRadius = KNOB_RADII[cfg.shape];
  const ms = SPEEDS[cfg.speed];
  const tx = getTranslateX(cfg.size);

  return `import { useState } from "react";

const styles = {
  wrapper: {
    position: "relative" as const,
    display: "inline-block",
    width: ${s.width},
    height: ${s.height},
  },
  input: {
    opacity: 0,
    width: 0,
    height: 0,
    position: "absolute" as const,
  },
  slider: (on: boolean) => ({
    position: "absolute" as const,
    cursor: "pointer",
    inset: 0,
    backgroundColor: on ? "${cfg.onColor}" : "${cfg.offColor}",
    borderRadius: "${radius}",
    transition: "background-color ${ms}ms ease",
  }),
  knob: (on: boolean) => ({
    position: "absolute" as const,
    width: ${s.knob},
    height: ${s.knob},
    left: ${s.pad},
    top: ${s.pad},
    backgroundColor: "${cfg.knobColor}",
    borderRadius: "${knobRadius}",
    transition: "transform ${ms}ms ease",
    transform: on ? "translateX(${tx}px)" : "translateX(0)",
  }),
};

export function ToggleSwitch() {
  const [on, setOn] = useState(false);

  return (
    <label style={styles.wrapper} aria-label="Toggle">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        style={styles.input}
      />
      <span style={styles.slider(on)}>
        <span style={styles.knob(on)} />
      </span>
    </label>
  );
}`;
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border/60 flex-shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            aria-label={label}
          />
          <div className="w-full h-full rounded-lg" style={{ backgroundColor: value }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="flex-1 h-9 px-3 rounded-lg border border-border/60 bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand/50"
          maxLength={7}
          aria-label={`${label} hex input`}
        />
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex rounded-lg border border-border/60 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-brand text-white"
                : "bg-background text-muted-foreground hover:bg-muted/50"
            }`}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : `Copy ${label}`}
    </Button>
  );
}

export function ToggleSwitchGeneratorTool() {
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);

  const update = useCallback(<K extends keyof Config>(key: K, val: Config[K]) => {
    setCfg((prev) => ({ ...prev, [key]: val }));
    ToolEvents.toolUsed("configure");
  }, []);

  const reset = useCallback(() => {
    setCfg(DEFAULT_CONFIG);
  }, []);

  const s = SIZES[cfg.size];
  const radius = SHAPES[cfg.shape];
  const knobRadius = KNOB_RADII[cfg.shape];
  const ms = SPEEDS[cfg.speed];
  const tx = getTranslateX(cfg.size);

  const css = generateCSS(cfg);
  const html = generateHTML();
  const react = generateReact(cfg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="grid lg:grid-cols-[340px_1fr]">
          {/* Controls Panel */}
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/20 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Customize</h2>
              <button
                onClick={reset}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Reset to defaults"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <SegmentedControl
              label="Size"
              value={cfg.size}
              onChange={(v) => update("size", v)}
              options={[
                { value: "sm", label: "SM" },
                { value: "md", label: "MD" },
                { value: "lg", label: "LG" },
              ]}
            />

            <SegmentedControl
              label="Shape"
              value={cfg.shape}
              onChange={(v) => update("shape", v)}
              options={[
                { value: "pill", label: "Pill" },
                { value: "rounded", label: "Round" },
                { value: "square", label: "Square" },
              ]}
            />

            <SegmentedControl
              label="Transition"
              value={cfg.speed}
              onChange={(v) => update("speed", v)}
              options={[
                { value: "none", label: "None" },
                { value: "fast", label: "Fast" },
                { value: "normal", label: "Normal" },
                { value: "slow", label: "Slow" },
              ]}
            />

            <ColorInput
              label="On Color"
              value={cfg.onColor}
              onChange={(v) => update("onColor", v)}
            />

            <ColorInput
              label="Off Color"
              value={cfg.offColor}
              onChange={(v) => update("offColor", v)}
            />

            <ColorInput
              label="Knob Color"
              value={cfg.knobColor}
              onChange={(v) => update("knobColor", v)}
            />
          </div>

          {/* Preview + Code Panel */}
          <div className="flex flex-col">
            {/* Preview */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 border-b border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Preview — click to toggle
              </p>
              <button
                aria-label={`Toggle switch — currently ${cfg.checked ? "on" : "off"}`}
                aria-pressed={cfg.checked}
                onClick={() => update("checked", !cfg.checked)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: s.width,
                    height: s.height,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: cfg.checked ? cfg.onColor : cfg.offColor,
                      borderRadius: radius,
                      transition: `background-color ${ms}ms ease`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: s.knob,
                        height: s.knob,
                        left: s.pad,
                        top: s.pad,
                        backgroundColor: cfg.knobColor,
                        borderRadius: knobRadius,
                        transition: `transform ${ms}ms ease`,
                        transform: cfg.checked ? `translateX(${tx}px)` : "translateX(0)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>
              </button>
              <p className="text-xs text-muted-foreground">
                State:{" "}
                <span
                  className="font-semibold"
                  style={{ color: cfg.checked ? cfg.onColor : undefined }}
                >
                  {cfg.checked ? "ON" : "OFF"}
                </span>
              </p>
            </div>

            {/* Code Tabs */}
            <div className="p-5">
              <Tabs defaultValue="css">
                <div className="flex items-center justify-between mb-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="css" className="text-xs px-3">CSS</TabsTrigger>
                    <TabsTrigger value="html" className="text-xs px-3">HTML</TabsTrigger>
                    <TabsTrigger value="react" className="text-xs px-3">React</TabsTrigger>
                  </TabsList>
                  <div>
                    <TabsContent value="css" className="mt-0">
                      <CopyButton text={css} label="CSS" />
                    </TabsContent>
                    <TabsContent value="html" className="mt-0">
                      <CopyButton text={`${html}\n\n<style>\n${css}\n</style>`} label="HTML" />
                    </TabsContent>
                    <TabsContent value="react" className="mt-0">
                      <CopyButton text={react} label="React" />
                    </TabsContent>
                  </div>
                </div>

                <TabsContent value="css" className="mt-0">
                  <pre className="rounded-lg bg-muted/60 border border-border/40 p-4 text-xs font-mono overflow-auto max-h-72 leading-relaxed whitespace-pre text-foreground/80">
                    {css}
                  </pre>
                </TabsContent>

                <TabsContent value="html" className="mt-0">
                  <pre className="rounded-lg bg-muted/60 border border-border/40 p-4 text-xs font-mono overflow-auto max-h-72 leading-relaxed whitespace-pre text-foreground/80">
                    {html}
                    {"\n\n"}
                    {"<style>\n"}
                    {css}
                    {"\n</style>"}
                  </pre>
                </TabsContent>

                <TabsContent value="react" className="mt-0">
                  <pre className="rounded-lg bg-muted/60 border border-border/40 p-4 text-xs font-mono overflow-auto max-h-72 leading-relaxed whitespace-pre text-foreground/80">
                    {react}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
