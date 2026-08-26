# Planejamento Completo — Sistema de Lower Third para OBS

## 1. Visão geral

O projeto será um sistema web de **overlay gráfica para OBS**, inspirado no modelo de uso de ferramentas como Uno Overlay:

- uma URL para o **painel de controle**;
- uma URL para a **overlay**;
- a overlay é adicionada ao OBS como **Fonte de Navegador**;
- qualquer computador autorizado pode abrir o painel e alterar a mesma overlay;
- alterações aparecem em tempo real no OBS;
- não haverá servidor próprio nem hospedagem adicional;
- o frontend Next.js será hospedado na **Vercel**;
- dados, arquivos e sincronização em tempo real serão fornecidos pelo **Supabase Cloud**.

Arquitetura:

```text
                    INTERNET
                        │
                        ▼
              ┌─────────────────┐
              │  NEXT.JS /      │
              │  VERCEL         │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       PAINEL A      PAINEL B      OBS
      /painel/...   /painel/...  /overlay/...
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ SUPABASE CLOUD  │
              │                 │
              │ PostgreSQL      │
              │ Realtime        │
              │ Storage         │
              │ Auth            │
              └─────────────────┘
```

---

# 2. Decisão de infraestrutura

## Next.js

**Hospedagem: Vercel**

Responsável por:

- painel de controle;
- página da overlay;
- rotas;
- interface;
- autenticação visual;
- APIs/Server Actions quando necessário.

## Supabase

Responsável por:

- banco PostgreSQL;
- Realtime;
- Storage para logos e imagens;
- autenticação, caso seja adicionada;
- persistência das configurações.

## Não utilizar

Nesta primeira arquitetura não será necessário:

- VPS;
- servidor Node.js próprio;
- Socket.io próprio;
- Cloudflare Tunnel;
- Hostinger para esta aplicação;
- WebSocket customizado.

O Supabase Realtime substituirá a necessidade de um servidor WebSocket próprio.

---

# 3. Domínio e URLs

A recomendação é utilizar um subdomínio dedicado.

Exemplo:

```text
lower.seudominio.com
```

Rotas:

```text
https://lower.seudominio.com/painel/ba-ao-vivo
https://lower.seudominio.com/overlay/ba-ao-vivo
```

Outras overlays:

```text
https://lower.seudominio.com/painel/esportes
https://lower.seudominio.com/overlay/esportes

https://lower.seudominio.com/painel/entrevista
https://lower.seudominio.com/overlay/entrevista
```

A configuração do subdomínio será feita na Vercel, apontando o DNS conforme solicitado pela plataforma.

### Alternativa sem subdomínio

Também é possível usar um domínio já existente:

```text
https://seudominio.com/lower/painel/ba-ao-vivo
https://seudominio.com/lower/overlay/ba-ao-vivo
```

**Recomendação:** usar o subdomínio `lower.seudominio.com`, pois deixa o sistema isolado e organizado.

---

# 4. Conceito central: uma overlay, vários painéis

Cada overlay terá um identificador único chamado `slug`.

Exemplo:

```text
ba-ao-vivo
```

As URLs serão:

```text
/painel/ba-ao-vivo
/overlay/ba-ao-vivo
```

Todos os painéis abertos em:

```text
/painel/ba-ao-vivo
```

controlam a mesma configuração.

Fluxo:

```text
PAINEL COMPUTADOR A
        │
        │ altera título
        ▼
      SUPABASE
        │
        │ Realtime
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
 PAINEL A ATUALIZA   PAINEL B ATUALIZA      OBS
                                           ATUALIZA
```

Não importa de qual painel a alteração foi feita. A alteração passa a ser o estado atual daquela overlay.

---

# 5. Funcionamento no OBS

No OBS será criada uma Fonte de Navegador.

URL:

```text
https://lower.seudominio.com/overlay/ba-ao-vivo
```

Configuração inicial recomendada:

```text
Largura: 1920
Altura: 1080
FPS: padrão do OBS
```

A página `/overlay/[slug]`:

