import { ECPProtocol } from "../types";

function renderInfoTile(icon: string, label: string, value: string): string {
  return `
    <div class="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
      <div class="text-xs text-white/60 mb-1">${icon} ${label}</div>
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

  return `
    <div class="bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 text-white">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg">⚡</div>
              <div>
                <h1 class="text-2xl font-bold tracking-tight">${protocol.protocol}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">${protocol.version}</span>
                  <span class="text-xs text-white/60">OAS Multi-Channel Extension</span>
                </div>
              </div>
            </div>
            <p class="text-white/75 text-sm leading-relaxed max-w-lg">Unified entity communication protocol with REST, WebSocket, gRPC, and MCP channels. All channels share the same entity schema and authentication model.</p>
            <div class="flex flex-wrap gap-3 mt-4">
              ${renderChannelLegendPill("bg-blue-400",   "REST")}
              ${renderChannelLegendPill("bg-purple-400", "WebSocket")}
              ${renderChannelLegendPill("bg-orange-400", "gRPC")}
              ${renderChannelLegendPill("bg-teal-400",   "MCP")}
            </div>
          </div>
          <div class="flex flex-col items-end gap-3">
            <div class="flex gap-4 text-center">
              <div class="bg-white/10 rounded-xl px-4 py-3 min-w-[80px]">
                <div class="text-3xl font-bold">${totalEntities}</div>
                <div class="text-xs text-white/60 mt-0.5">Entities</div>
              </div>
              <div class="bg-white/10 rounded-xl px-4 py-3 min-w-[80px]">
                <div class="text-3xl font-bold">${totalChannels}</div>
                <div class="text-xs text-white/60 mt-0.5">Channels</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          ${renderInfoTile("🔐", "Auth Headers", protocol.defaults.requiredHeaders.join(" + "))}
          ${renderInfoTile("🔑", "Hashing", protocol.defaults.hashing.algorithm + " → " + protocol.defaults.hashing.secretRef)}
          ${renderInfoTile("⏱",  "Lease Mode", protocol.defaults.lease.mode)}
          ${renderInfoTile("📊", "Observability", protocol.defaults.observability.enabled ? "Enabled (SSE + NDJSON)" : "Disabled")}
        </div>
      </div>
    </div>
  `;
}
