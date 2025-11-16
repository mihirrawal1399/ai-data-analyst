import * as fs from "fs";
import * as path from "path";

const STORAGE_ROOT = process.env.STORAGE_ROOT || path.resolve(process.cwd(), "data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function saveText(relativePath: string, content: string) {
  const fullPath = path.resolve(STORAGE_ROOT, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf8");
  return fullPath;
}

export function saveJSON<T>(relativePath: string, data: T) {
  const fullPath = path.resolve(STORAGE_ROOT, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
  return fullPath;
}

export function readText(relativePath: string) {
  const fullPath = path.resolve(STORAGE_ROOT, relativePath);
  return fs.readFileSync(fullPath, "utf8");
}

export function readJSON<T>(relativePath: string): T {
  const fullPath = path.resolve(STORAGE_ROOT, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

export function getStorageRoot() {
  ensureDir(STORAGE_ROOT);
  return STORAGE_ROOT;
}