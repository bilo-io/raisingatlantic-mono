
import { LegalLayout } from '@/components/layout/LegalLayout';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { formatDatePretty } from '@/utils/date';
import { getServerLocale, isValidLocale } from '@/utils/locale';
import { MarkdownContent } from '@/components/ui/markdown-content';

async function getLegalDocumentContent(slug: string, locale: string = 'en'): Promise<string | null> {
  const validSlugs: { [key: string]: string } = {
    'privacy-policy': 'privacy-policy.md',
    'terms-of-service': 'terms-of-service.md',
    'eula': 'eula.md',
    'cookie-policy': 'cookie-policy.md',
    'acceptable-use-policy': 'acceptable-use-policy.md',
    'disclaimer': 'disclaimer.md',
    'clinician-service-agreement': 'clinician-service-agreement.md',
    'master-services-agreement': 'master-services-agreement.md',
    'data-processing-agreement': 'data-processing-agreement.md',
  };

  const filename = validSlugs[slug];
  if (!filename) {
    return null;
  }

  // Use the provided locale if valid, otherwise fallback to 'en'
  const targetLocale = isValidLocale(locale) ? locale : 'en';

  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'legal', targetLocale, filename);
    
    // Check if the file exists for the target locale, if not, fallback to 'en'
    let finalPath = filePath;
    try {
      await fs.access(filePath);
    } catch {
      if (targetLocale !== 'en') {
        finalPath = path.join(process.cwd(), 'src', 'content', 'legal', 'en', filename);
      } else {
        return null;
      }
    }

    let content = await fs.readFile(finalPath, 'utf8');
    // Replace placeholder for current date
    content = content.replace(/{{CURRENT_DATE}}/g, formatDatePretty(new Date()));
    return content;
  } catch (error) {
    console.error(`Error reading legal document ${filename} for locale ${targetLocale}:`, error);
    return null;
  }
}

export default async function LegalDocumentPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const locale = await getServerLocale();
  const content = await getLegalDocumentContent(slug, locale);

  if (!content) {
    notFound();
  }

  return (
    <LegalLayout>
      <MarkdownContent>{content}</MarkdownContent>
    </LegalLayout>
  );
}

export async function generateStaticParams() {
  const legalSlugs = [
    'privacy-policy', 'terms-of-service', 'eula', 'cookie-policy',
    'acceptable-use-policy', 'disclaimer', 'clinician-service-agreement',
    'master-services-agreement', 'data-processing-agreement',
  ];
  return legalSlugs.map(slug => ({ slug }));
}

// Generate metadata for each legal page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = await getServerLocale();
  const content = await getLegalDocumentContent(params.slug, locale);
  
  let title = "Legal Document";
  if (content) {
    // Try to extract the first H1 tag (# Title)
    const match = content.match(/^#\s+(.+)$/m);
    if (match && match[1]) {
      // Remove any trailing "for Raising Atlantic" if desired, or keep as is.
      title = match[1].trim();
    }
  }

  return {
    title: `Legal / ${title}`,
  };
}
