
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MapPin, Building } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getPractices, type Practice } from '@/lib/api/adapters/practice.adapter';
import { PracticeDetailModal } from '@/components/medical/PracticeDetailModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DirectoryExplorerToolbar } from '@/components/directory/DirectoryExplorerToolbar';
import { DirectoryPagination } from '@/components/directory/DirectoryPagination';
import { PracticeGrid } from '@/components/directory/PracticeGrid';
import { PracticeList } from '@/components/directory/PracticeList';
import { PracticeSkeleton } from '@/components/directory/DirectorySkeletons';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;
const VIEW_MODE_STORAGE_KEY = 'viewMode_practices';

export default function PracticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPractice, setSelectedPractice] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        setLoading(true);
        const data = await getPractices();
        setPractices(data);
      } catch (error) {
        console.error("Failed to fetch practices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
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

  const filteredPractices = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return practices.filter(practice =>
      practice.name.toLowerCase().includes(lowerTerm) ||
      practice.address.toLowerCase().includes(lowerTerm) ||
      practice.city.toLowerCase().includes(lowerTerm) ||
      (practice.manager && practice.manager.toLowerCase().includes(lowerTerm))
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
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <MapPin className="mr-3 h-7 w-7 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Browse the directory of medical practices.</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="font-headline text-2xl font-bold tracking-tight">Practices</h1>
        </div>

        <DirectoryExplorerToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          actions={
            <Button size="icon"> 
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Practice</span>
            </Button>
          }
        />

        {loading ? (
          <PracticeSkeleton />
        ) : filteredPractices.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Practices Found</CardTitle>
              <CardDescription>
                {searchTerm ? "No practices match your search criteria." : "There are no practices listed yet."}
              </CardDescription>
            </CardHeader>
             <CardContent>
              <Button asChild>
                <Link href="#">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First Practice
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
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
        )}
        
        <PracticeDetailModal 
          practice={selectedPractice}
          onClose={() => setSelectedPractice(null)}
        />
      </div>
    </TooltipProvider>
  );
}
