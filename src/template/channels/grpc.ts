import { GrpcChannel } from "../../types";

function buildGrpcMethodUniqueId(serviceName: string, methodName: string): string {
  return `${serviceName}-${methodName}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function renderProtoMethodSignature(methodName: string): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `rpc ${capitalize(methodName)}(${capitalize(methodName)}Request) returns (${capitalize(methodName)}Response);`;
}

function renderGrpcMethodRow(method: string, serviceName: string, port: number): string {
  const methodId = buildGrpcMethodUniqueId(serviceName, method);
  return `
    <div class="mb-2">
      <div class="flex items-center gap-3 px-4 py-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg cursor-pointer hover:bg-orange-100 select-none"
           onclick="toggleGrpcMethodDetails('${methodId}')">
        <span class="inline-block font-bold text-xs px-2 py-1 rounded bg-orange-100 text-orange-800 border border-orange-300 w-10 text-center">RPC</span>
        <span class="font-mono text-sm text-gray-700 flex-1">${method}</span>
        <span class="text-xs text-gray-400 italic hidden md:block">Unary</span>
        <svg id="grpc-chevron-${methodId}" class="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      <div id="grpc-detail-${methodId}" class="hidden px-4 pt-3 pb-4 bg-orange-50 border-l-4 border-orange-200 rounded-r-lg">
        <div class="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
          <span>Endpoint: <code class="bg-white border rounded px-1 font-mono">localhost:${port}</code></span>
          <span>Pattern: <code class="bg-white border rounded px-1 font-mono">Unary</code></span>
          <span>Transport: <code class="bg-white border rounded px-1 font-mono">HTTP/2</code></span>
        </div>
        <div class="bg-gray-900 text-orange-300 p-3 rounded-lg text-xs font-mono">
          <span class="text-gray-500">// .proto (inferred)</span><br/>${renderProtoMethodSignature(method)}
        </div>
      </div>
    </div>
  `;
}

function renderGrpcClientExample(service: string, port: number): string {
  return `
    <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Client Usage Example</span>
      <pre class="mt-2 bg-gray-900 text-orange-300 p-3 rounded-lg text-xs font-mono overflow-auto">const client = new ${service}Client('localhost:${port}', grpc.credentials.createInsecure());
client.getCurrentState({ hash: '{hash}' }, (err, res) => console.log(res));</pre>
    </div>
  `;
}

export function renderGrpcChannelSection(entityName: string, channel: GrpcChannel, restRouteNames: string[]): string {
  const methodNames       = restRouteNames.length > 0 ? restRouteNames : ["receivePayload", "getCurrentState"];
  const allMethodRowsHTML = methodNames.map(m => renderGrpcMethodRow(m, channel.service, channel.port)).join("");
  return `
    <div id="grpc-${entityName.toLowerCase()}">
      <div class="flex items-center gap-3 mb-4 pb-2 border-b border-orange-200">
        <div class="w-2 h-2 rounded-full ${channel.enabled ? "bg-orange-400" : "bg-gray-400"}"></div>
        <span class="text-xs font-bold text-orange-600 uppercase tracking-wider">gRPC</span>
        <span class="text-xs text-orange-400">Port ${channel.port}</span>
        <code class="text-xs font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded">${channel.service}</code>
      </div>
      <div class="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex flex-wrap gap-4 text-sm">
        <div><span class="text-xs text-orange-600 font-bold uppercase tracking-wide block mb-0.5">Service</span><code class="font-mono text-orange-800">${channel.service}</code></div>
        <div><span class="text-xs text-orange-600 font-bold uppercase tracking-wide block mb-0.5">Port</span><code class="font-mono text-orange-800">${channel.port}</code></div>
        <div><span class="text-xs text-orange-600 font-bold uppercase tracking-wide block mb-0.5">Methods</span><code class="font-mono text-orange-800">${methodNames.length}</code></div>
      </div>
      <div class="mb-1"><span class="text-xs font-bold text-gray-500 uppercase tracking-wide">RPC Methods</span></div>
      ${allMethodRowsHTML}
      ${renderGrpcClientExample(channel.service, channel.port)}
    </div>
  `;
}
