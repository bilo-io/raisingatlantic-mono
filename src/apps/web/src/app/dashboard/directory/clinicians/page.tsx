
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Search, LayoutGrid, List, MoreHorizontal, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dummyClinicians, type Clinician } from '@/data/clinicians';
import { dummyPractices } from '@/data/practices';
import { ClinicianDetailModal } from '@/components/medical/ClinicianDetailModal';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const practiceNameMap = new Map(dummyPractices.map(p => [p.id, p.name]));
const ITEMS_PER_PAGE = 8;
const VIEW_MODE_STORAGE_KEY = 'viewMode_clinicians';

export default function CliniciansDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
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
    let clinicians = dummyClinicians;

    if (practiceFilter !== 'all') {
      clinicians = clinicians.filter(c => c.practiceIds.includes(practiceFilter));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      clinicians = clinicians.filter(c =>
        c.name.toLowerCase().includes(lowercasedTerm) ||
        c.specialty.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    return clinicians;
  }, [searchTerm, practiceFilter]);
  
  const totalPages = Math.ceil(filteredClinicians.length / ITEMS_PER_PAGE);
  
  const paginatedClinicians = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClinicians.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClinicians, currentPage]);
  
  const handlePageChange = (direction: 'next' | 'prev') => {
    if(direction === 'next' && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }
  
  const handleFilterChange = (value: string) => {
    setPracticeFilter(value);
    setCurrentPage(1);
  }

  const renderGrid = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedClinicians.map(clinician => (
        <Card key={clinician.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="items-center text-center pb-4">
            <RoleAvatar
              src={clinician.avatarUrl}
              name={clinician.name}
              role={clinician.role}
              aiHint={clinician.aiHint}
              avatarClassName="h-24 w-24 mb-4"
              fallbackClassName="text-3xl"
              iconContainerClassName="h-7 w-7 border-2"
              iconClassName="h-4 w-4"
            />
            <CardTitle className="font-headline text-lg">{(clinician.title || '') + ' ' + clinician.name}</CardTitle>
            <CardDescription className="text-primary">{clinician.specialty}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow text-sm text-muted-foreground text-center">
            <p className="mb-4 line-clamp-3">{clinician.bio}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {clinician.practiceIds.map(id => (
                <Badge key={id} variant="secondary">
                  {practiceNameMap.get(id) || 'Unknown Practice'}
                </Badge>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t mt-auto">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedClinician(clinician)}>
              View Profile
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead className="hidden lg:table-cell">Practices</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClinicians.map(clinician => (
            <TableRow key={clinician.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <RoleAvatar
                    src={clinician.avatarUrl}
                    name={clinician.name}
                    role={clinician.role}
                    aiHint={clinician.aiHint}
                    avatarClassName="h-10 w-10"
                    iconContainerClassName="h-5 w-5 border-2"
                    iconClassName="h-3 w-3"
                  />
                  <span className="font-medium">{(clinician.title || '') + ' ' + clinician.name}</span>
                </div>
              </TableCell>
              <TableCell>{clinician.specialty}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {clinician.practiceIds.map(id => (
                    <Badge key={id} variant="secondary">{practiceNameMap.get(id) || 'N/A'}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => setSelectedClinician(clinician)}>
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full flex-1">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or specialty..."
                className="pl-8 w-full sm:w-[250px] lg:w-[300px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={practiceFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by practice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Practices</SelectItem>
                {dummyPractices.map(practice => (
                  <SelectItem key={practice.id} value={practice.id}>
                    {practice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button size="icon">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Clinician</span>
            </Button>
          </div>
        </div>

        {paginatedClinicians.length > 0 ? (
          <>
            {viewMode === 'grid' ? renderGrid() : renderList()}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12 col-span-full">
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
