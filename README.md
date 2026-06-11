<div align="center">
  <h1>🦆 Garranchito 🦆</h1>
  <p><em>Uma Absurda Máquina de Datilografia com Problemas de Caligrafia</em></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/React_PDF-EC5990?style=for-the-badge&logo=react&logoColor=white" alt="React PDF" />
  <img src="https://img.shields.io/badge/Web_Audio_API-FF6F00?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web Audio API" />
</div>

<br />

## 📖 Sobre o Projeto

O **Garranchito** (diminutivo carinhoso de "garrancho", que por sua vez é o apelido nada carinhoso para uma caligrafia desastrosa) é uma aplicação web que permite ao usuário **desenhar manualmente todas as letras do alfabeto** na tela, salvar esses traços como imagens, digitar um texto qualquer e exportar um **PDF onde cada caractere é a letra que ele acabou de rabiscar com o dedo ou o mouse**.

Em outras palavras: é um sistema tipográfico completo que transforma a sua caligrafia de médico em uma fonte digital — sem julgamentos, sem correções ortográficas, sem Comic Sans. Apenas você, seus garranchos e um documento oficial que parece ter sido escrito por uma criança de 6 anos (ou por um adulto usando o celular no ônibus, que é praticamente a mesma coisa).

> **Uma ferramenta que absolutamente ninguém pediu, mas que todo mundo secretamente precisa** — Porque quem nunca quis mandar um e-mail corporativo escrito à mão, com toda a autoridade de quem domina a arte de fazer um "A" parecer um "Q"? Pois é: agora você pode. Com exportação em PDF A4 e tudo.

---

## ✨ Principais Funcionalidades

- ✏️ **Estúdio de Caligrafia:** Um canvas responsivo e sensível ao toque para o usuário desenhar cada letra do alfabeto, uma por uma, com a solenidade de um calígrafo medieval — ou com a pressa de quem está atrasado para o almoço.
- 🖨️ **Máquina de Escrever:** Uma textarea com linhas de caderno onde o usuário digita o texto dos seus sonhos, que será renderizado com os garranchos que ele acabou de cometer.
- 📄 **Exportação PDF (@react-pdf/renderer):** Documento A4 pautado onde cada caractere é uma `<Image>` do traço desenhado. O resultado é um PDF que parece ter sido escrito à mão — porque tecnicamente foi.
- 💾 **Salvar e Carregar Fonte (.garrancho):** Exporte sua obra-prima tipográfica como um arquivo `.garrancho` e carregue-a em outro dispositivo, outro navegador, outro continente. Ideal para apresentações, compartilhamento entre amigos, ou para quando você finalmente desenhar um "R" que não pareça um "P" bêbado e quiser preservar esse momento histórico para a posteridade.
- 🎨 **Seletor de Cor e Espessura:** Porque a caligrafia ruim merece ser colorida. Escolha entre tinta nanquim, caneta Bic azul, a temida caneta vermelha do professor, entre outras.
- 🦆 **O Pato Faz Quack:** Easter egg no patinho do cabeçalho — clique nele e, com uma chance aleatória de ~18%, ele emitirá um grasnado sintetizado via Web Audio API. São 10 variantes sonoras. Boa sorte encontrando todas.
- 🌙 **Tema Claro/Escuro:** Porque garranchos ficam igualmente feios sob qualquer iluminação, mas pelo menos seus olhos agradecem.

| Funcionalidade | O que faz na prática |
| --- | --- |
| **Canvas de Desenho** | `react-sketch-canvas` com export PNG transparente em Base64. Suporta dedo (mobile) e mouse (desktop). |
| **Galeria de Progresso** | Grid com as 26 letras — as conquistadas exibem o traço salvo; as pendentes esperam com a paciência de um professor corrigindo provas. |
| **Preview em Tempo Real** | Enquanto você digita, um preview mostra como ficará cada caractere usando suas letras desenhadas. |
| **Geração de PDF** | `@react-pdf/renderer` com `flexDirection: 'row'` e `flexWrap: 'wrap'` para quebra de linha natural em folha A4 pautada. |
| **Salvar/Carregar Fonte** | Export/import do dicionário de letras como arquivo `.garrancho` (JSON com metadados). Validação de estrutura na importação + confirmação antes de sobrescrever. |
| **Sintetizador de Quacks** | Web Audio API gerando grasnados com osciladores e filtros passa-banda. Zero arquivos de áudio. Puro código. Pura ciência. Puro pato. |

