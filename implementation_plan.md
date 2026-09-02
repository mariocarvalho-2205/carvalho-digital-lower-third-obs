# Migração de Variações para Tabela Separada

Este plano descreve os passos para migrar as variações (atualmente armazenadas dentro do array `config.variations` na tabela `overlays`) para sua própria tabela relacional `variations`.

## User Review Required
> [!WARNING]
> Esta é uma mudança estrutural (Breaking Change). Precisaremos rodar um script no banco de dados e atualizar o frontend.
> O Painel e o OBS podem ficar temporariamente instáveis durante a transição até que todas as partes do código sejam atualizadas.

## Open Questions
> [!IMPORTANT]
> 1. Você tem acesso ao painel do Supabase (SQL Editor) para rodar o script de criação da tabela, ou prefere que eu crie um script em Node.js (via `query.js`) para fazer a migração via API do Supabase? Recomendo rodar via SQL Editor por ser mais seguro e transacional.
> 2. Podemos remover temporariamente o "debounce" global e separar os salvamentos em `updateOverlayConfig` e `updateVariationConfig`? Isso mudará um pouco como o Painel gerencia o estado.

## Proposed Changes

---

### Banco de Dados (Supabase)

#### [NEW] `scripts/migration.sql`
Criaremos um script SQL que você deverá rodar no SQL Editor do Supabase. Este script vai:
1. Criar a tabela `variations` com `id`, `overlay_id` (FK), `name`, `is_active`, `config`, `order_index`.
2. Habilitar RLS (Row Level Security) permitindo acesso público (mesmo padrão da tabela `overlays`).
3. (Opcional no script) Extrair os dados atuais do JSONB da tabela `overlays` e inseri-los na nova tabela `variations`.

---

### Tipos e Definições

#### [MODIFY] `types/overlay.ts`
- Remover `variations?: VariationConfig[]` de dentro da interface `OverlayConfig`.
- Criar a interface `VariationData` refletindo as colunas da nova tabela.
- Adicionar `variations?: VariationData[]` na interface `OverlayData` (para receber o resultado do JOIN).

---

### Lógica de Dados (Hooks)

#### [MODIFY] `hooks/useOverlay.ts`
- Alterar a query de fetch para: `.select('*, variations(*)')`.
- Refatorar o merge de configurações (`mergeConfig`) para não lidar mais com o array de variações no nível do JSON.
- Criar funções específicas para as variações:
  - `updateVariation(id, updates)` (com debounce para edição de textos)
  - `flushVariationUpdate(id, updates)` (imediato para toggle/deleção)
  - `createVariation(variation)`
  - `deleteVariation(id)`

#### [MODIFY] `hooks/useOverlayRealtime.ts`
- Adicionar um segundo *channel* (ou alterar o filtro) para escutar também os eventos da tabela `variations`.
- Quando um evento de `UPDATE` na tabela `variations` chegar, atualizar apenas aquela variação específica no estado local do React.

---

### Interface de Usuário (Componentes e Páginas)

#### [MODIFY] `components/panel/ControlPanel.tsx`
- Refatorar os handlers (ex: `handleCreateVariation`, `handleDeleteVariation`, `handleToggleVariationActive`) para chamarem as novas funções específicas (ex: `createVariation`, `flushVariationUpdate`) do hook em vez de clonar e alterar o array inteiro do `localConfig`.

#### [MODIFY] `app/overlay/[slug]/page.tsx`
- A estrutura do `.map` precisará ler `overlay.variations` (que agora é populado pelo JOIN do Supabase) em vez de `overlay.config.variations`.

## Verification Plan

### Testes Manuais
1. Rodar o script SQL no Supabase.
2. Abrir o Painel de Controle e verificar se as variações carregam corretamente.
3. Criar uma nova variação (verificar se aparece instantaneamente na lista).
4. Digitar textos na nova variação (verificar se o *debounce* salva corretamente na tabela `variations`).
5. Ativar/Desativar uma variação.
6. Abrir a tela do OBS (`/overlay/ba-ao-vivo`) em outra aba e verificar se ela reage instantaneamente aos toggles e mudanças de texto do Painel através do Realtime da nova tabela.
