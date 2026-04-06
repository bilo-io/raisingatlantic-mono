"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, MapPin, ChevronLeft, ChevronRight, Eye, Edit3, PlusCircle, LayoutGrid, List, Building } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { getPractices, type Practice } from '@/lib/api/adapters/practice.adapter';
import { PracticeDetailModal } from '@/components/medical/PracticeDetailModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

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
    return practices.filter(practice =>
      practice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (practice.manager && practice.manager.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const renderGrid = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedPractices.map(practice => (
        <Card key={practice.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
             <div className="flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-md">
                    <Building className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                    <CardTitle className="font-headline text-lg">{practice.name}</CardTitle>
                    <CardDescription>{practice.city}</CardDescription>
                 </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow text-sm">
            <p className="text-muted-foreground line-clamp-2">{practice.address}</p>
            <Badge variant={getStatusBadgeVariant(practice.status)} className="mt-3">{practice.status}</Badge>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedPractice(practice)}>
              View Details
            </Button>
          </CardFooter>
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
            <TableHead className="hidden md:table-cell">City</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPractices.map((practice) => (
            <TableRow key={practice.id}>
              <TableCell>
                <button onClick={() => setSelectedPractice(practice)} className="font-medium hover:underline text-left">
                  {practice.name}
                </button>
              </TableCell>
              <TableCell className="hidden md:table-cell">{practice.city}</TableCell>
              <TableCell className="hidden lg:table-cell">{practice.phone}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(practice.status)}>{practice.status}</Badge>
              </TableCell>
              <TableCell>
                 <Button variant="ghost" size="sm" onClick={() => setSelectedPractice(practice)}>
                  View Details
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
              <MapPin className="mr-3 h-7 w-7 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Browse the directory of medical practices.</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="font-headline text-2xl font-bold tracking-tight">Practices</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search practices..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
              <span className="sr-only">Add Practice</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-16 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
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
              {viewMode === 'grid' ? renderGrid() : renderList()}
              {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                  </div>
                  </div>
              )}
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
