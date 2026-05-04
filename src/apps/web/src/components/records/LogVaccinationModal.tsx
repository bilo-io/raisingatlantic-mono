"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Vaccination } from '@/data/vaccinations';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

export type LogVaccinationFormData = {
  source: 'CLINICIAN' | 'PARENT';
  dateAdministered: string;
  batchNumber?: string;
  expiryDate?: string;
  manufacturer?: string;
  administeredByName?: string;
};

type Props = {
  vaccine: Vaccination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (vaccineId: string, data: LogVaccinationFormData) => void | Promise<void>;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
      {children}
    </div>
  );
}

const FNC1 = String.fromCharCode(0x1D);

type ParsedBarcode = { gtin?: string; batch?: string; expiry?: string };

function parseGs1(raw: string): ParsedBarcode {
  let rest = raw.replace(/^\]C1/, '').replace(/^\]d2/, '');
  const out: ParsedBarcode = {};
  let safety = 0;
  while (rest.length >= 2 && safety++ < 12) {
    const ai = rest.slice(0, 2);
    if (ai === '01' && rest.length >= 16) {
      out.gtin = rest.slice(2, 16);
      rest = rest.slice(16);
    } else if (ai === '17' && rest.length >= 8) {
      const yy = parseInt(rest.slice(2, 4), 10);
      const mm = rest.slice(4, 6);
      if (!Number.isNaN(yy) && /^\d{2}$/.test(mm)) {
        out.expiry = `${mm}/${2000 + yy}`;
      }
      rest = rest.slice(8);
    } else if (ai === '10' || ai === '21') {
      rest = rest.slice(2);
      const idx = rest.indexOf(FNC1);
      const value = idx === -1 ? rest : rest.slice(0, idx);
      if (ai === '10') out.batch = value;
      rest = idx === -1 ? '' : rest.slice(idx + 1);
    } else {
      break;
    }
  }
  return out;
}

export function LogVaccinationModal({ vaccine, open, onOpenChange, onSubmit }: Props) {
  const [source, setSource] = React.useState<'CLINICIAN' | 'PARENT'>('CLINICIAN');
  const [dateAdministered, setDateAdministered] = React.useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [batchNumber, setBatchNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [manufacturer, setManufacturer] = React.useState('');
  const [administeredByName, setAdministeredByName] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [scanError, setScanError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setSource('CLINICIAN');
      setDateAdministered(format(new Date(), 'yyyy-MM-dd'));
      setBatchNumber('');
      setExpiryDate('');
      setManufacturer('');
      setAdministeredByName('');
      setSubmitting(false);
      setScanning(false);
      setScanError(null);
    }
  }, [open]);

  const handleScan = (codes: IDetectedBarcode[]) => {
    if (!codes.length) return;
    const raw = codes[0].rawValue || '';
    const parsed = parseGs1(raw);
    if (parsed.batch) setBatchNumber(parsed.batch);
    if (parsed.expiry) setExpiryDate(parsed.expiry);
    if (!parsed.batch && !parsed.expiry) {
      setBatchNumber(raw);
    }
    setScanning(false);
  };

  const handleSave = async () => {
    if (!vaccine) return;
    setSubmitting(true);
    try {
      await onSubmit?.(vaccine.id, {
        source,
        dateAdministered,
        batchNumber: batchNumber.trim() || undefined,
        expiryDate: expiryDate.trim() || undefined,
        manufacturer: manufacturer.trim() || undefined,
        administeredByName: administeredByName.trim() || undefined,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl">
            {vaccine ? `${vaccine.name} (${vaccine.doseInfo})` : ''}
          </DialogTitle>
          <DialogDescription>Log administration record</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSource('CLINICIAN')}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                source === 'CLINICIAN'
                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                  : 'bg-transparent text-muted-foreground border-muted hover:bg-muted/40'
              )}
            >
              Doctor / nurse
            </button>
            <button
              type="button"
              onClick={() => setSource('PARENT')}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                source === 'PARENT'
                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                  : 'bg-transparent text-muted-foreground border-muted hover:bg-muted/40'
              )}
            >
              Parent report
            </button>
          </div>

          <div>
            <FieldLabel>Date given</FieldLabel>
            <Input
              type="date"
              value={dateAdministered}
              onChange={e => setDateAdministered(e.target.value)}
            />
          </div>

          {source === 'CLINICIAN' && !scanning && (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => { setScanError(null); setScanning(true); }}
            >
              <Barcode className="h-4 w-4" />
              Scan vial barcode
            </Button>
          )}

          {scanning && (
            <div className="space-y-2">
              <div className="relative overflow-hidden rounded-xl border bg-black aspect-[4/3]">
                <Scanner
                  onScan={handleScan}
                  onError={(err) => {
                    const msg = err instanceof Error ? err.message : 'Camera unavailable';
                    setScanError(msg);
                  }}
                  constraints={{ facingMode: 'environment' }}
                  formats={['code_128', 'code_39', 'data_matrix', 'qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e']}
                  scanDelay={250}
                  styles={{ container: { width: '100%', height: '100%' }, video: { width: '100%', height: '100%', objectFit: 'cover' } }}
                />
                <button
                  type="button"
                  onClick={() => setScanning(false)}
                  className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Close scanner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {scanError ? (
                <p className="text-xs text-red-400">{scanError}</p>
              ) : (
                <p className="text-xs text-muted-foreground text-center">Point the camera at the vial label.</p>
              )}
            </div>
          )}

          <div>
            <FieldLabel>Batch number</FieldLabel>
            <Input
              placeholder="e.g. HEX-2204"
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Expiry</FieldLabel>
              <Input
                placeholder="MM/YYYY"
                inputMode="numeric"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Manufacturer</FieldLabel>
              <Input
                placeholder="e.g. Sanofi"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
              />
            </div>
          </div>

          {source === 'CLINICIAN' && (
            <div>
              <FieldLabel>Administered by</FieldLabel>
              <Input
                placeholder="Dr Smith · ACP"
                value={administeredByName}
                onChange={e => setAdministeredByName(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
