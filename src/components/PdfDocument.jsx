import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';

/**
 * Eu sou o PdfDocument — o componente que transforma os garranchos
 * desenhados pelo usuário em um documento PDF real, usando o
 * @react-pdf/renderer.
 *
 * LÓGICA CRÍTICA DE RENDERIZAÇÃO:
 *
 * 1. Recebo o texto digitado e o dicionário de letras (imagens Base64).
 * 2. Converto o texto para minúsculas e o divido em linhas (por '\n').
 * 3. Cada linha é dividida em palavras (por espaço).
 * 4. Cada palavra é dividida em caracteres individuais.
 * 5. Para cada caractere:
 *    - Se é uma letra a-z E o usuário a desenhou → renderizo um <Image> com a Base64.
 *    - Se é uma letra a-z mas NÃO foi desenhada → renderizo um quadrado cinza placeholder.
 *    - Se é um espaço → renderizo um <View> vazio com largura fixa de 15px.
 *    - Se é pontuação, número ou outro → renderizo o caractere como <Text>.
 *
 * 6. O container pai usa flexDirection: 'row' e flexWrap: 'wrap' para
 *    que as palavras quebrem de linha naturalmente dentro da margem A4.
 *
 * O resultado é um PDF que parece ter sido escrito à mão — com toda
 * a glória caótica dos garranchos do usuário! 🦆
 */

const LETTER_SIZE = 22;
const SPACE_WIDTH = 12;
const LINE_HEIGHT = LETTER_SIZE + 6;

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFDF7',
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 8,
    color: '#a8a29e',
    marginBottom: 20,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  lineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  letterImage: {
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    objectFit: 'contain',
  },
  space: {
    width: SPACE_WIDTH,
    height: LETTER_SIZE,
  },
  missingLetter: {
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    backgroundColor: '#e7e5e4',
    borderRadius: 2,
  },
  punctuation: {
    fontSize: 14,
    color: '#44403c',
    marginBottom: 2,
    lineHeight: 1,
  },
  lineBreak: {
    width: '100%',
    height: LINE_HEIGHT * 0.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 7,
    color: '#d6d3d1',
    fontStyle: 'italic',
  },
  ruledLine: {
    position: 'absolute',
    left: 45,
    right: 45,
    height: 0.5,
    backgroundColor: '#e3f2fd',
  },
});

/**
 * Eu gero linhas horizontais estilo caderno pautado no fundo da página,
 * para dar aquele visual de "papel de caderno" ao PDF gerado.
 */
function RuledLines() {
  const lines = [];
  const startY = 45;
  const spacing = LINE_HEIGHT;
  const pageHeight = 842; // A4 height in points
  const endY = pageHeight - 60;

  for (let y = startY; y < endY; y += spacing) {
    lines.push(
      <View
        key={y}
        style={[styles.ruledLine, { top: y }]}
      />
    );
  }

  return <>{lines}</>;
}

/**
 * Eu renderizo um único caractere no PDF — o átomo mais fundamental
 * de todo o Garranchito. Decido se mostro uma imagem desenhada,
 * um placeholder cinza, ou o próprio caractere como texto.
 */
function CharacterRenderer({ char, letters }) {
  // Letra minúscula que foi desenhada → mostro a imagem!
  if (/[a-z]/.test(char) && letters[char]) {
    return (
      <Image
        src={letters[char]}
        style={styles.letterImage}
      />
    );
  }

  // Letra minúscula que NÃO foi desenhada → placeholder cinza
  if (/[a-z]/.test(char) && !letters[char]) {
    return <View style={styles.missingLetter} />;
  }

  // Números, pontuação e outros caracteres → texto simples
  return (
    <Text style={styles.punctuation}>{char}</Text>
  );
}

/**
 * Eu sou o Document principal do PDF.
 * Recebo o texto e as letras e transformo tudo num PDF bonitinho
 * (ou melhor, garranchitonamente caótico).
 */
export default function GarranchoPdfDocument({ text, letters }) {
  // Divido o texto em linhas (respeitando o \n do usuário)
  const lines = text.split('\n');

  return (
    <Document
      title="Garranchito — Documento com Garranchos"
      author="Garranchito App"
      subject="Texto escrito com caligrafia digital personalizada"
    >
      <Page size="A4" style={styles.page}>
        {/* Linhas de caderno no fundo */}
        <RuledLines />

        {/* Cabeçalho sutil */}
        <Text style={styles.header}>
          feito com garranchito 🦆
        </Text>

        {/* Conteúdo do texto renderizado como imagens */}
        {lines.map((line, lineIndex) => {
          // Linha vazia = quebra de linha visual
          if (line.trim() === '') {
            return <View key={`line-${lineIndex}`} style={styles.lineBreak} />;
          }

          // Divido a linha em palavras
          const words = line.split(' ');

          return (
            <View key={`line-${lineIndex}`} style={styles.lineContainer}>
              {words.map((word, wordIndex) => (
                <View key={`word-${lineIndex}-${wordIndex}`} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  {/* Renderizo cada caractere da palavra */}
                  {word.toLowerCase().split('').map((char, charIndex) => (
                    <CharacterRenderer
                      key={`char-${lineIndex}-${wordIndex}-${charIndex}`}
                      char={char}
                      letters={letters}
                    />
                  ))}
                  {/* Espaço entre palavras (exceto a última) */}
                  {wordIndex < words.length - 1 && (
                    <View style={styles.space} />
                  )}
                </View>
              ))}
            </View>
          );
        })}

        {/* Rodapé */}
        <Text style={styles.footer}>
          Este documento foi gerado pelo Garranchito — uma absurda máquina de datilografia com problemas de caligrafia.
        </Text>
      </Page>
    </Document>
  );
}