- terá fundo transparente;
- não mostrará painel;
- não mostrará controles;
- renderizará apenas a lower third;
- receberá atualizações em tempo real.

A fonte poderá ser colocada na camada superior da cena.

### Organização recomendada no OBS

```text
CENA
│
├── Câmera
├── Vídeo
├── Imagens
├── Outros elementos
│
└── LOWER THIRD
    └── Fonte de Navegador
        https://lower.seudominio.com/overlay/ba-ao-vivo
```

Se a mesma lower for usada em várias cenas, pode ser usada como fonte compartilhada/reutilizada conforme a organização do OBS.

---

# 6. Modelo visual inicial

A primeira versão será baseada no modelo fornecido:

```text
                 RETÂNGULO SUPERIOR
                 ┌───────────────┐
                 │               │
                 └───────────────┘

        ÁREA BRANCA COM DOIS TEXTOS         LOGO
        ┌───────────────────────────┐      ┌───────┐
        │ TEXTO PRINCIPAL           │      │       │
        │ Texto secundário          │      │ LOGO  │
        └───────────────────────────┘      └───────┘

 RETÂNGULO INFERIOR
 ┌───────────────────────────────────────────────────┐
 └───────────────────────────────────────────────────┘
```

O layout não será uma imagem única.

Cada elemento será independente:

1. retângulo superior;
2. área principal;
3. texto principal;
4. texto secundário;
5. container da logo;
6. logo;
7. retângulo inferior.

Isso permite controlar cada elemento separadamente.

---

# 7. Sistema de elementos configuráveis

## 7.1 Retângulo superior

Configurações:

- posição X;
- posição Y;
- largura;
- altura;
- cor sólida;
- gradiente;
- cor inicial;
- cor final;
- direção do gradiente;
- opacidade;
- rotação, opcional;
- borda;
- espessura da borda;
- cor da borda;
- canto superior esquerdo;
- canto superior direito;
- canto inferior direito;
- canto inferior esquerdo.

## 7.2 Retângulo inferior

Mesmas configurações do retângulo superior.

## 7.3 Área branca

Configurações:

- posição;
- largura;
- altura;
- cor de fundo;
- opacidade;
- quatro cantos independentes;
- sombra, opcional.

## 7.4 Texto principal

Configurações:

- conteúdo;
- posição;
- largura máxima;
- fonte;
- tamanho;
- peso;
- cor;
- alinhamento;
- altura de linha;
- espaçamento entre letras;
- sombra, opcional;
- caixa alta, opcional.

## 7.5 Texto secundário

Mesmas configurações básicas do texto principal.

## 7.6 Logo

Configurações:

- upload;
- tamanho;
- posição X;
- posição Y;
- ajuste da imagem;
- fundo transparente;
- fundo redondo;
- fundo quadrado;
- cor do fundo;
- padding;
- borda;
- raio personalizado;
- sombra, opcional.

---

# 8. Sistema de bordas independentes

Cada forma terá quatro valores independentes:

```text
┌──────────────────────┐
│  superior esquerdo   superior direito
│
│
│  inferior esquerdo   inferior direito
└──────────────────────┘
```

Dados:

```json
{
  "topLeft": 24,
  "topRight": 24,
  "bottomRight": 0,
  "bottomLeft": 0
}
```

No CSS, o conceito será:

```css
border-radius:
  var(--top-left)
  var(--top-right)
  var(--bottom-right)
  var(--bottom-left);
```

O painel deverá permitir editar os quatro valores individualmente.

---

# 9. Sistema de coordenadas

O canvas lógico inicial será:

```text
1920 × 1080
```

Cada elemento será posicionado por coordenadas.

Exemplo:

```json
{
  "x": 220,
  "y": 630,
  "width": 440,
  "height": 58
}
```

Isso garante previsibilidade no OBS.

## Responsividade

A overlay deverá ser projetada para manter proporção quando a fonte de navegador tiver outra resolução.

Estratégia:

- trabalhar internamente com canvas base de 1920×1080;
- aplicar escala proporcional;
- preservar as coordenadas originais.

Assim, o editor e a overlay usam o mesmo sistema de referência.

---

