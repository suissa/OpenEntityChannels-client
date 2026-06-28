import { GrpcChannel, RestRoute } from "../../types";

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
      <div class="flex items-center gap-3 px-4 py-3 border-l-4 border-orange-500/60 bg-orange-500/5 rounded-r-lg cursor-pointer hover:bg-orange-500/10 transition-colors select-none"
           onclick="toggleGrpcMethodDetails('${methodId}')">
        <span class="inline-block font-bold text-xs px-2 py-1 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 w-10 text-center font-mono">RPC</span>
        <span class="font-mono text-sm text-gray-300 flex-1">${method}</span>
        <span class="text-xs text-gray-600 italic hidden md:block">Unary</span>
        <svg id="grpc-chevron-${methodId}" class="w-4 h-4 text-gray-600 transition-transform duration-200"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      <div id="grpc-detail-${methodId}" class="hidden px-4 pt-3 pb-4 bg-orange-500/5 border-l-4 border-orange-500/20 rounded-r-lg">
        <div class="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
          <span>Endpoint: <code class="bg-gray-800 border border-gray-700 text-gray-400 rounded px-1.5 py-0.5 font-mono">localhost:${port}</code></span>
          <span>Pattern: <code class="bg-gray-800 border border-gray-700 text-gray-400 rounded px-1.5 py-0.5 font-mono">Unary</code></span>
          <span>Transport: <code class="bg-gray-800 border border-gray-700 text-gray-400 rounded px-1.5 py-0.5 font-mono">HTTP/2</code></span>
        </div>
        <div class="bg-[#080b11] border border-gray-800 text-orange-300 p-3 rounded-lg text-xs font-mono leading-relaxed">
          <span class="text-gray-700">// .proto definition (inferred)</span><br/>
          ${renderProtoMethodSignature(method)}
        </div>
      </div>
    </div>
  `;
}

function renderGrpcClientExample(service: string, port: number): string {
  return `
    <div class="mt-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
      <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Client Usage Example</span>
      <pre class="mt-2 bg-[#080b11] border border-gray-800 text-orange-300 p-3 rounded-lg text-xs font-mono overflow-auto leading-relaxed">const client = new ${service}Client('localhost:${port}', grpc.credentials.createInsecure());

client.getCurrentState({ hash: '{entity-hash}' }, (err, response) => {
  console.log(response);
});</pre>
    </div>
  `;
}

export function renderGrpcChannelSection(
  entityName: string,
  channel: GrpcChannel,
  restRouteNames: string[]
): string {
  const methodNames = restRouteNames.length > 0
    ? restRouteNames
    : ["receivePayload", "getCurrentState"];

  const allMethodRowsHTML = methodNames
    .map(method => renderGrpcMethodRow(method, channel.service, channel.port))
    .join("");

  return `
    <div id="grpc-${entityName.toLowerCase()}">
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div class="w-1.5 h-1.5 rounded-full ${channel.enabled ? "bg-orange-400" : "bg-gray-600"}"></div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">gRPC</span>
        <code class="text-xs font-mono text-gray-600 bg-gray-800 px-2 py-0.5 rounded">:${channel.port}</code>
        <code class="text-xs font-mono text-gray-600 bg-gray-800 px-2 py-0.5 rounded">${channel.service}</code>
      </div>

      <div class="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3 mb-4 flex flex-wrap gap-4 text-sm">
        <div>
          <span class="text-xs text-orange-500 font-bold uppercase tracking-wide block mb-0.5">Service</span>
          <code class="font-mono text-orange-300">${channel.service}</code>
        </div>
        <div>
          <span class="text-xs text-orange-500 font-bold uppercase tracking-wide block mb-0.5">Port</span>
          <code class="font-mono text-orange-300">${channel.port}</code>
        </div>
        <div>
          <span class="text-xs text-orange-500 font-bold uppercase tracking-wide block mb-0.5">Methods</span>
          <code class="font-mono text-orange-300">${methodNames.length}</code>
        </div>
      </div>

      <div class="mb-2">
        <span class="text-xs font-bold text-gray-600 uppercase tracking-widest">RPC Methods</span>
      </div>
      ${allMethodRowsHTML}

      ${renderGrpcClientExample(channel.service, channel.port)}
    </div>
  `;
}
