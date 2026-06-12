import { WebSocketChannel } from "../../types";

function buildWebSocketConnectionUrl(port: number, basePath: string): string {
  return `ws://localhost:${port}${basePath}`;
}

function renderConnectionStatusIndicator(wsId: string): string {
  return `<div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full bg-gray-400 transition-all" id="${wsId}-status-dot"></div><span class="text-xs text-gray-500 font-medium" id="${wsId}-status-text">Disconnected</span></div>`;
}

function renderConnectionControls(wsId: string, port: number, basePath: string): string {
  return `
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
      <div class="flex items-start justify-between mb-3">
        <div>
          <span class="text-xs font-bold text-purple-700 uppercase tracking-wide">Endpoint</span>
          <div class="font-mono text-sm text-purple-600 mt-1" id="${wsId}-url">${buildWebSocketConnectionUrl(port, basePath)}</div>
        </div>
        ${renderConnectionStatusIndicator(wsId)}
      </div>
      <div class="mb-3">
        <label class="block text-xs font-medium text-purple-700 mb-1 uppercase tracking-wide">Hash / Room ID</label>
        <input type="text" placeholder="Enter hash value" id="${wsId}-hash"
          class="w-full border border-purple-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white" />
      </div>
      <div class="flex gap-2">
        <button onclick="connectToWebSocketAndListenForMessages('${wsId}', ${port}, '${basePath}')"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-sm">Connect</button>
        <button onclick="disconnectFromWebSocket('${wsId}')"
          class="px-4 py-2 border border-purple-400 text-purple-700 rounded-lg text-sm hover:bg-purple-100">Disconnect</button>
      </div>
    </div>
  `;
}

function renderMessageTerminal(wsId: string): string {
  return `
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Messages</label>
        <button onclick="clearAllWebSocketMessages('${wsId}')" class="text-xs text-gray-400 hover:text-gray-600">Clear</button>
      </div>
      <div id="${wsId}-messages" class="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono h-40 overflow-auto leading-relaxed">
        <span class="text-gray-600 italic">No messages yet...</span>
      </div>
    </div>
  `;
}

function renderMessageSendPanel(wsId: string): string {
  return `
    <div>
      <label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Send Message</label>
      <textarea id="${wsId}-send" rows="4" placeholder='{"type": "event", "data": {}}'
        class="w-full border rounded-lg px-3 py-2 text-sm font-mono mb-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"></textarea>
      <button onclick="sendMessageThroughOpenWebSocket('${wsId}')"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600">Send</button>
    </div>
  `;
}

export function renderWebSocketChannelSection(entityName: string, channel: WebSocketChannel): string {
  const wsId = `ws-${entityName.toLowerCase()}`;
  return `
    <div id="${wsId}">
      <div class="flex items-center gap-3 mb-4 pb-2 border-b border-purple-200">
        <div class="w-2 h-2 rounded-full ${channel.enabled ? "bg-purple-400 animate-pulse" : "bg-gray-400"}"></div>
        <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">WebSocket</span>
        <span class="text-xs text-purple-400">Port ${channel.port}</span>
        <code class="text-xs font-mono text-purple-500 bg-purple-50 px-2 py-0.5 rounded">${channel.base}</code>
      </div>
      ${renderConnectionControls(wsId, channel.port, channel.base)}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${renderMessageSendPanel(wsId)}
        ${renderMessageTerminal(wsId)}
      </div>
    </div>
  `;
}
