# poc-preact

POC explorando **Preact**: a mesma DX do React (JSX + hooks) num runtime de
~3kB, com um modelo de reatividade extra (signals) e interop com libs React.

## Por que Preact

- **React-like, mas minúsculo.** Mesmo modelo mental (componentes, JSX, hooks),
  ~3kB vs ~40kB+ do React. Ótimo quando bundle size importa (widgets, embeds).
- **Signals** trazem reatividade *fina*: atualizam só o nó de texto que lê o
  valor, sem re-renderizar a árvore — diferente do `useState`.
- **preact/compat** aliasa `react`/`react-dom`, então libs escritas para React
  rodam sobre o Preact sem alterar o código.

## O que a POC mostra

| Conceito | Arquivo |
|----------|---------|
| Hooks (useState/useEffect/useMemo) | `src/components/Counter.tsx` |
| Signals + computed (reatividade fina) | `src/components/SignalsCart.tsx` |
| Routing isomórfico + lazy route | `src/App.tsx`, `src/pages/` |
| compat (memo + forwardRef) | `src/components/CompatBadge.tsx` |

## Rodar

```bash
npm install
npm run dev
```

## Pitch de mentoria

"Preact prova que o modelo do React (VDOM + hooks) cabe em 3kB. O pulo do gato
é o `@preact/signals`: em vez de re-renderizar o componente a cada `setState`,
o signal liga *o nó de texto* à fonte de verdade e atualiza só ele — reatividade
fina sem mudar a API. E com o alias `preact/compat`, você troca o runtime do
React sem reescrever a aplicação."