# 10. Painel de controle

A página:

```text
/painel/[slug]
```

terá duas áreas principais.

## Lado esquerdo

Prévia da lower.

```text
┌────────────────────────────────────┐
│                                    │
│                                    │
│          PRÉVIA AO VIVO            │
│                                    │
│    ────────                        │
│    MÁRIO CARVALHO        [LOGO]     │
│    APRESENTADOR                     │
│    ───────────────────────────      │
│                                    │
└────────────────────────────────────┘
```

## Lado direito

Controles.

```text
LOWER THIRD

VISIBILIDADE
[ ATIVAR ] [ DESATIVAR ]

TEXTOS
Título
[ MÁRIO CARVALHO ]

Subtítulo
[ APRESENTADOR ]

LOGO
[ Upload ]

FUNDO DA LOGO
( ) Transparente
( ) Redondo
( ) Quadrado

ELEMENTOS
[ Barra superior ]
[ Área principal ]
[ Barra inferior ]
[ Logo ]

ANIMAÇÃO
[ Selecionar animação ]
```

---

# 11. Ativar e desativar

A visibilidade será armazenada no banco.

Campo:

```text
is_active
```

Valores:

```text
true
false
```

Quando:

```text
true
```

A overlay aparece.

Quando:

```text
false
```

A overlay desaparece.

A mudança será enviada pelo Supabase Realtime.

---

# 12. Animações

A primeira versão deve suportar:

1. fade;
2. entrada pela esquerda;
3. entrada pela direita;
4. entrada de baixo;
5. saída pela esquerda;
6. saída pela direita.

Configuração:

```json
{
  "animation": {
    "enter": "slide-left",
    "exit": "fade",
    "duration": 500
  }
}
```

A animação será controlada no navegador e não no OBS.

---

# 13. Banco de dados

## Tabela `overlays`

Estrutura proposta:

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | ID da overlay |
| slug | text | Identificador na URL |
| name | text | Nome da overlay |
| config | jsonb | Configuração completa |
| is_active | boolean | Visibilidade |
| created_at | timestamptz | Criação |
| updated_at | timestamptz | Última alteração |

### Exemplo de registro

```json
{
  "id": "uuid",
  "slug": "ba-ao-vivo",
  "name": "BA AO VIVO",
  "is_active": true,
  "config": {}
}
```

## Por que usar JSONB?

Porque a lower terá muitas configurações visuais.

Em vez de criar dezenas de colunas:

```text
top_bar_x
top_bar_y
top_bar_width
top_bar_height
top_bar_color
...
```

a configuração visual ficará centralizada em `config`.

Isso torna o sistema mais flexível.

---

# 14. Estrutura da configuração JSON

Modelo inicial:

```json
{
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "texts": {
    "title": {
      "content": "MÁRIO CARVALHO",
      "x": 280,
      "y": 710,
      "fontSize": 42,
      "fontWeight": 700,
      "color": "#173A7A",
      "fontFamily": "Arial"
    },
    "subtitle": {
      "content": "APRESENTADOR",
      "x": 280,
      "y": 765,
      "fontSize": 24,
      "fontWeight": 400,
      "color": "#333333"
    }
  },
  "topBar": {
    "x": 220,
    "y": 630,
    "width": 440,
    "height": 58,
    "background": {
      "type": "solid",
      "color": "#1678D3"
    },
    "radius": {
      "topLeft": 25,
      "topRight": 25,
      "bottomRight": 0,
      "bottomLeft": 0
    }
  },
  "contentBox": {
    "x": 220,
    "y": 688,
    "width": 1100,
    "height": 138,
    "background": "#FFFFFF"
  },
  "bottomBar": {
    "x": 220,
    "y": 826,
    "width": 1200,
    "height": 48,
    "background": {
      "type": "gradient",
      "start": "#1678D3",
      "end": "#6200D8",
      "direction": "right"
    }
  },
  "logo": {
    "url": null,
    "x": 1220,
    "y": 670,
    "width": 150,
    "height": 150,
    "backgroundType": "circle",
    "backgroundColor": "#FFFFFF",
    "padding": 10
  },
  "animation": {
    "enter": "slide-left",
    "exit": "fade",
    "duration": 500
  }
}
```

