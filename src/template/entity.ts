import { Entity } from "../types";
import { renderRestChannelSection }      from "./channels/rest";
import { renderWebSocketChannelSection } from "./channels/websocket";
import { renderGrpcChannelSection }      from "./channels/grpc";
import { renderMcpChannelSection }       from "./channels/mcp";

const CHANNEL_DISPLAY_ORDER = ["rest", "websocket", "grpc", "mcp"] as const;

const CHANNEL_TAB_ACTIVE_CLASSES: Record<string, string> = {
  rest:      "border-b-2 border-blue-500   text-blue-600",
  websocket: "border-b-2 border-purple-500 text-purple-600",
  grpc:      "border-b-2 border-orange-500 text-orange-600",
  mcp:       "border-b-2 border-teal-500   text-teal-600",
};

const CHANNEL_BADGE_COLORS: Record<string, string> = {
  rest:      "bg-blue-100   text-blue-700",
  websocket: "bg-purple-100 text-purple-700",
  grpc:      "bg-orange-100 text-orange-700",
  mcp:       "bg-teal-100   text-teal-700",
};

const CHANNEL_DISPLAY_LABELS: Record<string, string> = {
  rest: "REST", websocket: "WS", grpc: "gRPC", mcp: "MCP",
};

const CHANNEL_TAB_ICONS: Record<string, string> = {
  rest: "🌐", websocket: "⚡", grpc: "🔌", mcp: "🤖",
};

function resolveEnabledChannelsInDisplayOrder(entity: Entity): string[] {
  return CHANNEL_DISPLAY_ORDER.filter(type => entity.channels[type]?.enabled);
}

function renderChannelTabButton(channelType: string, entityId: string, isFirstTab: boolean): string {
  const label = channelType === "websocket" ? "WebSocket" : channelType === "grpc" ? "gRPC" : channelType === "mcp" ? "MCP" : "REST";
  const icon  = CHANNEL_TAB_ICONS[channelType] ?? "•";
  const activeClass = isFirstTab ? CHANNEL_TAB_ACTIVE_CLASSES[channelType] : "text-gray-500";
  return `
    <button class="px-4 py-2.5 text-sm font-medium transition-all channel-tab-btn ${activeClass}"
            id="tab-btn-${entityId}-${channelType}"
            onclick="switchToChannelTab('${entityId}', '${channelType}')">
      ${icon} ${label}
    </button>
  `;
}

function renderChannelContentPanel(channelType: string, entityName: string, entity: Entity, isFirstTab: boolean): string {
  const ch = entity.channels;
  let channelHTML = "";
  if (channelType === "rest"      && ch.rest)      channelHTML = renderRestChannelSection(entityName, ch.rest);
  if (channelType === "websocket" && ch.websocket) channelHTML = renderWebSocketChannelSection(entityName, ch.websocket);
  if (channelType === "grpc"      && ch.grpc)      channelHTML = renderGrpcChannelSection(entityName, ch.grpc, ch.rest?.routes.map(r => r.name) ?? []);
  if (channelType === "mcp"       && ch.mcp)       channelHTML = renderMcpChannelSection(entityName, ch.mcp);
  return `<div id="tab-${entityName.toLowerCase()}-${channelType}" class="channel-tab-content ${isFirstTab ? "" : "hidden"} p-5">${channelHTML}</div>`;
}

function renderEntityChannelBadges(enabledChannels: string[]): string {
  return enabledChannels.map(type => {
    const label  = CHANNEL_DISPLAY_LABELS[type] ?? type;
    const colors = CHANNEL_BADGE_COLORS[type]   ?? "bg-gray-100 text-gray-600";
    return `<span class="text-xs px-2 py-0.5 rounded-full font-semibold ${colors}">${label}</span>`;
  }).join("");
}

export function renderEntityCard(entityName: string, entity: Entity): string {
  const entityId        = entityName.toLowerCase();
  const enabledChannels = resolveEnabledChannelsInDisplayOrder(entity);
  const tabButtonsHTML  = enabledChannels.map((type, i) => renderChannelTabButton(type, entityId, i === 0)).join("");
  const channelPanelsHTML = enabledChannels.map((type, i) => renderChannelContentPanel(type, entityName, entity, i === 0)).join("");
  return `
    <div class="entity-card bg-white rounded-2xl shadow-sm border border-slate-200 mb-4 overflow-hidden animate__animated animate__fadeInUp" id="entity-${entityId}">
      <div class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
           onclick="toggleEntityCardOpenOrClosed('${entityId}')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">${entityName.charAt(0)}</div>
          <div>
            <div class="flex items-center gap-2"><h3 class="font-semibold text-slate-800">${entityName}</h3><span class="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">active</span></div>
            <div class="text-xs text-slate-400 font-mono mt-1">${entity.idField} · ${entity.schemaRef}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex gap-1 flex-wrap justify-end">${renderEntityChannelBadges(enabledChannels)}</div>
          <svg id="entity-chevron-${entityId}" class="w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      <div id="entity-body-${entityId}" class="hidden border-t border-slate-100">
        <div class="flex border-b border-slate-200 bg-slate-50 px-2 overflow-x-auto">${tabButtonsHTML}</div>
        ${channelPanelsHTML}
      </div>
    </div>
  `;
}
