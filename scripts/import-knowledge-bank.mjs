import fs from 'node:fs';
import path from 'node:path';

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Provide the downloaded Knowledge Bank HTML file path.');
}

const html = fs.readFileSync(sourcePath, 'utf8');
const start = html.indexOf('<div class="entry-content">');
const end = html.indexOf('</div><!-- .entry-content -->', start);

if (start === -1 || end === -1) {
  throw new Error('Knowledge Bank content container could not be found.');
}

const sourceBody = html
  .slice(start, end)
  .replace(/<img[\s\S]*?>/gi, '')
  .replace(/<a[^>]*>|<\/a>/gi, '');

const sections = sourceBody.split(
  /(?=<h2 class="wp-block-heading"><strong>Change in Law)|(?=<p><strong>LEGALITY OF RESTRICTION)|(?=<h1 class="wp-block-heading">WHO CAN BE AN ARBITRATOR)/,
);

const articles = [
  {
    file: 'territorial-jurisdiction-consumer-commissions.md',
    title: 'Territorial Jurisdiction of Consumer Commissions Under the Consumer Protection Act, 2019',
    author: 'Jos Chiramel',
    category: 'Consumer Law',
    order: 1,
    skip: 2,
  },
  {
    file: 'change-in-law-workers-cess.md',
    title: "Change in Law - Effect on Workers' Cess Implemented by States Later On",
    author: 'Jos Chiramel',
    category: 'Construction & Arbitration',
    order: 2,
    skip: 2,
  },
  {
    file: 'restriction-on-period-of-limitation.md',
    title: 'Legality of Restriction on Period of Limitation',
    author: 'Jos Chiramel',
    category: 'Contract Law',
    order: 3,
    skip: 2,
  },
  {
    file: 'cpwd-arbitrator-eligibility.md',
    title: 'Who Can Be an Arbitrator in a CPWD Dispute',
    author: 'Jos Chiramel',
    category: 'Arbitration',
    order: 4,
    skip: 3,
  },
];

const namedEntities = {
  amp: '&',
  apos: "'",
  hellip: '...',
  ldquo: '"',
  lsquo: "'",
  ndash: '-',
  nbsp: ' ',
  quot: '"',
  rdquo: '"',
  rsquo: "'",
};

function cleanHtmlText(value) {
  return value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (_, entity) => namedEntities[entity.toLowerCase()] ?? `&${entity};`)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

function quoteYaml(value) {
  return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

if (sections.length !== articles.length) {
  throw new Error(`Expected ${articles.length} articles; found ${sections.length}.`);
}

for (const [index, article] of articles.entries()) {
  const paragraphs = [...sections[index].matchAll(/<(?:p|h1|h2)[^>]*>([\s\S]*?)<\/(?:p|h1|h2)>/gi)]
    .map((match) => cleanHtmlText(match[1]))
    .filter((paragraph) => paragraph && !/^_+$/.test(paragraph))
    .slice(article.skip);

  const excerpt = paragraphs[0];
  const frontmatter = [
    '---',
    `title: ${quoteYaml(article.title)}`,
    `author: ${quoteYaml(article.author)}`,
    `category: ${quoteYaml(article.category)}`,
    `order: ${article.order}`,
    'sourceUrl: "https://chiramelco.org/knowledge-bank"',
    `excerpt: ${quoteYaml(excerpt)}`,
    '---',
    '',
  ].join('\n');

  const markdown = `${frontmatter}${paragraphs.join('\n\n')}\n`;
  const outputPath = path.join('src/content/articles', article.file);
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`Imported ${article.title}: ${paragraphs.length} paragraphs.`);
}
