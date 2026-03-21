
import { LegalLayout } from '@/components/layout/LegalLayout';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { formatDatePretty } from '@/utils/date';

async function getLegalDocumentContent(slug: string): Promise<string | null> {
  const validSlugs: { [key: string]: string } = {
    'privacy-policy': 'privacy-policy.md',
    'terms-of-service': 'terms-of-service.md',
    'eula': 'eula.md',
  };

  const filename = validSlugs[slug];
  if (!filename) {
    return null;
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'legal', filename);
    let content = await fs.readFile(filePath, 'utf8');
    // Replace placeholder for current date
    content = content.replace(/{{CURRENT_DATE}}/g, formatDatePretty(new Date()));
    return content;
  } catch (error) {
    console.error(`Error reading legal document ${filename}:`, error);
    return null;
  }
}

// Basic Markdown to HTML converter
const MarkdownDisplay = ({ markdownContent }: { markdownContent: string }) => {
  // Replace ### Title with <h3>Title</h3>
  let html = markdownContent.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
  // Replace ## Title with <h2>Title</h2>
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4 border-b pb-2">$1</h2>');
  // Replace # Title with <h1>Title</h1>
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>');
  
  // Replace * Item or - Item with <li>Item</li>
  html = html.replace(/^(\* |\- ) (.*$)/gim, '<li>$2</li>');
  
  // Wrap consecutive <li> items in <ul>
  html = html.replace(/^(<li>.*<\/li>\s*)+/gim, (match) => `<ul class="list-disc pl-6 space-y-1 my-4">${match.trim()}</ul>`);

  // Replace paragraphs (blocks of text separated by double newlines)
  // Ensure that <ul> is not wrapped in <p>
  html = html.split(/\n\s*\n/).map(paragraph => {
    if (paragraph.startsWith('<ul') || paragraph.startsWith('<h')) {
      return paragraph;
    }
    return `<p class="mb-4 leading-relaxed">${paragraph.replace(/\n/g, '<br />')}</p>`;
  }).join('');
  
  // Basic link conversion: [Text](URL) to <a href="URL">Text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default async function LegalDocumentPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const content = await getLegalDocumentContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <LegalLayout>
      <article className="prose dark:prose-invert max-w-none">
        <MarkdownDisplay markdownContent={content} />
      </article>
    </LegalLayout>
  );
}

export async function generateStaticParams() {
  const legalSlugs = ['privacy-policy', 'terms-of-service', 'eula'];
  return legalSlugs.map(slug => ({ slug }));
}

// Generate metadata for each legal page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const titles: { [key: string]: string } = {
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'eula': 'End User License Agreement (EULA)',
  };
  const title = titles[params.slug] || "Legal Document";
  return {
    title: `${title} | Raising Atlantic`,
  };
}
