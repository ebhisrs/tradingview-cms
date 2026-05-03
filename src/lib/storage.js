import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

// Default home page data (bundled with the build)
const DEFAULT_HOME = {
  slug: 'home', title: 'Home', lang: 'en',
  sections: [
    {id:'hero-1',type:'hero',enabled:true,order:0,data:{backgroundImage:'/space-desktop.webp',showSupport:true}},
    {id:'ticker-1',type:'ticker',enabled:true,order:1,data:{}},
    {id:'where-1',type:'whereWorld',enabled:true,order:2,data:{}},
    {id:'market-1',type:'marketSummary',enabled:true,order:3,data:{}},
    {id:'ideas-1',type:'communityIdeas',enabled:true,order:4,data:{}},
    {id:'features-1',type:'features',enabled:true,order:5,data:{}},
    {id:'stats-1',type:'stats',enabled:true,order:6,data:{}},
    {id:'plans-1',type:'plans',enabled:true,order:7,data:{}},
    {id:'brokers-1',type:'brokers',enabled:true,order:8,data:{}},
    {id:'app-1',type:'app',enabled:true,order:9,data:{}},
    {id:'footer-1',type:'footer',enabled:true,order:10,data:{}},
  ],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

function canWriteFS() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    return true;
  } catch { return false; }
}

function readFromFile() {
  try {
    if (fs.existsSync(PAGES_FILE)) {
      return JSON.parse(fs.readFileSync(PAGES_FILE, 'utf-8'));
    }
  } catch {}
  return null;
}

function writeToFile(pages) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return true;
  } catch { return false; }
}

// In-memory fallback for read-only filesystems (Vercel)
let memoryPages = null;

function getPages() {
  if (memoryPages) return memoryPages;
  const fromFile = readFromFile();
  if (fromFile) { memoryPages = fromFile; return fromFile; }
  memoryPages = [DEFAULT_HOME];
  return memoryPages;
}

function setPages(pages) {
  memoryPages = pages;
  writeToFile(pages); // best-effort write, ok if it fails on Vercel
}

export function getAllPages() {
  return getPages();
}

export function getPage(slug) {
  return getPages().find(p => p.slug === slug) || null;
}

export function savePage(pageData) {
  const pages = [...getPages()];
  const idx = pages.findIndex(p => p.slug === pageData.slug);
  const now = new Date().toISOString();
  if (idx >= 0) {
    pages[idx] = { ...pages[idx], ...pageData, updatedAt: now };
  } else {
    pages.push({ ...pageData, createdAt: now, updatedAt: now });
  }
  setPages(pages);
  return pageData;
}

export function deletePage(slug) {
  setPages(getPages().filter(p => p.slug !== slug));
  return true;
}
