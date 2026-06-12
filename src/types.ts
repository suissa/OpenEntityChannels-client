export interface RestRoute {
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path?: string;
}

export interface RestChannel {
  enabled: boolean;
  port: number;
  base: string;
  routes: RestRoute[];
}

export interface WebSocketChannel {
  enabled: boolean;
  port: number;
  base: string;
}

export interface GrpcChannel {
  enabled: boolean;
  port: number;
  service: string;
}

export interface McpChannel {
  enabled: boolean;
  visibility: "internal" | "external";
  name: string;
}

export interface EntityChannels {
  rest?: RestChannel;
  websocket?: WebSocketChannel;
  grpc?: GrpcChannel;
  mcp?: McpChannel;
}

export interface Entity {
  schemaRef: string;
  idField: string;
  canonicalLabel: string;
  channels: EntityChannels;
}

export interface Hashing {
  algorithm: string;
  secretRef: string;
  input: string[];
}

export interface Observability {
  enabled: boolean;
  ui: { path: string; stream: string };
  agents: { path: string; stream: string };
}

export interface Lease {
  mode: string;
  idleTtlMs: number;
  destroyOnExpire: boolean;
  zeroizeSecrets: boolean;
}

export interface ECPDefaults {
  enabled: boolean;
  body: string;
  requiredHeaders: string[];
  idleTtlMs: number;
  responseIdentity: {
    alwaysReturn: string[];
    uiUses: string;
    systemUses: string;
  };
  hashing: Hashing;
  observability: Observability;
  lease: Lease;
}

export interface ECPProtocol {
  protocol: string;
  version: string;
  defaults: ECPDefaults;
  entities: Record<string, Entity>;
}
