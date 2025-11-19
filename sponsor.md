# Checklist – Seção “Parceiros de Trabalho” (Patrocinadores)

## Layout e destaque da seção

- [x] Criar bloco visualmente destacado para a seção de parceiros (fundo diferenciado, borda e/ou sombra suave).
- [x] Ajustar o título e o badge para reforçar a sensação de espaço premium patrocinado.
- [x] Garantir alinhamento de largura com o restante da página (`.container`).

## Grid e estrutura de cards

- [x] Atualizar o grid de parceiros (`.cards-grid.-partners`) para suportar 2–3 colunas no desktop e 1 no mobile.
- [x] Definir estilos específicos para `.partner-card` (fundo, borda, sombra, espaçamento).
- [x] Preparar a estrutura para receber múltiplos parceiros apenas duplicando `article.partner-card`.

## Card da Trena Arquitetura e Gerenciamento

- [x] Criar header do card com logo/placeholder da empresa.
- [x] Incluir selo textual de destaque (ex.: “Parceiro indicado”).
- [x] Escrever título curto com o nome da empresa.
- [x] Adicionar tagline em uma linha explicando o valor principal para clientes da SOS Casa.
- [x] Criar lista de 3–4 bullets com benefícios claros (cronograma integrado, redução de retrabalho, atendimento a imobiliárias/incorporadoras etc.).
- [x] Incluir CTA discreto (ex.: “Conhecer a Trena”) com ícone de seta.

## Padrões visuais e de UX

- [x] Manter tipografia, paleta de cores e espaçamentos consistentes com seções como “Serviços” e “Projetos Recentes”.
- [x] Garantir que o card de parceiro pareça premium, sem perder legibilidade.
- [x] Evitar textos muito longos em bloco – preferir subtítulos e bullets.

## Microinterações

- [x] Adicionar hover nos cards (elevação leve + sombra um pouco mais forte).
- [x] Animar discretamente o ícone do CTA (seta deslizando alguns pixels à direita no hover).
- [x] Garantir transições suaves (ex.: `transition: transform 0.2s ease, box-shadow 0.2s ease`).

## Acessibilidade

- [x] Definir `alt` descritivo para o logo da empresa parceira.
- [x] Aumentar contraste de textos e selos para atender WCAG 2.1 AA.
- [x] Garantir foco visível nos links/CTAs dentro dos cards (outline ou estado de foco customizado).
- [x] Usar `h3` para nomes de empresas dentro da seção (com `h2` já definido para o título da seção).

## Responsividade

- [x] Validar layout em desktop, tablet e mobile (breakpoints atuais).
- [x] Ajustar espaçamentos verticais no mobile para manter leitura confortável.
- [x] Garantir que o badge e o título funcionem bem com múltiplos cards em linha.

## Performance & SEO

- [x] Usar logos otimizados (SVG/PNGs leves) para parceiros.
- [x] Manter HTML semântico (`section` + `article` + `h2`/`h3`).
- [x] Evitar carregamento de bibliotecas extras pesadas apenas para essa seção.