---

# 15. Supabase Realtime

O Realtime será responsável por manter todos sincronizados.

Fluxo:

```text
PAINEL A
   │
   │ UPDATE
   ▼
SUPABASE DATABASE
   │
   │ realtime event
   ├───────────────┬────────────────┐
   ▼               ▼                ▼
PAINEL A        PAINEL B          OVERLAY
```

Quando a linha da tabela `overlays` for alterada:

- painel A recebe a atualização;
- painel B recebe a atualização;
- overlay no OBS recebe a atualização.

Não será necessário recarregar a página.

---

# 16. Estratégia de atualização

## Alterações simples

Exemplos:

- ativar;
- desativar;
- alterar cor;
- mover elemento.

Podem ser enviadas imediatamente.

## Campos de texto

Para evitar uma gravação a cada tecla:

```text
M
MA
MÁ
MÁR
MÁRI
MÁRIO
```

será utilizado debounce.

Exemplo:

```text
500 ms
```

Após o usuário parar de digitar por 500 ms, a atualização é enviada.

Também poderá existir um botão:

```text
[ APLICAR ]
```

se desejado.

---

# 17. Conflitos entre vários painéis

Regra inicial:

**última alteração vence para o campo alterado.**

Para reduzir conflitos, o painel deve atualizar somente o trecho que foi alterado.

Exemplo:

Pessoa A altera:

```text
texts.title.content
```

Pessoa B altera:

```text
bottomBar.background.end
```

As duas alterações devem coexistir.

Não é recomendado enviar o JSON inteiro com base em uma cópia antiga sem sincronização.

A implementação deverá:

1. receber o estado atual;
2. atualizar apenas o campo editado;
3. persistir a nova configuração;
4. receber o estado atualizado pelo Realtime.

---

# 18. Logos e imagens

Será criado um bucket no Supabase Storage:

```text
overlay-assets
```

Estrutura lógica:

```text
overlay-assets/
├── ba-ao-vivo/
│   └── logo.png
├── esportes/
│   └── logo.png
└── entrevista/
    └── logo.png
```

O painel permitirá:

- enviar logo;
- substituir logo;
- remover logo.

A URL resultante será salva na configuração da overlay.

Formatos iniciais recomendados:

- PNG;
- SVG;
- WEBP.

Limite de tamanho recomendado:

```text
5 MB
```

---

# 19. Estrutura do projeto Next.js

Estrutura recomendada:

```text
lower-overlay/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── painel/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── overlay/
│       └── [slug]/
│           └── page.tsx
│
├── components/
│   ├── overlay/
│   │   ├── LowerThird.tsx
│   │   ├── OverlayCanvas.tsx
│   │   ├── Shape.tsx
│   │   ├── TextElement.tsx
│   │   └── LogoElement.tsx
│   │
│   └── panel/
│       ├── ControlPanel.tsx
│       ├── LivePreview.tsx
│       ├── TextControls.tsx
│       ├── ShapeControls.tsx
│       ├── LogoControls.tsx
│       └── AnimationControls.tsx
│
├── hooks/
│   ├── useOverlay.ts
│   └── useOverlayRealtime.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── overlay-defaults.ts
│
├── types/
│   └── overlay.ts
│
└── public/
```

---

# 20. Componentes principais

## `LowerThird.tsx`

Componente central.

Recebe:

```text
config
isActive
```

E monta:

- barra superior;
- área central;
- textos;
- logo;
- barra inferior.

O mesmo componente será utilizado para:

- preview do painel;
- overlay do OBS.

Isso evita diferenças entre o que é editado e o que aparece no OBS.

## `LivePreview.tsx`

Exibe uma miniatura ou preview escalado da overlay.

## `ControlPanel.tsx`

Centraliza os controles.

## `useOverlayRealtime.ts`

Responsável por escutar atualizações do Supabase.

---

# 21. Segurança

Mesmo que inicialmente o painel seja simples, a overlay pública e o painel não devem ter o mesmo nível de acesso.

