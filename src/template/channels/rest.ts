import { RestChannel, RestRoute } from "../../types";
import { resolveFullRoutePath } from "../../parser";

const HTTP_METHOD_BADGE_COLORS: Record<string, string> = {
  GET:    "bg-emerald-100 text-emerald-800 border-emerald-300",
  POST:   "bg-blue-100    text-blue-800    border-blue-300",
  PUT:    "bg-amber-100   text-amber-800   border-amber-300",
  PATCH:  "bg-cyan-100    text-cyan-800    border-cyan-300",
  DELETE: "bg-red-100     text-red-800     border-red-300",
};

const HTTP_METHOD_ROW_COLORS: Record<string, string> = {
  GET:    "border-emerald-400 bg-emerald-50",
  POST:   "border-blue-400   bg-blue-50",
  PUT:    "border-amber-400  bg-amber-50",
  PATCH:  "border-cyan-400   bg-cyan-50",
  DELETE: "border-red-400    bg-red-50",
};

function buildRouteUniqueId(entityName: string, routeName: string): string {
  return `${entityName}-${routeName}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function renderHttpMethodBadge(method: string): string {
  const colorClass = HTTP_METHOD_BADGE_COLORS[method] ?? "bg-gray-100 text-gray-800 border-gray-300";
  return `<span class="inline-block font-bold text-xs px-2 py-1 rounded border ${colorClass} w-16 text-center tracking-wide">${method}</span>`;
}

function renderRequestBodyFieldWhenMethodAllowsBody(routeId: string, method: string): string {
  if (["GET", "DELETE"].includes(method)) return "";
  return `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-600 mb-1">Request Body (JSON)</label>
      <textarea rows="6" placeholder="{}" id="body-${routeId}"
        class="w-full border rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-300 focus:outline-none"></textarea>
    </div>
  `;
}

function renderTryItOutForm(entityName: string, route: RestRoute, channel: RestChannel): string {
  const routeId  = buildRouteUniqueId(entityName, route.name);
  const fullPath = resolveFullRoutePath(channel.base, route.path);
  return `
    <div id="tryit-${routeId}" class="hidden mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h4 class="font-semibold text-gray-700 mb-4">Try it out</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Base URL</label>
          <input type="text" value="http://localhost:${channel.port}" id="baseurl-${routeId}"
            class="w-full border rounded px-3 py-2 text-sm font-mono bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Path</label>
          <input type="text" value="${fullPath}" id="path-${routeId}"
            class="w-full border rounded px-3 py-2 text-sm font-mono bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">X-API-KEY</label>
          <input type="text" placeholder="Enter API key" id="apikey-${routeId}"
            class="w-full border rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-300 focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">X-DPOP-TOKEN</label>
          <input type="text" placeholder="Enter DPoP token" id="dpop-${routeId}"
            class="w-full border rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-300 focus:outline-none" />
        </div>
      </div>
      ${renderRequestBodyFieldWhenMethodAllowsBody(routeId, route.method)}
      <div class="flex gap-2">
        <button onclick="executeRestRequestAndDisplayResponse('${routeId}', '${route.method}')"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Execute</button>
        <button onclick="clearRestResponsePanel('${routeId}')"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">Clear</button>
      </div>
      <div id="response-${routeId}" class="hidden mt-4">
        <h5 class="font-semibold text-gray-700 mb-2">Response</h5>
        <div id="response-status-${routeId}" class="mb-2 text-sm font-mono font-bold"></div>
        <div class="relative">
          <pre id="response-body-${routeId}" class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-72 font-mono leading-relaxed"></pre>
          <button onclick="copyTextToClipboard('response-body-${routeId}')"
            class="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600">Copy</button>
        </div>
      </div>
    </div>
  `;
}

function renderRestRouteRow(entityName: string, route: RestRoute, channel: RestChannel): string {
  const routeId   = buildRouteUniqueId(entityName, route.name);
  const fullPath  = resolveFullRoutePath(channel.base, route.path);
  const rowColors = HTTP_METHOD_ROW_COLORS[route.method] ?? "border-gray-400 bg-gray-50";
  return `
    <div class="border-l-4 ${rowColors} mb-2 rounded-r-lg overflow-hidden shadow-sm">
      <div class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:brightness-95 transition-all select-none"
           onclick="toggleRestRouteDetails('${routeId}')">
        ${renderHttpMethodBadge(route.method)}
        <span class="font-mono text-sm text-gray-700 flex-1">${fullPath}</span>
        <span class="text-gray-400 text-xs italic hidden md:block">${route.name}</span>
        <svg id="chevron-${routeId}" class="w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      <div id="route-detail-${routeId}" class="hidden px-4 pb-4 border-t border-black/5">
        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 mb-3">
          <div class="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>Port: <code class="bg-white border rounded px-1 font-mono">${channel.port}</code></span>
            <span>Op: <code class="bg-white border rounded px-1 font-mono">${route.name}</code></span>
            <span>Headers: <code class="bg-white border rounded px-1 font-mono">X-API-KEY</code> <code class="bg-white border rounded px-1 font-mono">X-DPOP-TOKEN</code></span>
          </div>
          <button onclick="toggleTryItOutVisibility('${routeId}')"
            class="px-3 py-1.5 border border-gray-400 rounded-lg text-xs text-gray-600 hover:bg-gray-100 font-medium">Try it out</button>
        </div>
        ${renderTryItOutForm(entityName, route, channel)}
      </div>
    </div>
  `;
}

export function renderRestChannelSection(entityName: string, channel: RestChannel): string {
  const allRoutesHTML = channel.routes.map(r => renderRestRouteRow(entityName, r, channel)).join("");
  return `
    <div id="rest-${entityName.toLowerCase()}">
      <div class="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
        <div class="w-2 h-2 rounded-full ${channel.enabled ? "bg-emerald-400" : "bg-gray-400"}"></div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">REST</span>
        <span class="text-xs text-gray-400">Port ${channel.port}</span>
        <code class="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${channel.base}</code>
        <span class="ml-auto text-xs text-gray-400">${channel.routes.length} routes</span>
      </div>
      ${allRoutesHTML}
    </div>
  `;
}
