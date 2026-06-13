# ECP Interface Explorer — Quickstart

Interface visual tipo Swagger para o **EntityCommunicationProtocol** —  
exibe e testa todos os canais de cada entidade: REST, WebSocket, gRPC e MCP.

---

## Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

---

## Instalação

```bash
git clone https://github.com/suissa/OpenEntityChannels-swagger.git
cd OpenEntityChannels-swagger
npm install
```

---

## Rodar

```bash
npm start
```

O script faz tudo em sequência:

1. Lê o `openEntityChannels.json`
2. Gera `public/index.html` com a interface completa
3. Sobe um servidor HTTP local
4. Imprime a URL no terminal

```
✅  Interface gerada: 8 entidades · 32 canais
    Fonte  → /caminho/openEntityChannels.json
    Output → /caminho/public/index.html

┌─────────────────────────────────────────────┐
│  🚀  ECP Interface Explorer                 │
│─────────────────────────────────────────────│
│                                             │
│   URL  →  http://localhost:4040             │
│                                             │
│   Ctrl+C para parar                         │
│                                             │
└─────────────────────────────────────────────┘
```

Abra **http://localhost:4040** no browser.

---

## Usar um protocolo diferente

Passe o caminho do arquivo JSON como argumento:

```bash
npm start -- ./meu-protocolo.json
```

Ou defina a porta via variável de ambiente:

```bash
PORT=8080 npm start
```

---

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm start` | Gera a interface e sobe o servidor local |
| `npm run generate` | Só gera `public/index.html` (sem servidor) |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm run generate:prod` | Build + gera HTML via JS compilado |

---

## Estrutura do projeto

```
openEntityChannels.json   ← definição do protocolo ECP
src/
├── index.ts              ← CLI: gera o HTML e salva em public/
├── serve.ts              ← CLI: gera + serve em http://localhost:4040
├── parser.ts             ← lê e valida o JSON do protocolo
├── types.ts              ← interfaces TypeScript do protocolo
└── template/
    ├── page.ts           ← monta o HTML completo
    ├── header.ts         ← banner do protocolo com metadados globais
    ├── entity.ts         ← card por entidade com tabs de canal
    ├── scripts.ts        ← JavaScript embarcado no HTML gerado
    └── channels/
        ├── rest.ts       ← rotas HTTP com Try it out
        ├── websocket.ts  ← painel de conexão e terminal de mensagens
        ├── grpc.ts       ← métodos RPC com assinatura .proto inferida
        └── mcp.ts        ← JSON Schema do tool + exemplo de uso
public/
└── index.html            ← interface gerada (não editar manualmente)
```

---

## O que a interface oferece

**REST** — rotas coloridas por método (GET/POST/PUT/PATCH/DELETE),
colapsáveis, com formulário *Try it out* que envia requisições reais
e exibe status + corpo formatado.

**WebSocket** — painel de conexão com status live (conectando / conectado /
erro), campo para substituir o `{hash}`, terminal de mensagens com
prefixos `←` recebida · `→` enviada · `✕` erro.

**gRPC** — lista de métodos RPC com assinatura `.proto` inferida, detalhes
de endpoint/transporte e exemplo de código cliente.

**MCP** — JSON Schema do tool pronto para copiar, indicador de visibilidade
`internal`/`external` e snippet de uso no Claude ou outro agente.

---

## Adicionar uma nova entidade

Edite `openEntityChannels.json` seguindo o padrão existente e rode
`npm start` novamente. O HTML é sempre gerado do zero a partir do JSON.
