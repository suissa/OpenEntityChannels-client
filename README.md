# OpenEntityChannels Client

OpenEntityChannels Client generates a local, interactive explorer from an `openEntityChannels.json` contract. It presents entities, REST routes, WebSocket streams, gRPC services, MCP bindings, authentication defaults and observability endpoints in one technical interface.

The generated page is intentionally dependency-light: the generator is TypeScript, while the output is a self-contained HTML document that can be opened directly in a browser.

## What it provides

- Entity-first navigation with search and expand/collapse controls.
- Channel tabs for REST, WebSocket, gRPC and MCP.
- REST “Try it out” forms with request headers, JSON body and response viewer.
- WebSocket connect, disconnect, send and live message terminal.
- Protocol-level summary for route hashing, leases, required headers and observability.
- A layout designed for local contract inspection, without a backend requirement.

## Quick start

```bash
npm install
npm run generate
```

The default command reads `./openEntityChannels.json` and writes `./public/index.html`.

Custom input and output paths are supported:

```bash
npm run generate -- ./contracts/my-protocol.json ./public/my-protocol.html
```

For a production-style run:

```bash
npm run generate:prod
```

## Contract shape

The generator consumes the protocol document described in [`openEntityChannels.json`](./openEntityChannels.json). Each entity declares its schema reference, identity field and enabled communication channels. REST routes are rendered as executable request rows; WebSocket, gRPC and MCP bindings are rendered as channel-specific contract panels.

## Security note

The explorer runs locally, but the generated REST form can send requests to the URL entered by the operator. Use test credentials and a trusted protocol definition. The default headers shown by the explorer are `X-API-KEY` and `X-DPOP-TOKEN`; they are never persisted by the generator.

## Project layout

```text
src/
  index.ts                 CLI entrypoint
  parser.ts                Protocol file reader
  types.ts                 Contract types
  template/
    page.ts                Full HTML shell and navigation
    header.ts              Protocol overview header
    entity.ts              Entity cards and channel tabs
    channels/              REST, WebSocket, gRPC and MCP panels
    scripts.ts             Embedded browser interactions
openEntityChannels.json    Example protocol contract
docs/                      Short documentation entrypoint
```

## License

See [`LICENSE.txt`](./LICENSE.txt).
