import { en, zh, type Language } from './index';
import { zhUi } from './dictionaries/zh-ui';

const chineseText: Record<string, string> = { ...zhUi };
function indexTranslations(english: object, chinese: object) {
  for (const [key, value] of Object.entries(english)) {
    const translated = (chinese as Record<string, unknown>)[key];
    if (typeof value === 'string' && typeof translated === 'string')
      chineseText[value] = translated;
    else if (value && translated && typeof value === 'object' && typeof translated === 'object')
      indexTranslations(value, translated);
  }
}
indexTranslations(en, zh);

const lookup = new Map(Object.entries(chineseText));

/** Translate built-in interface text. Unrecognized CMS content stays as authored. */
export function translateUi(text: string | null | undefined, language: Language): string {
  if (!text) return '';
  if (language !== 'ZH')
    return lookup.has(text)
      ? text
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
      : text;
  const translated = lookup.get(text) || lookup.get(text.replace(/\s+/g, ' ').trim());
  if (translated) return translated;
  const patterns: [RegExp, (match: RegExpMatchArray) => string][] = [
    [/^(\d+) Pending Review$/, (m) => `${m[1]} 待审核`],
    [/^(\d+) Pending Contact$/, (m) => `${m[1]} 待联系`],
    [/^Edit Department: (.+)$/, (m) => `编辑院系：${m[1]}`],
    [/^No (.+) added for this campus\.$/, (m) => `此校区尚未添加${m[1]}。`],
    [/^Move (.+) up$/, (m) => `上移${m[1]}`],
    [/^Move (.+) down$/, (m) => `下移${m[1]}`],
    [/^Delete (.+) contact section$/, (m) => `删除${m[1]}的联系信息`],
    [/^Remove (.+)$/, (m) => `移除${m[1]}`],
  ];
  for (const [pattern, format] of patterns) {
    const match = text.match(pattern);
    if (match) return format(match);
  }
  return text;
}
