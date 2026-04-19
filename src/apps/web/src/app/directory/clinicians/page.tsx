
"use client";

import { useState, useMemo, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DirectoryExplorerToolbar } from '@/components/directory/DirectoryExplorerToolbar';
import { DirectoryPagination } from '@/components/directory/DirectoryPagination';
import { ClinicianGrid } from '@/components/directory/ClinicianGrid';
import { ClinicianList } from '@/components/directory/ClinicianList';
import { ClinicianSkeleton } from '@/components/directory/DirectorySkeletons';
import { ClinicianDetailModal } from '@/components/medical/ClinicianDetailModal';
import { getPublicClinicians } from '@/lib/api/adapters/user.adapter';
import { getPublicPractices } from '@/lib/api/adapters/practice.adapter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function PublicCliniciansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClinician, setSelectedClinician] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const practiceNameMap = useMemo(() => new Map(practices.map(p => [p.id, p.name])), [practices]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [cliniciansData, practicesData] = await Promise.all([
          getPublicClinicians(),
          getPublicPractices()
        ]);
        setClinicians(cliniciansData);
        setPractices(practicesData);
      } catch (error) {
        console.error("Failed to fetch public directory data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredClinicians = useMemo(() => {
    let filtered = clinicians;

    if (practiceFilter !== 'all') {
      filtered = filtered.filter(c => c.practiceIds?.includes(practiceFilter) || c.clinicianProfile?.practices?.some((p: any) => p.id === practiceFilter));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lowercasedTerm) ||
        c.specialty?.toLowerCase().includes(lowercasedTerm) ||
        c.clinicianProfile?.specialty?.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    return filtered;
  }, [searchTerm, practiceFilter, clinicians]);

  const totalPages = Math.ceil(filteredClinicians.length / ITEMS_PER_PAGE);
  const paginatedClinicians = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClinicians.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClinicians, currentPage]);

  const clinicianListForDisplay = useMemo(() => {
    return paginatedClinicians.map(c => ({
      ...c,
      specialty: c.specialty || c.clinicianProfile?.specialty,
      bio: c.bio || c.clinicianProfile?.bio,
      practiceIds: c.practiceIds || c.clinicianProfile?.practices?.map((p: any) => p.id) || []
    }));
  }, [paginatedClinicians]);

  return (
    <PublicLayout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-grow">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Our Clinicians</h1>
            <p className="text-muted-foreground italic text-sm">Connect with world-class specialists in our network.</p>
          </div>
        </div>

        {/* Toolbar */}
        <DirectoryExplorerToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          searchPlaceholder="Search by name or specialty..."
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
        />

        {/* Content */}
        {loading ? (
          <ClinicianSkeleton />
        ) : clinicianListForDisplay.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <ClinicianGrid 
                clinicians={clinicianListForDisplay} 
                onSelect={setSelectedClinician} 
                practiceNameMap={practiceNameMap} 
              />
            ) : (
              <ClinicianList 
                clinicians={clinicianListForDisplay} 
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
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <p className="text-xl text-muted-foreground">No clinicians found matching your criteria.</p>
          </div>
        )}

        <ClinicianDetailModal 
          clinician={selectedClinician}
          onClose={() => setSelectedClinician(null)}
          isPublic={true}
        />
      </div>
    </PublicLayout>
  );
}
