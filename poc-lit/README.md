# poc-lit

POC explorando **Lit**: uma camada finíssima (~5kB) em cima dos Web Components
padrão para construir custom elements reativos, com Shadow DOM e templates
eficientes via `lit-html`.

## Por que Lit

- **É a plataforma, não um framework.** Os componentes são `customElements`
  reais — funcionam em qualquer página (React, Vue, Angular ou HTML puro).
- **Shadow DOM nativo** dá encapsulamento de estilo de graça: o CSS do
  componente não vaza nem é sobrescrito pela página.
- **lit-html** faz render eficiente sem VDOM: ele só atualiza as partes
  dinâmicas do template (as expressões `${...}`).

## O que a POC mostra

| Conceito | Arquivo |
|----------|---------|
| Custom element + @state | `src/components/mc-counter.ts` |
| @property (atributos reativos) + lifecycle willUpdate | `src/components/mc-greeting.ts` |
| Templates lit-html + directives (repeat/when/classMap) | `src/components/mc-todos.ts` |
| Shadow DOM, estilos encapsulados, slots | `src/components/mc-card.ts` |
| CustomEvents (composed) + property binding | `src/components/mc-rating.ts` |

## Rodar

```bash
npm install
npm run dev
```

## Pitch de mentoria

"Lit não inventa um modelo próprio: ele usa Web Components do navegador e só
adiciona reatividade (`@property`/`@state`) e um render eficiente (`lit-html`,
sem VDOM). O encapsulamento vem do Shadow DOM — estilo escopo de graça. E a
comunicação segue o padrão da plataforma: dados descem por *properties*,
eventos sobem por *CustomEvent* com `composed: true` pra cruzar o shadow root.
Por isso um componente Lit roda em qualquer stack."
