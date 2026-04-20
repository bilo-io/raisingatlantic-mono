"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Mail, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getSystemLogs, SystemLog } from '@/lib/api/adapters/system-log.adapter';
import { formatDateStandard } from '@/utils/date';
import { Skeleton } from '@/components/ui/skeleton';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getSystemLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const getLogIcon = (metadata: any) => {
    if (metadata?.icon === 'envelope') return <Mail className="h-4 w-4 text-primary" />;
    return <Info className="h-4 w-4 text-muted-foreground" />;
  };

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case 'LEAD_CONTACT':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Lead</Badge>;
      case 'SECURITY_WASH':
        return <Badge variant="destructive">Security</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <ClipboardList className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">System Logs</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            Real-time logs of system events, lead captures, and administrative actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{getLogIcon(log.metadata)}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatDateStandard(log.createdAt)}
                    </TableCell>
                    <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                    <TableCell className="max-w-md truncate" title={log.message}>
                      {log.message}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.ipAddress || 'Internal'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No system logs found. Submit a lead to see it appear here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
