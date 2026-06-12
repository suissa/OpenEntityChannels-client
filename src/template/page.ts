import { ECPProtocol } from "../types";
import { renderPageHeader } from "./header";
import { renderEntityCard } from "./entity";
import { generateEmbeddedClientJavaScript } from "./scripts";

function renderSidebarEntityLink(entityName: string): string {
  const entityId = entityName.toLowerCase();
  return `
    <li>
      <button onclick="scrollToEntityAndExpandIfClosed('${entityId}')"
        class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2 group">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform">${entityName.charAt(0)}</div>
        <span class="truncate">${entityName}</span>
      </button>
    </li>
  `;
}

function renderSidebar(entities: Record<string, unknown>): string {
  const entityLinks = Object.keys(entities).map(renderSidebarEntityLink).join("");
  return `
    <aside class="w-64 flex-shrink-0 hidden lg:block">
      <div class="sticky top-16">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Entities</div>
          <ul class="space-y-0.5">${entityLinks}</ul>
          <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button onclick="expandAllEntityCards()" class="px-2 py-1.5 text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-gray-600 font-medium">Expand All</button>
            <button onclick="collapseAllEntityCards()" class="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium">Collapse All</button>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderTopNavigationBar(protocol: ECPProtocol): string {
  return `
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-base font-bold text-indigo-700">${protocol.protocol}</span>
          <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-mono">${protocol.version}</span>
        </div>
        <div class="flex-1 max-w-xs">
          <input type="text" placeholder="Search entities..." oninput="filterEntitiesBySearchTerm(this.value)"
            class="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
        </div>
        <div class="hidden md:flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
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
  <title>${protocol.protocol} — Interface Explorer v${protocol.version}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <style>
    .entity-card       { transition: box-shadow 0.2s ease; }
    .entity-card:hover { box-shadow: 0 4px 24px rgba(99,102,241,0.10); }
    pre                { white-space: pre-wrap; word-break: break-all; }
    ::-webkit-scrollbar       { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #818cf8; }
    .animate__animated { animation-duration: 0.4s; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen text-gray-900">
  ${renderTopNavigationBar(protocol)}
  ${renderPageHeader(protocol)}
  <div class="max-w-6xl mx-auto px-4 md:px-6 py-6 flex gap-6">
    ${renderSidebar(protocol.entities)}
    <main class="flex-1 min-w-0">${allEntityCardsHTML}</main>
  </div>
  <footer class="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-gray-400 border-t border-gray-200 mt-4">
    ${protocol.protocol} v${protocol.version} — EntityCommunicationProtocol Interface Explorer
  </footer>
  <script>${generateEmbeddedClientJavaScript()}</script>
</body>
</html>`;
}
