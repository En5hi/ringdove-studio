#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_CANDIDATES = [
  process.env.UNICORN_SOURCE ?? "ringdove-gradient-1.json",
  "flow_gradient.json"
];
const OUTPUT_DIR = path.resolve("public/unicorn");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "flow_gradient.bg.json");
const NON_EFFECT_TYPES = new Set(["text", "ui", "html", "image", "group"]);

const exitWithError = (message, error) => {
  console.error(`[unicorn] ${message}`);
  if (error) console.error(error);
  process.exit(1);
};

const resolveSourcePath = async () => {
  for (const name of SOURCE_CANDIDATES) {
    const candidate = path.resolve("assets/unicorn", name);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // continue
    }
  }
  exitWithError(
    `Source JSON not found. Looked for: ${SOURCE_CANDIDATES.map(
      (n) => `assets/unicorn/${n}`
    ).join(", ")}`
  );
};

const loadSource = async () => {
  const sourcePath = await resolveSourcePath();

  try {
    const raw = await readFile(sourcePath, "utf8");
    return { data: JSON.parse(raw), path: sourcePath };
  } catch (error) {
    exitWithError("Failed to read or parse source JSON", error);
  }
};

const normalizeLayers = (source) => {
  if (Array.isArray(source.layers)) return { layers: source.layers, key: "layers" };
  if (Array.isArray(source.history)) return { layers: source.history, key: "history" };
  return { layers: null, key: null };
};

const filterLayers = (layers) =>
  layers.filter((layer) => {
    if (!layer || typeof layer !== "object") return false;
    const type = typeof layer.layerType === "string" ? layer.layerType.toLowerCase() : "";
    return !NON_EFFECT_TYPES.has(type);
  });

const main = async () => {
  const { data: source, path: sourcePath } = await loadSource();
  const { layers: rawLayers, key } = normalizeLayers(source);
  if (!rawLayers) {
    exitWithError("Source JSON does not contain a layers/history array");
  }

  const filteredLayers = filterLayers(rawLayers);
  const removedCount = rawLayers.length - filteredLayers.length;

  if (filteredLayers.length === 0) {
    exitWithError("No effect layers remain after filtering; check the source export");
  }

  const output = {
    ...source,
    layers: filteredLayers,
    history: key === "history" ? filteredLayers : source.history
  };

  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(
      `[unicorn] wrote ${OUTPUT_PATH} from ${sourcePath} (${filteredLayers.length} layers, removed ${removedCount})`
    );
  } catch (error) {
    exitWithError("Failed to write processed Unicorn background JSON", error);
  }
};

main();
