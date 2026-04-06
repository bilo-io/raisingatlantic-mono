"use client";

import { useState, useEffect } from 'react';
import { 
  getRecordsForVerification 
} from '@/lib/api/adapters/verification.adapter';
import { formatDateStandard } from '@/utils/date';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, CheckCircle2, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RecordVerificationsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getRecordsForVerification();
        setRecords(data);
      } catch (error) {
        console.error("Failed to load records for verification:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredRecords = records.filter(r => 
    r.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
          <div className="space-y-2">
              <Tooltip>
                  <TooltipTrigger asChild>
                      <div className="flex items-center">
                          <FileCheck className="mr-3 h-7 w-7 text-primary" />
                          <h1 className="font-headline text-2xl font-bold tracking-tight">Record Verifications</h1>
                      </div>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>Verify flagged child records.</p>
                  </TooltipContent>
              </Tooltip>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search records by child or issue..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
               {/* Placeholder for potential actions */}
          </div>
        <Card>
          <CardHeader>
            <CardTitle>Flagged Record Verifications</CardTitle>
            <CardDescription>Review child records that have been flagged for inconsistencies or require verification.</CardDescription>
          </CardHeader>
          <CardContent>
             {filteredRecords.length > 0 ? (
              <ul className="space-y-4">
                {filteredRecords.map((record) => (
                  <li key={record.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{record.childName} - <span className="text-foreground font-normal">{record.recordType} Record</span></p>
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1.5" /> Issue: {record.issue}
                      </p>
                      <p className="text-xs text-muted-foreground">Flagged by: {record.flaggedBy} on {formatDateStandard(record.dateFlagged)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <Badge variant={record.status === 'Needs Review' ? 'destructive' : 'secondary'} className="whitespace-nowrap">
                        {record.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">View Record Details</Button>
                      <Button size="sm" className="w-full sm:w-auto">
                         <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark as Verified
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {searchTerm ? "No records match your search." : "No records currently flagged for verification."}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Add more sections like "Recently Verified Records" if needed */}
      </div>
    </TooltipProvider>
  );
}
