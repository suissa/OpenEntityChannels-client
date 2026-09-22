import { ECPProtocol } from "../types";

function renderInfoTile(icon: string, label: string, value: string): string {
  return `
    <div class="bg-white/[0.07] border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
      <div class="text-[10px] text-indigo-200/70 uppercase tracking-[0.16em] mb-2">${icon} ${label}</div>
      <div class="text-xs font-mono text-white font-semibold truncate" title="${value}">${value}</div>
    </div>
  `;
}

function renderChannelLegendPill(color: string, label: string): string {
  return `<span class="flex items-center gap-1 text-xs text-white/70">
    <span class="w-2 h-2 rounded-full ${color} inline-block"></span>${label}
  </span>`;
}

export function renderPageHeader(protocol: ECPProtocol): string {
  const totalEntities = Object.keys(protocol.entities).length;
  const totalChannels = Object.values(protocol.entities)
    .reduce((sum, e) => sum + Object.values(e.channels).filter(c => c?.enabled).length, 0);
  const totalRoutes = Object.values(protocol.entities)
    .reduce((sum, e) => sum + (e.channels.rest?.routes.length ?? 0), 0);

  return `
    <div class="bg-slate-950 text-white relative overflow-hidden grid-noise">
      <div class="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
      <div class="max-w-7xl mx-auto px-6 py-10 relative">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-indigo-500/20 border border-indigo-300/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg">◈</div>
              <div>
                <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-300 mb-1">Open Entity Channels</div>
                <h1 class="text-2xl font-bold tracking-tight">${protocol.protocol}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs bg-indigo-500/25 border border-indigo-300/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">${protocol.version}</span>
                  <span class="text-xs text-slate-400">Multi-channel entity contract</span>
                </div>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed max-w-xl">A single contract surface for REST, WebSocket, gRPC, and MCP entity channels. Inspect the shape, verify the route, and try a request without leaving the generated explorer.</p>
            <div class="flex flex-wrap gap-3 mt-4">
              ${renderChannelLegendPill("bg-blue-400",   "REST")}
              ${renderChannelLegendPill("bg-purple-400", "WebSocket")}
              ${renderChannelLegendPill("bg-orange-400", "gRPC")}
              ${renderChannelLegendPill("bg-teal-400",   "MCP")}
            </div>
          </div>
          <div class="flex flex-col items-end gap-3">
            <div class="flex gap-3 text-center">
              <div class="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 min-w-[82px]">
                <div class="text-3xl font-bold">${totalEntities}</div>
                <div class="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Entities</div>
              </div>
              <div class="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 min-w-[82px]">
                <div class="text-3xl font-bold">${totalChannels}</div>
                <div class="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Channels</div>
              </div>
              <div class="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 min-w-[82px]">
                <div class="text-3xl font-bold">${totalRoutes}</div>
                <div class="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Routes</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          ${renderInfoTile("01", "Auth headers", protocol.defaults.requiredHeaders.join(" + "))}
          ${renderInfoTile("02", "Route hashing", protocol.defaults.hashing.algorithm + " → " + protocol.defaults.hashing.secretRef)}
          ${renderInfoTile("03", "Lease policy", protocol.defaults.lease.mode)}
          ${renderInfoTile("04", "Observability", protocol.defaults.observability.enabled ? "SSE + NDJSON enabled" : "Disabled")}
        </div>
      </div>
    </div>
  `;
}
