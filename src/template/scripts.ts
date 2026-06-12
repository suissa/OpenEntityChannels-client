export function generateEmbeddedClientJavaScript(): string {
  return `
const activeWebSocketConnections = {};

function copyTextToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent || "").then(() => {
    const btn = el.nextElementSibling || el.previousElementSibling;
    if (btn && btn.tagName === "BUTTON") { const o = btn.textContent; btn.textContent = "Copied!"; setTimeout(() => btn.textContent = o, 1500); }
  });
}

function toggleEntityCardOpenOrClosed(entityId) {
  const body = document.getElementById("entity-body-" + entityId);
  const chevron = document.getElementById("entity-chevron-" + entityId);
  chevron.classList.toggle("rotate-180", body.classList.toggle("hidden") === false);
}

function expandAllEntityCards() {
  document.querySelectorAll('[id^="entity-body-"]').forEach(b => b.classList.remove("hidden"));
  document.querySelectorAll('[id^="entity-chevron-"]').forEach(c => c.classList.add("rotate-180"));
}

function collapseAllEntityCards() {
  document.querySelectorAll('[id^="entity-body-"]').forEach(b => b.classList.add("hidden"));
  document.querySelectorAll('[id^="entity-chevron-"]').forEach(c => c.classList.remove("rotate-180"));
}

function switchToChannelTab(entityId, selectedChannelType) {
  const entityBody = document.getElementById("entity-body-" + entityId);
  if (!entityBody) return;
  entityBody.querySelectorAll(".channel-tab-content").forEach(p => p.classList.add("hidden"));
  entityBody.querySelectorAll(".channel-tab-btn").forEach(btn => {
    btn.className = btn.className.replace(/border-b-2\s+border-\w+-500\s+text-\w+-600/g, "").replace("text-gray-500", "");
    btn.classList.add("text-gray-500");
  });
  const targetPanel  = document.getElementById("tab-" + entityId + "-" + selectedChannelType);
  const targetButton = document.getElementById("tab-btn-" + entityId + "-" + selectedChannelType);
  if (targetPanel) targetPanel.classList.remove("hidden");
  if (targetButton) {
    targetButton.classList.remove("text-gray-500");
    const colors = { rest:["border-b-2","border-blue-500","text-blue-600"], websocket:["border-b-2","border-purple-500","text-purple-600"], grpc:["border-b-2","border-orange-500","text-orange-600"], mcp:["border-b-2","border-teal-500","text-teal-600"] };
    targetButton.classList.add(...(colors[selectedChannelType] || []));
  }
}

function toggleRestRouteDetails(routeId) {
  const d = document.getElementById("route-detail-" + routeId);
  const c = document.getElementById("chevron-" + routeId);
  c.classList.toggle("rotate-180", d.classList.toggle("hidden") === false);
}

function toggleTryItOutVisibility(routeId) {
  document.getElementById("tryit-" + routeId)?.classList.toggle("hidden");
}

async function executeRestRequestAndDisplayResponse(routeId, method) {
  const baseUrl = document.getElementById("baseurl-" + routeId)?.value || "";
  const path    = document.getElementById("path-"    + routeId)?.value || "";
  const apiKey  = document.getElementById("apikey-"  + routeId)?.value || "";
  const dpop    = document.getElementById("dpop-"    + routeId)?.value || "";
  const bodyEl  = document.getElementById("body-"    + routeId);
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["X-API-KEY"] = apiKey;
  if (dpop)   headers["X-DPOP-TOKEN"] = dpop;
  const options = { method, headers };
  if (bodyEl && ["POST","PUT","PATCH"].includes(method)) options.body = bodyEl.value || "{}";
  const responseDiv = document.getElementById("response-" + routeId);
  const statusEl    = document.getElementById("response-status-" + routeId);
  const bodyDisplay = document.getElementById("response-body-" + routeId);
  responseDiv.classList.remove("hidden");
  statusEl.textContent = "⏳ Executing...";
  statusEl.className   = "mb-2 text-sm font-mono text-yellow-500";
  try {
    const res = await fetch(baseUrl + path, options);
    const text = await res.text();
    let formatted = text;
    try { formatted = JSON.stringify(JSON.parse(text), null, 2); } catch (_) {}
    statusEl.textContent = res.status + " " + res.statusText;
    statusEl.className   = "mb-2 text-sm font-mono font-bold " + (res.ok ? "text-green-600" : "text-red-600");
    bodyDisplay.textContent = formatted;
  } catch (err) {
    statusEl.textContent = "⚠ Network Error: " + err.message;
    statusEl.className   = "mb-2 text-sm font-mono font-bold text-red-600";
    bodyDisplay.textContent = err.toString();
  }
}

function clearRestResponsePanel(routeId) {
  document.getElementById("response-" + routeId)?.classList.add("hidden");
}

function toggleGrpcMethodDetails(methodId) {
  const d = document.getElementById("grpc-detail-" + methodId);
  const c = document.getElementById("grpc-chevron-" + methodId);
  if (!d) return;
  if (c) c.classList.toggle("rotate-180", d.classList.toggle("hidden") === false);
}

function connectToWebSocketAndListenForMessages(wsId, port, basePath) {
  if (activeWebSocketConnections[wsId]) activeWebSocketConnections[wsId].close();
  const hash = document.getElementById(wsId + "-hash")?.value || "{hash}";
  const url  = "ws://localhost:" + port + basePath.replace("{hash}", hash);
  paintWebSocketStatusAs(wsId, "connecting", "Connecting...");
  try {
    const ws = new WebSocket(url);
    activeWebSocketConnections[wsId] = ws;
    ws.onopen    = ()  => paintWebSocketStatusAs(wsId, "connected",    "Connected");
    ws.onclose   = ()  => paintWebSocketStatusAs(wsId, "disconnected", "Disconnected");
    ws.onerror   = ()  => paintWebSocketStatusAs(wsId, "error",        "Connection error");
    ws.onmessage = (e) => appendMessageToWebSocketTerminal(wsId, "received", e.data);
  } catch (err) { paintWebSocketStatusAs(wsId, "error", "Failed: " + err.message); }
}

function disconnectFromWebSocket(wsId) {
  activeWebSocketConnections[wsId]?.close();
  delete activeWebSocketConnections[wsId];
}

function sendMessageThroughOpenWebSocket(wsId) {
  const ws  = activeWebSocketConnections[wsId];
  const msg = document.getElementById(wsId + "-send")?.value;
  if (!ws || ws.readyState !== WebSocket.OPEN) { appendMessageToWebSocketTerminal(wsId, "error", "Not connected — click Connect first"); return; }
  if (msg) { ws.send(msg); appendMessageToWebSocketTerminal(wsId, "sent", msg); }
}

function paintWebSocketStatusAs(wsId, state, label) {
  const dot = document.getElementById(wsId + "-status-dot");
  const txt = document.getElementById(wsId + "-status-text");
  const colors = { connected:"bg-green-400", connecting:"bg-yellow-400 animate-pulse", disconnected:"bg-gray-400", error:"bg-red-400" };
  if (dot) dot.className = "w-2.5 h-2.5 rounded-full transition-all " + (colors[state] || "bg-gray-400");
  if (txt) txt.textContent = label;
}

function appendMessageToWebSocketTerminal(wsId, type, data) {
  const container = document.getElementById(wsId + "-messages");
  if (!container) return;
  container.querySelector(".italic")?.remove();
  const colorByType  = { received:"text-green-400", sent:"text-blue-400", error:"text-red-400" };
  const prefixByType = { received:"← ", sent:"→ ", error:"✕ " };
  const line = document.createElement("div");
  line.className   = "font-mono text-xs " + (colorByType[type] || "text-white");
  line.textContent = (prefixByType[type] || "") + data;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

function clearAllWebSocketMessages(wsId) {
  const c = document.getElementById(wsId + "-messages");
  if (c) c.innerHTML = '<span class="text-gray-600 italic text-xs">No messages yet...</span>';
}

function filterEntitiesBySearchTerm(searchTerm) {
  const t = searchTerm.toLowerCase();
  document.querySelectorAll(".entity-card").forEach(card => {
    card.style.display = card.id.replace("entity-", "").toLowerCase().includes(t) ? "" : "none";
  });
}

function scrollToEntityAndExpandIfClosed(entityId) {
  const card    = document.getElementById("entity-" + entityId);
  const body    = document.getElementById("entity-body-" + entityId);
  const chevron = document.getElementById("entity-chevron-" + entityId);
  if (!card) return;
  if (body?.classList.contains("hidden")) { body.classList.remove("hidden"); chevron?.classList.add("rotate-180"); }
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}
`;
}