---

## 🛠️ Arquitetura e Tecnologias

O ecossistema escolhido garante que, enquanto o usuário rabisca com a delicadeza de um sismógrafo durante um terremoto, a aplicação funciona com a precisão de um relógio suíço:

* **[React 19](https://react.dev/):** Porque se é para fazer algo desnecessário, que seja com a biblioteca mais popular do mundo.
* **[Vite](https://vite.dev/):** Build em milissegundos para que a frustração com a própria caligrafia não seja agravada pela lentidão do bundler.
* **[TailwindCSS v4](https://tailwindcss.com/):** Estilização utilitária com tema customizado de cores pastéis, porque garranchos merecem um ambiente acolhedor.
* **[@react-pdf/renderer](https://react-pdf.org/):** A peça central — transforma componentes React em documentos PDF reais, caractere por caractere, garrancho por garrancho.
* **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API):** Para que o pato não seja apenas decorativo. Osciladores, filtros e envelopes de ganho — tudo para um "quack" convincente.

| Camada | Tecnologia |
| --- | --- |
| **Framework** | React 19 + Vite 8 |
| **Estilização** | TailwindCSS v4 (via `@tailwindcss/vite`) |
| **Canvas de Desenho** | react-sketch-canvas v8 |
| **Geração de PDF** | @react-pdf/renderer v4 |
| **Ícones** | lucide-react |
| **Áudio** | Web Audio API (nativa do browser) |
| **Estado Global** | React Context API |
| **Tipografia** | Google Fonts (Caveat + Inter) |

---

## 🎭 Fluxo da Aplicação (A Caligrafia em Ação)

| Etapa | O que acontece |
| --- | --- |
| ✏️ **1. Estúdio** | O usuário desenha cada letra (A–Z) no canvas, com todo o cuidado de quem está assinando um cheque... ou com a negligência de quem está rabiscando na margem do caderno durante a aula. |
| 💾 **2. Salvar** | Ao clicar em "Salvar Letra", o traço é capturado como PNG transparente em Base64 e armazenado no dicionário global. A aplicação avança automaticamente para a próxima letra. |
| 📋 **3. Galeria** | Um grid mostra todas as 26 letras — as preenchidas exibem o desenho; as vazias exibem a letra em cinza, esperando sua vez de ser arruinada. |
| 📦 **3.5. Salvar/Carregar Fonte** | Na galeria, o usuário pode exportar todos os garranchos como um arquivo `.garrancho` ("Salvar Fonte") ou importar uma fonte previamente salva ("Carregar Fonte"). Perfeito para apresentações ou para não perder aquele "S" que ficou *quase* legível. |
| ⌨️ **4. Digitar** | Na aba "Máquina de Escrever", o usuário digita o texto desejado. Um preview mostra em tempo real como ficará com os garranchos. |
| 📄 **5. PDF** | O botão glorioso gera um PDF A4 pautado onde cada caractere é uma imagem do traço desenhado. Espaços viram `<View>`s vazios. Pontuação fica como texto. Letras não desenhadas viram quadrados cinza da vergonha. |

---

## 🚀 Guia de Instalação (Sem Garranchos)

A aplicação roda inteiramente no navegador. Sem backend, sem banco de dados, sem desculpas.

**Pré-requisito:** Node.js (v18+) instalado.

### 1. Clone o Repositório
```bash
git clone https://github.com/LeahRCS/garranchito.git
cd garranchito
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Inicie o Servidor de Desenvolvimento
```bash
npm run dev
```

O Vite sobe com a flag `--host`, expondo automaticamente na rede local:

- 🌐 **Local:** `http://localhost:5173`
- 📱 **Rede (Mobile):** `http://<SEU-IP>:5173`

> **Dica:** Acesse pelo celular usando o IP da rede local. Desenhar letras com o dedo na tela é a experiência definitiva do Garranchito — e a que mais se aproxima de escrever de verdade (com a ressalva de que papel não tem lag).

---

## 📁 Estrutura do Repositório

```
garranchito/
├── index.html                      # Entry point com Google Fonts (Caveat + Inter)
├── vite.config.js                  # Vite + TailwindCSS v4 + host: true
├── package.json                    # Scripts com --host para rede local
├── public/
│   └── vite.svg                    # Favicon do pato 🦆
└── src/
    ├── main.jsx                    # Ponto de entrada do React
    ├── index.css                   # Design system completo (light/dark, caderno, animações)
    ├── App.jsx                     # Layout principal, abas, toasts
    ├── context/
    │   └── GarranchitoContext.jsx   # Cérebro: dicionário de letras, tema, navegação, load/save
    ├── components/
    │   ├── Header.jsx              # Logo, título, toggle de tema, O PATO QUE FAZ QUACK
    │   ├── CanvasStudio.jsx        # Estúdio: canvas, cores, espessura, salvar/desfazer, import/export de fonte
    │   ├── LetterGallery.jsx       # Grid das 26 letras (progresso visual)
    │   ├── TypewriterSection.jsx   # Máquina: textarea, preview, BOTÃO GLORIOSO do PDF
    │   ├── PdfDocument.jsx         # @react-pdf/renderer: Document → Page → Image por caractere
    │   └── Toast.jsx               # Notificações animadas
    └── utils/
        ├── fontSerializer.js       # Export/import de fontes .garrancho (JSON com validação)
        └── quackSynth.js           # Sintetizador de grasnados via Web Audio API (10 variantes)
```

---

## 🦆 Sobre o Pato

O pato não é decorativo. O pato é uma feature.

Ao clicar no emoji 🦆 do cabeçalho, existe uma chance de **~18% por clique** de ele soltar um "Quack!" — com balão de fala animado e som sintetizado via Web Audio API. São **10 variantes** de grasnado, cada uma com personalidade sonora própria:

| Mensagem | Descrição do Som |
| --- | --- |
| `Quack!` | Padrão, simpático, o quack do dia a dia |
| `Quack!!` | Mais agudo e enfático — o pato está empolgado |
| `QUAAACK!` | Longo e dramático, com harmônico — o pato está indignado |
| `quack?` | O pitch sobe no final — o pato está confuso |
| `Quack! 🦆` | Feliz, com eco — o pato se encontrou |
| `...quack.` | Baixinho, hesitante — o pato está tímido |
| `QUACK QUACK!` | Duplo! — o pato tem muito a dizer |
| `quaaack~` | Lento e preguiçoso — o pato acordou agora |
| `Q u a c k !` | Staccato robótico — o pato é na verdade um android |
| `*quack*` | Sussurrado — o pato está contando um segredo |

A imprevisibilidade é o ponto. Pode ser no primeiro clique. Pode ser no décimo quinto. O pato não te deve explicações.

**OBS: Ainda não achei um jeito melhor dos "grasnados" parecerem realmente grasnados, então vamos nos contentar por enquanto nos barulhinhos que ele faz, ok?**

---

## 📜 Licença

MIT — Porque até uma caligrafia ilegível merece ser open-source.

---

<div align="center">
  <br />
  <em>Rabiscado com muito carinho (e zero habilidade caligráfica) por <a href="https://github.com/LeahRCS">Leah R.C.S.</a></em>
  <br /><br />
  <sub>Nenhum pato foi silenciado durante o desenvolvimento desta aplicação. Os garranchos, por outro lado, são irrecuperáveis.</sub>
</div>
