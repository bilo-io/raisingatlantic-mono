
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPractices, type Practice } from '@/lib/api/adapters/practice.adapter';
import { getUsers } from '@/lib/api/adapters/user.adapter';
import { UserRole } from '@/lib/constants';
import { ClinicianDetailModal } from '@/components/medical/ClinicianDetailModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DirectoryExplorerToolbar } from '@/components/directory/DirectoryExplorerToolbar';
import { DirectoryPagination } from '@/components/directory/DirectoryPagination';
import { ClinicianGrid } from '@/components/directory/ClinicianGrid';
import { ClinicianList } from '@/components/directory/ClinicianList';
import { ClinicianSkeleton } from '@/components/directory/DirectorySkeletons';

const ITEMS_PER_PAGE = 8;
const VIEW_MODE_STORAGE_KEY = 'viewMode_clinicians';

export default function CliniciansDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClinician, setSelectedClinician] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

  const practiceNameMap = useMemo(() => new Map(practices.map(p => [p.id, p.name])), [practices]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, practicesData] = await Promise.all([
          getUsers(),
          getPractices()
        ]);
        
        const cliniciansList = usersData.filter((u: any) => u.role === UserRole.CLINICIAN);
        setClinicians(cliniciansList);
        setPractices(practicesData);
      } catch (error) {
        console.error("Failed to fetch clinicians directory data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    setMounted(true);
    const storedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list' | null;
    if (storedViewMode) {
      setViewMode(storedViewMode);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode, mounted]);

  const filteredClinicians = useMemo(() => {
    let filtered = clinicians;

    if (practiceFilter !== 'all') {
      filtered = filtered.filter(c => c.practiceIds?.includes(practiceFilter));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lowercasedTerm) ||
        c.specialty?.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    return filtered;
  }, [searchTerm, practiceFilter, clinicians]);
  
  const totalPages = Math.ceil(filteredClinicians.length / ITEMS_PER_PAGE);
  const paginatedClinicians = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClinicians.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClinicians, currentPage]);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Stethoscope className="mr-3 h-7 w-7 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Browse the directory of clinicians.</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="font-headline text-2xl font-bold tracking-tight">Clinicians</h1>
        </div>

        <DirectoryExplorerToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={
            <Select value={practiceFilter} onValueChange={(val) => { setPracticeFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by practice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Practices</SelectItem>
                {practices.map(practice => (
                  <SelectItem key={practice.id} value={practice.id}>
                    {practice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          actions={
            <Button size="icon">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Clinician</span>
            </Button>
          }
        />

        {loading ? (
          <ClinicianSkeleton />
        ) : filteredClinicians.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <ClinicianGrid 
                clinicians={paginatedClinicians} 
                onSelect={setSelectedClinician} 
                practiceNameMap={practiceNameMap} 
              />
            ) : (
              <ClinicianList 
                clinicians={paginatedClinicians} 
                onSelect={setSelectedClinician} 
                practiceNameMap={practiceNameMap} 
              />
            )}
            
            <DirectoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(dir) => setCurrentPage(prev => dir === 'next' ? prev + 1 : prev - 1)}
            />
          </>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Clinicians Found</CardTitle>
              <CardDescription>
                {searchTerm || practiceFilter !== 'all'
                  ? "No clinicians match your search or filter criteria."
                  : "There are no clinicians in the directory yet."}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <ClinicianDetailModal 
          clinician={selectedClinician}
          onClose={() => setSelectedClinician(null)}
        />
      </div>
    </TooltipProvider>
  );
}