Recomendação:

```text
/overlay/[slug]
```

Pode ser acessível publicamente ou por URL secreta.

```text
/painel/[slug]
```

Deve ter proteção.

Opções:

### Opção simples

Token secreto na URL:

```text
/painel/ba-ao-vivo?key=TOKEN
```

### Opção recomendada

Supabase Auth.

Usuário autorizado faz login e recebe permissão de edição.

Para a primeira versão, pode ser implementada uma senha simples ou Supabase Auth.

---

# 22. URL pública versus URL protegida

Recomendação:

```text
OVERLAY
https://lower.seudominio.com/overlay/ba-ao-vivo
```

A overlay precisa ser fácil para o OBS carregar.

Painel:

```text
https://lower.seudominio.com/painel/ba-ao-vivo
```

Protegido.

O ideal é não expor credenciais do Supabase no navegador além das chaves públicas apropriadas.

Nunca usar chave `service_role` no frontend.

---

# 23. Variáveis de ambiente

Na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Se houver operações administrativas no servidor:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

A `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser enviada para o navegador.

---

# 24. Banco e permissões

Ativar RLS nas tabelas.

Políticas iniciais:

- leitura da overlay conforme necessidade;
- atualização apenas por usuário autenticado;
- upload apenas por usuário autorizado.

Se a overlay for pública, a política poderá permitir apenas `SELECT` para o registro correspondente, sem permitir edição.

---

# 25. Tela inicial

A página inicial poderá, futuramente, listar overlays:

```text
MINHAS OVERLAYS

[ BA AO VIVO ]       [ EDITAR ]
[ ESPORTES ]         [ EDITAR ]
[ ENTREVISTA ]       [ EDITAR ]

[ + NOVA OVERLAY ]
```

Não é obrigatório para o MVP.

O MVP pode começar diretamente com:

```text
/painel/ba-ao-vivo
```

---

# 26. MVP — primeira versão

A primeira versão deve ter:

## Overlay

- [ ] fundo transparente;
- [ ] resolução lógica 1920×1080;
- [ ] barra superior;
- [ ] área principal;
- [ ] barra inferior;
- [ ] texto principal;
- [ ] texto secundário;
- [ ] logo;
- [ ] ativar/desativar;
- [ ] atualização em tempo real.

## Painel

- [ ] edição de dois textos;
- [ ] ativar;
- [ ] desativar;
- [ ] preview ao vivo;
- [ ] upload de logo;
- [ ] modo transparente/redondo/quadrado para logo;
- [ ] posição X/Y;
- [ ] largura/altura;
- [ ] cor;
- [ ] gradiente;
- [ ] quatro cantos independentes.

## Infraestrutura

- [ ] Next.js;
- [ ] Vercel;
- [ ] Supabase Cloud;
- [ ] PostgreSQL;
- [ ] Realtime;
- [ ] Storage;
- [ ] subdomínio.

---

# 27. Fase 2

Depois do MVP:

- múltiplos templates;
- duplicar overlay;
- salvar presets;
- fontes personalizadas;
- mais de dois textos;
- relógio;
- data;
- contador;
- QR Code;
- imagens adicionais;
- sombras;
- animações avançadas;
- entrada e saída por elemento;
- copiar configurações;
- histórico de alterações.

---

# 28. Fase 3 — editor visual

Em uma versão posterior, o painel poderá permitir selecionar elementos diretamente no preview:

```text
┌────────────────────────────────────┐
│                                    │
│    [ Barra superior selecionada ]  │
│       ↔ largura                    │
│       ↕ altura                     │
│                                    │
│  [ MÁRIO CARVALHO ]                │
│                         [ LOGO ]    │
│                                    │
└────────────────────────────────────┘
```

O usuário poderá:

- arrastar;
- redimensionar;
- selecionar;
- editar propriedades.

Para o MVP, recomendo começar com campos numéricos X/Y/largura/altura.

---

# 29. Fluxo completo de uso

## Criar overlay

```text
1. Criar registro "ba-ao-vivo"
2. Gerar slug
3. Aplicar configuração padrão
```

## Configurar OBS

```text
1. Abrir OBS
2. Adicionar Fonte de Navegador
3. Inserir:
   https://lower.seudominio.com/overlay/ba-ao-vivo
