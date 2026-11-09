import { marked, Tokens } from 'marked';
import yaml from 'js-yaml';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';
import { parse } from '@vue/compiler-sfc';
import path from 'path';
import { FileImportToken, I18nDescriptionToken } from './interface';

const languages = ['shell', 'js', 'ts', 'jsx', 'tsx', 'less', 'diff'];
loadLanguages(languages);

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const cleanUrl = (href: string) => {
  try {
    const url = decodeURIComponent(href)
      .split('')
      .filter((character) => character.charCodeAt(0) > 0x20)
      .join('');
    if (/^(javascript|vbscript|data):/i.test(url)) {
      return null;
    }
  } catch {
    return null;
  }
  return href;
};

const frontMatter = {
  name: 'frontMatter',
  level: 'block',
  tokenizer(src: string) {
    const rule = /^```yaml\n+(.+?)\n+```(?:\n|$)/s;
    const match = rule.exec(src);
    if (match) {
      const text = match[1].trim();
      const attributes = yaml.load(text);

      return {
        type: 'frontMatter',
        raw: match[0],
        text,
        attributes,
      };
    }
    return undefined;
  },
  renderer() {
    // frontMatter不返回内用
    return '';
  },
};

const fileImport = {
  name: 'fileImport',
  level: 'block',
  tokenizer(src: string) {
    const rule = /^@import\s+(.+)(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      const filename = match[1].trim();
      const basename = path.basename(filename, '.md');

      return {
        type: 'fileImport',
        raw: match[0],
        filename,
        basename,
      };
    }
    return undefined;
  },
  renderer(token: FileImportToken) {
    return `<demo-${token.basename} />\n`;
  },
};

const i18nDescription = {
  name: 'i18nDescription',
  level: 'block',
  tokenizer(src: string) {
    const rule = /^##\s+(zh-CN|en-US)\n+(.+?)\n+---(?:\n|$)/s;
    const match = rule.exec(src);

    if (match) {
      const text = match[2].trim();
      const content = marked.parse(text);
      return {
        type: 'i18nDescription',
        raw: match[0],
        text,
        locale: match[1],
        content,
      };
    }
    return undefined;
  },
  renderer(token: I18nDescriptionToken) {
    return token.content;
  },
};

marked.use({
  breaks: true,
  xhtml: true,
  renderer: {
    heading(this: any, token: Tokens.Heading) {
      const text = this.parser.parseInline(token.tokens);
      if (token.depth === 2) {
        const anchor = token.text.replace(/\s+/g, '-');
        return `<anchor-head level="${token.depth}" href="${anchor}">${text}</anchor-head>`;
      }
      return `<h${token.depth} id="${escape(token.text)}">${text}</h${token.depth}>`;
    },
    link(this: any, token: Tokens.Link) {
      const href = cleanUrl(token.href);
      const text = this.parser.parseInline(token.tokens);
      if (href === null) {
        return text;
      }
      let out = `<a class="link" href="${escape(href)}"`;
      if (token.title) {
        if (/_blank/.test(token.title)) {
          out += ` target="_blank"`;
          const title = token.title.replace('_blank', '').trim();
          if (title) {
            out += ` title="${escape(title)}"`;
          }
        } else {
          out += ` title="${escape(token.title)}"`;
        }
      }
      return `${out}>${text}</a>`;
    },
    code(token: Tokens.Code) {
      const lang = (token.lang || '').match(/\S*/)?.[0];
      let code = token.text;
      if (lang === 'vue') {
        const { descriptor } = parse(code);
        const { script, styles } = descriptor;

        let htmlContent = code;
        const hasStyle = Boolean(styles.length > 0);
        if (script?.content) {
          htmlContent = htmlContent.replace(script.content, '$script$');
        }
        if (hasStyle) {
          styles.forEach((style, index) => {
            htmlContent = htmlContent.replace(
              style.content,
              `$style-${index}$`,
            );
          });
        }

        let highlighted = Prism.highlight(
          htmlContent,
          Prism.languages.html,
          'html',
        );
        if (script?.content) {
          const lang = script.lang ?? 'js';
          const highlightedScript = Prism.highlight(
            script.content,
            Prism.languages[lang],
            lang,
          );
          highlighted = highlighted.replace('$script$', highlightedScript);
        }
        if (hasStyle) {
          styles.forEach((style, index) => {
            const lang = style.lang ?? 'css';
            const highlightedStyle = Prism.highlight(
              style.content,
              Prism.languages[lang],
              lang,
            );
            highlighted = highlighted.replace(
              `$style-${index}$`,
              highlightedStyle,
            );
          });
        }

        code = highlighted;
      } else if (lang && languages.includes(lang)) {
        code = Prism.highlight(code, Prism.languages[lang], lang);
      }
      code = code.replace(/{{|}}/g, (string) => {
        if (string === '{{') {
          return '&#123;&#123;';
        }
        return '&#125;&#125;';
      });
      code = `${code.replace(/\n$/, '')}\n`;

      if (!lang) {
        return `<pre class="code-content"><code>${code}</code></pre>\n`;
      }

      return `<pre class="code-content"><code class="language-${lang}">${code}</code></pre>\n`;
    },
    table(this: any, token: Tokens.Table) {
      const header = token.header
        .map((cell) => this.parser.parseInline(cell.tokens))
        .join('');
      const body = token.rows
        .map(
          (row) =>
            `<a-tr>${row
              .map((cell) => this.parser.parseInline(cell.tokens))
              .join('')}</a-tr>`,
        )
        .join('');
      return `<a-table class="component-api-table">
  <colgroup>
    <col style="min-width: 120px"/>
  </colgroup>
  <a-thead>${header}</a-thead><a-tbody>${body}</a-tbody>
</a-table>`;
    },
  },
  // @ts-ignore @types/marked版本过低导致
  extensions: [i18nDescription, fileImport, frontMatter],
});

export default marked;
