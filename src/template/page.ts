import { ECPProtocol } from "../types";
import { renderPageHeader } from "./header";
import { renderEntityCard } from "./entity";
import { generateEmbeddedClientJavaScript } from "./scripts";

function renderSidebarEntityLink(entityName: string): string {
  const entityId = entityName.toLowerCase();
  return `
    <li>
      <button onclick="scrollToEntityAndExpandIfClosed('${entityId}')"
        class="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2 group">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">${entityName.charAt(0)}</div>
        <span class="truncate">${entityName}</span>
      </button>
    </li>
  `;
}

function renderSidebar(entities: Record<string, unknown>): string {
  const entityLinks = Object.keys(entities).map(renderSidebarEntityLink).join("");
  return `
    <aside class="w-64 flex-shrink-0 hidden lg:block">
      <div class="sticky top-24 space-y-3">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
          <div class="px-2 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Workspace</div>
          <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
            class="w-full text-left px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>Overview
          </button>
          <div class="px-2 pt-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Entities</div>
          <ul class="space-y-0.5">${entityLinks}</ul>
          <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button onclick="expandAllEntityCards()" class="px-2 py-1.5 text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-slate-600 font-medium">Expand all</button>
            <button onclick="collapseAllEntityCards()" class="px-2 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium">Collapse all</button>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm">
          <div class="flex items-center gap-2 text-xs font-semibold"><span class="h-2 w-2 rounded-full bg-emerald-400"></span>Local explorer</div>
          <p class="mt-2 text-xs leading-relaxed text-slate-400">Generated from the protocol file. Requests stay in your browser.</p>
        </div>
      </div>
    </aside>
  `;
}

function renderTopNavigationBar(protocol: ECPProtocol): string {
  return `
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="w-7 h-7 rounded-lg bg-slate-950 text-indigo-300 flex items-center justify-center text-sm font-bold">◈</span>
          <span class="text-sm font-bold tracking-tight text-slate-900">Entity Channels</span>
          <span class="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-mono">${protocol.version}</span>
        </div>
        <div class="flex-1 max-w-sm">
          <input type="text" placeholder="Search entities, routes, channels..." oninput="filterEntitiesBySearchTerm(this.value)"
            class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50 placeholder:text-slate-400" />
        </div>
        <div class="hidden md:flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex-shrink-0">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span>REST</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-purple-400"></span>WS</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span>gRPC</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-teal-400"></span>MCP</span>
        </div>
      </div>
    </nav>
  `;
}

export function generateFullPageHTML(protocol: ECPProtocol): string {
  const allEntityCardsHTML = Object.entries(protocol.entities).map(([name, entity]) => renderEntityCard(name, entity)).join("");
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${protocol.protocol} — Entity Channel Explorer v${protocol.version}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    :root { color-scheme: light; }
    body { font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif; }
    code, pre, .font-mono { font-family: "Space Mono", ui-monospace, SFMono-Regular, monospace; }
    .entity-card       { transition: box-shadow 0.2s ease; }
    .entity-card:hover { box-shadow: 0 12px 32px rgba(15,23,42,0.08); transform: translateY(-1px); }
    .entity-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    pre                { white-space: pre-wrap; word-break: break-all; }
    ::-webkit-scrollbar       { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #e2e8f0; }
    ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #818cf8; }
    .animate__animated { animation-duration: 0.4s; }
    .grid-noise { background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 24px 24px; }
  </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900">
  ${renderTopNavigationBar(protocol)}
  ${renderPageHeader(protocol)}
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 flex gap-6">
    ${renderSidebar(protocol.entities)}
    <main class="flex-1 min-w-0">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <div class="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Entity channels</div>
          <h2 class="mt-1 text-xl font-bold tracking-tight text-slate-900">Explore the contract surface</h2>
          <p class="mt-1 text-sm text-slate-500">Inspect routes, connect to streams, and exercise the protocol locally.</p>
        </div>
        <div class="text-xs text-slate-400 font-mono">${Object.keys(protocol.entities).length} entities loaded</div>
      </div>
      ${allEntityCardsHTML}
    </main>
  </div>
  <footer class="max-w-7xl mx-auto px-6 py-10 text-xs text-slate-400 border-t border-slate-200 mt-4 flex flex-col sm:flex-row justify-between gap-2">
    <span>${protocol.protocol} v${protocol.version} — Entity Channel Explorer</span>
    <span>Generated locally from openEntityChannels.json</span>
  </footer>
  <script>${generateEmbeddedClientJavaScript()}</script>
</body>
</html>`;
}