4. Configurar 1920×1080
5. Colocar na camada superior
```

## Controlar

Em qualquer computador:

```text
1. Abrir:
   https://lower.seudominio.com/painel/ba-ao-vivo

2. Editar texto

3. Alterar logo, se necessário

4. Clicar em ATIVAR

5. A alteração aparece no OBS
```

## Desativar

```text
1. Abrir qualquer painel autorizado
2. Clicar em DESATIVAR
3. A lower sai da tela
```

---

# 30. Plano de desenvolvimento

## Etapa 1 — Fundação

- criar projeto Next.js;
- conectar Supabase;
- configurar variáveis;
- criar tabela `overlays`;
- criar bucket `overlay-assets`;
- configurar RLS;
- criar configuração padrão.

## Etapa 2 — Renderização

- criar `LowerThird`;
- criar canvas lógico;
- implementar barras;
- implementar área central;
- implementar textos;
- implementar logo;
- criar fundo transparente.

## Etapa 3 — Overlay OBS

- criar `/overlay/[slug]`;
- carregar configuração;
- conectar Realtime;
- atualizar sem reload;
- implementar visibilidade.

## Etapa 4 — Painel

- criar `/painel/[slug]`;
- preview;
- controles de texto;
- controles de visibilidade;
- sincronização Realtime.

## Etapa 5 — Editor visual

- X/Y;
- largura/altura;
- cores;
- gradientes;
- bordas independentes;
- logo.

## Etapa 6 — Arquivos

- upload;
- Storage;
- preview;
- troca de logo;
- remoção.

## Etapa 7 — Animações

- entrada;
- saída;
- duração;
- preview.

## Etapa 8 — Segurança e produção

- autenticação;
- RLS;
- proteção do painel;
- domínio;
- subdomínio;
- testes no OBS.

---

# 31. Critérios de sucesso

O sistema estará funcionando corretamente quando:

1. o OBS carregar a URL da overlay;
2. o fundo da página estiver transparente;
3. a lower aparecer corretamente;
4. um computador remoto abrir o painel;
5. alterar o texto atualizar a lower;
6. alterar a cor atualizar a lower;
7. mover um elemento atualizar a lower;
8. trocar a logo atualizar a lower;
9. ativar mostrar a lower;
10. desativar esconder a lower;
11. vários painéis visualizarem o mesmo estado;
12. alterações aparecerem em tempo real sem atualizar a página.

---

# 32. Decisão final de arquitetura

A arquitetura aprovada para o projeto é:

```text
                 DOMÍNIO
                    │
                    ▼
        lower.seudominio.com
                    │
                    ▼
             NEXT.JS / VERCEL
             ┌───────────────┐
             │               │
             │ /painel/[id]  │
             │ /overlay/[id] │
             └───────┬───────┘
                     │
                     ▼
              SUPABASE CLOUD
             ┌───────────────┐
             │ PostgreSQL    │
             │ Realtime      │
             │ Storage       │
             │ Auth          │
             └───────────────┘
                     ▲
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
  Painel PC A    Painel PC B        OBS
                                   Browser
                                   Source
```

## Tecnologias

```text
Frontend:
Next.js + TypeScript

Hospedagem:
Vercel

Banco:
Supabase PostgreSQL

Tempo real:
Supabase Realtime

Arquivos:
Supabase Storage

Estilização:
CSS/Tailwind — decisão de implementação

Overlay:
HTML/CSS renderizado pelo navegador do OBS
```

## Recomendação final

Começar com **uma única overlay `ba-ao-vivo`**, usando o layout base fornecido. Primeiro construir a infraestrutura e a sincronização em tempo real; depois reproduzir o visual; em seguida construir o painel completo de edição.

O componente visual da lower deve ser único e reutilizado tanto na página do OBS quanto na prévia do painel. Essa decisão é fundamental para garantir que o preview e o resultado final sejam iguais.
