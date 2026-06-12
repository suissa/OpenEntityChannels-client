import * as fs from "fs";
import * as path from "path";
import { ECPProtocol, Entity } from "./types";

export function readProtocolFile(filePath: string): ECPProtocol {
  const absolutePath = path.resolve(filePath);
  const rawContent = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(rawContent) as ECPProtocol;
}

export function listAllEntityNames(protocol: ECPProtocol): string[] {
  return Object.keys(protocol.entities);
}

export function listEnabledChannelTypesForEntity(entity: Entity): string[] {
  return Object.entries(entity.channels)
    .filter(([, channel]) => channel?.enabled)
    .map(([channelType]) => channelType);
}

export function resolveFullRoutePath(base: string, routePath?: string): string {
  return base + (routePath ?? "");
}
