
"use client";

import { useState, useMemo, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DirectoryExplorerToolbar } from '@/components/directory/DirectoryExplorerToolbar';
import { DirectoryPagination } from '@/components/directory/DirectoryPagination';
import { PracticeGrid } from '@/components/directory/PracticeGrid';
import { PracticeList } from '@/components/directory/PracticeList';
import { PracticeSkeleton } from '@/components/directory/DirectorySkeletons';
import { PracticeDetailModal } from '@/components/medical/PracticeDetailModal';
import { getPublicPractices, type Practice } from '@/lib/api/adapters/practice.adapter';
import { MapPin } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function PublicPracticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPractices() {
      try {
        setLoading(true);
        const data = await getPublicPractices();
        setPractices(data);
      } catch (error) {
        console.error("Failed to fetch public practices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPractices();
  }, []);

  const filteredPractices = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return practices.filter(p =>
      p.name.toLowerCase().includes(lowerTerm) ||
      p.city.toLowerCase().includes(lowerTerm) ||
      p.address.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, practices]);

  const totalPages = Math.ceil(filteredPractices.length / ITEMS_PER_PAGE);
  const paginatedPractices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPractices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPractices, currentPage]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Temporarily Closed': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-grow">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Our Practices</h1>
            <p className="text-muted-foreground italic text-sm">Explore our network of medical facilities.</p>
          </div>
        </div>

        {/* Toolbar */}
        <DirectoryExplorerToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          searchPlaceholder="Search by name, city or address..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content */}
        {loading ? (
          <PracticeSkeleton />
        ) : paginatedPractices.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <PracticeGrid 
                practices={paginatedPractices} 
                onSelect={setSelectedPractice} 
                getStatusBadgeVariant={getStatusBadgeVariant} 
              />
            ) : (
              <PracticeList 
                practices={paginatedPractices} 
                onSelect={setSelectedPractice} 
                getStatusBadgeVariant={getStatusBadgeVariant} 
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
            <p className="text-xl text-muted-foreground">No practices found matching your search.</p>
          </div>
        )}

        <PracticeDetailModal 
          practice={selectedPractice}
          onClose={() => setSelectedPractice(null)}
          isPublic={true}
        />
      </div>
    </PublicLayout>
  );
}
