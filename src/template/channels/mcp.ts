import { McpChannel } from "../../types";

function renderMcpToolSchemaAsJson(channel: McpChannel, entityName: string): string {
  const schema = {
    name: channel.name,
    description: `Entity channel for ${entityName} — multi-channel gateway`,
    visibility: channel.visibility,
    inputSchema: {
      type: "object",
      properties: {
        action:  { type: "string", enum: ["receivePayload", "getCurrentState"], description: "Operation to perform" },
        hash:    { type: "string", description: "Entity instance hash" },
        payload: { type: "object", description: "Operation payload (write operations)" },
      },
      required: ["action", "hash"],
    },
  };
  return JSON.stringify(schema, null, 2);
}

function renderMcpUsageExample(channel: McpChannel): string {
  return `use_mcp_tool("${channel.name}", {\n  "action": "getCurrentState",\n  "hash": "{entity-instance-hash}"\n});`;
}

function renderVisibilityBadge(visibility: string): string {
  const isInternal = visibility === "internal";
  const colorClass = isInternal ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-teal-100 text-teal-700 border-teal-300";
  return `<span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}">${isInternal ? "🔒" : "🌐"} ${visibility}</span>`;
}

export function renderMcpChannelSection(entityName: string, channel: McpChannel): string {
  const mcpId = `mcp-${entityName.toLowerCase()}`;
  return `
    <div id="${mcpId}">
      <div class="flex items-center gap-3 mb-4 pb-2 border-b border-teal-200">
        <div class="w-2 h-2 rounded-full ${channel.enabled ? "bg-teal-400" : "bg-gray-400"}"></div>
        <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">MCP Tool</span>
        <code class="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded">${channel.name}</code>
        ${renderVisibilityBadge(channel.visibility)}
      </div>
      <div class="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-xs text-teal-600 font-bold uppercase tracking-wide block mb-1">Tool Name</span><code class="font-mono text-teal-800">${channel.name}</code></div>
          <div><span class="text-xs text-teal-600 font-bold uppercase tracking-wide block mb-1">Visibility</span><code class="font-mono text-teal-800">${channel.visibility}</code></div>
        </div>
      </div>
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Tool Definition (JSON Schema)</span>
          <button onclick="copyTextToClipboard('mcp-schema-${mcpId}')" class="text-xs text-gray-400 hover:text-gray-600">Copy</button>
        </div>
        <pre id="mcp-schema-${mcpId}" class="bg-gray-900 text-teal-300 p-4 rounded-xl text-xs font-mono overflow-auto leading-relaxed">${renderMcpToolSchemaAsJson(channel, entityName)}</pre>
      </div>
      <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Usage in Claude / AI Agent</span>
        <pre class="mt-2 bg-gray-900 text-teal-300 p-3 rounded-lg text-xs font-mono overflow-auto">${renderMcpUsageExample(channel)}</pre>
      </div>
    </div>
  `;
}
