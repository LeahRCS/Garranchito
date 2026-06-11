/**
 * Eu sou o serializador de fontes do Garranchito — o módulo que
 * transforma o dicionário de letras desenhadas em um arquivo
 * .garrancho (JSON) e vice-versa.
 *
 * Formato do arquivo:
 * {
 *   version: 1,
 *   name: "Nome da Fonte",
 *   createdAt: "2026-06-11T...",
 *   letters: { a: "data:image/png;base64,...", ... }
 * }
 */

const CURRENT_VERSION = 1;
const VALID_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * Eu exporto o dicionário de letras como um Blob JSON pronto
 * para download. Adiciono metadados como versão e data de criação
 * para que o arquivo seja auto-descritivo.
 *
 * @param {Object} letters - Dicionário { a: 'data:image/png;base64,...', ... }
 * @param {string} [name] - Nome opcional para a fonte
 * @returns {{ blob: Blob, filename: string }}
 */
export function exportFont(letters, name) {
  const fontName = name || 'minha-fonte';
  const payload = {
    version: CURRENT_VERSION,
    name: fontName,
    createdAt: new Date().toISOString(),
    letters: { ...letters },
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  // Gero um nome de arquivo limpo e legível
  const safeName = fontName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')    // Substitui caracteres especiais por hífens
    .replace(/^-+|-+$/g, '');        // Remove hífens nas pontas

  const filename = `garranchito-${safeName}.garrancho`;

  return { blob, filename };
}

/**
 * Eu importo um arquivo .garrancho e extraio o dicionário de letras.
 * Faço validações rigorosas para garantir que o arquivo é legítimo:
 * - Precisa ter a estrutura correta (version, letters)
 * - Cada letra precisa ser uma chave válida (a-z)
 * - Cada valor precisa ser uma string (esperamos base64, mas não
 *   validamos o conteúdo da imagem em si)
 *
 * @param {File} file - O arquivo selecionado pelo usuário
 * @returns {Promise<{ name: string, letters: Object, count: number }>}
 * @throws {Error} Se o arquivo for inválido
 */
export async function importFont(file) {
  // Leio o conteúdo do arquivo como texto
  const text = await file.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('O arquivo não é um JSON válido. Tem certeza que é um .garrancho? 🤔');
  }

  // Verifico a estrutura básica
  if (!data || typeof data !== 'object') {
    throw new Error('O arquivo está vazio ou mal formatado.');
  }

  if (!data.letters || typeof data.letters !== 'object') {
    throw new Error('O arquivo não contém um dicionário de letras válido.');
  }

  // Filtro apenas letras válidas (a-z) com valores que são strings
  const validLetters = {};
  let count = 0;

  for (const letter of VALID_LETTERS) {
    if (data.letters[letter] && typeof data.letters[letter] === 'string') {
      validLetters[letter] = data.letters[letter];
      count++;
    }
  }

  if (count === 0) {
    throw new Error('O arquivo não contém nenhuma letra desenhada. Está vazio! 📭');
  }

  return {
    name: data.name || 'Fonte Importada',
    letters: validLetters,
    count,
  };
}
