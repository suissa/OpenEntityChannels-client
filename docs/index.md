# OpenEntityChannels Client

The client is a local contract explorer generated from an `openEntityChannels.json` file.

## Generate the explorer

```bash
npm install
npm run generate
```

Open `public/index.html` after generation. The page contains the protocol overview, entity navigation, channel tabs and interactive request controls.

## Supported channels

| Channel | Explorer behavior |
| --- | --- |
| REST | Lists routes and provides a local “Try it out” request form. |
| WebSocket | Connects to a configured local port and shows a live message terminal. |
| gRPC | Displays the generated service contract and methods. |
| MCP | Displays visibility and tool binding metadata. |

The explorer is generated from the contract; it does not create a server and does not persist credentials.
