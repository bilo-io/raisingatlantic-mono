import { jsPDF } from 'jspdf';
import { PDF_TEMPLATE_WIDTH } from '@/components/records/VaccinationRecordPdfTemplate';

const A4_PT_WIDTH = 595.28;

export async function exportVaccinationRecordPdf({
  templateRoot,
  fileName,
}: {
  templateRoot: HTMLElement;
  fileName: string;
}): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const scale = A4_PT_WIDTH / PDF_TEMPLATE_WIDTH;

  await doc.html(templateRoot, {
    x: 0,
    y: 0,
    html2canvas: { scale, useCORS: true, backgroundColor: '#ffffff' },
    autoPaging: 'text',
    margin: 0,
  });

  doc.save(fileName);
}
