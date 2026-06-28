import { McpChannel } from "../../types";

function renderMcpToolSchemaAsJson(channel: McpChannel, entityName: string): string {
  const schema = {
    name: channel.name,
    description: `Entity channel for ${entityName} — multi-channel gateway`,
    visibility: channel.visibility,
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["receivePayload", "getCurrentState"],
          description: "Operation to perform on the entity",
        },
        hash: {
          type: "string",
          description: "Entity instance hash (route identifier)",
        },
        payload: {
          type: "object",
          description: "Operation payload (required for write operations)",
        },
      },
      required: ["action", "hash"],
    },
  };
  return JSON.stringify(schema, null, 2);
}

function renderMcpUsageExample(channel: McpChannel): string {
  return `use_mcp_tool("${channel.name}", {
  "action": "getCurrentState",
  "hash": "{entity-instance-hash}"
});`;
}

function renderVisibilityBadge(visibility: string): string {
  const isInternal = visibility === "internal";
  const colorClass = isInternal
    ? "bg-gray-800 text-gray-400 border-gray-700"
    : "bg-teal-500/10 text-teal-400 border-teal-500/30";
  const icon = isInternal ? "🔒" : "🌐";
  return `<span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}">${icon} ${visibility}</span>`;
}

export function renderMcpChannelSection(entityName: string, channel: McpChannel): string {
  const mcpId = `mcp-${entityName.toLowerCase()}`;

  return `
    <div id="${mcpId}">
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div class="w-1.5 h-1.5 rounded-full ${channel.enabled ? "bg-teal-400" : "bg-gray-600"}"></div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">MCP Tool</span>
        <code class="text-xs font-mono text-gray-600 bg-gray-800 px-2 py-0.5 rounded">${channel.name}</code>
        ${renderVisibilityBadge(channel.visibility)}
      </div>

      <div class="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-xs text-teal-500 font-bold uppercase tracking-wide block mb-1">Tool Name</span>
            <code class="font-mono text-teal-300">${channel.name}</code>
          </div>
          <div>
            <span class="text-xs text-teal-500 font-bold uppercase tracking-wide block mb-1">Visibility</span>
            <code class="font-mono text-teal-300">${channel.visibility}</code>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">Tool Definition (JSON Schema)</span>
          <button onclick="copyTextToClipboard('mcp-schema-${mcpId}')"
            class="text-xs text-gray-700 hover:text-gray-400 transition-colors">Copy</button>
        </div>
        <pre id="mcp-schema-${mcpId}" class="bg-[#080b11] border border-gray-800 text-teal-300 p-4 rounded-xl text-xs font-mono overflow-auto leading-relaxed">${renderMcpToolSchemaAsJson(channel, entityName)}</pre>
      </div>

      <div class="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
        <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">Usage in Claude / AI Agent</span>
        <pre class="mt-2 bg-[#080b11] border border-gray-800 text-teal-300 p-3 rounded-lg text-xs font-mono overflow-auto leading-relaxed">${renderMcpUsageExample(channel)}</pre>
      </div>
    </div>
  `;
}
