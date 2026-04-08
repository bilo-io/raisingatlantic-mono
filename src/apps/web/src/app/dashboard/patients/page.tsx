
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Users, Eye, Edit3, ChevronLeft, ChevronRight, List, LayoutGrid, PlusCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { 
  getChildren, 
  Child as ChildType 
} from "@/lib/api/adapters/child.adapter";
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatDateStandard } from '@/utils/date';
import { getAgeFromDate } from '@/lib/utils/date';
import { ResourceStatus } from '@/types/enums';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

type PatientDisplayInfo = {
  id: string;
  name: string;
  dateOfBirth: string | Date;
  imageUrl?: string;
  updatedAt: string | Date;
  status: ResourceStatus;
  primaryConcern?: string;
};

const ITEMS_PER_PAGE = 8;
const VIEW_MODE_STORAGE_KEY = 'viewMode_patients';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentUser, setCurrentUser] = useState<any | undefined>();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMyPatientsOnly, setShowMyPatientsOnly] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);

        const fetchFilters: any = {};
        if (user) {
           if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
              // Admin fetches all for tenant - assume top level for now or pass tenantId if mock user has it
              if (user.tenantId) fetchFilters.tenantId = user.tenantId;
           } else if (user.role === UserRole.CLINICIAN) {
              fetchFilters.clinicianId = user.id;
           }
        }

        const allChildren = await getChildren(fetchFilters);
        setChildren(allChildren);
        
        const storedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list' | null;
        if (storedViewMode) {
          setViewMode(storedViewMode);
        }
      } catch (error) {
        console.error("Failed to load patients list:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode, mounted]);

  const allPatients = useMemo((): PatientDisplayInfo[] => {
    return children.map(child => ({
      id: child.id,
      name: child.name,
      dateOfBirth: child.dateOfBirth,
      imageUrl: child.imageUrl,
      updatedAt: child.updatedAt,
      status: child.status,
      // This could be dynamically determined in a real app
      primaryConcern: (child.notes || '').split('.')[0] || 'Routine Checkup',
    }));
  }, [children]);
  
  const filteredPatients = useMemo(() => {
    let patients = allPatients;

    if (currentUser?.role === UserRole.CLINICIAN && showMyPatientsOnly) {
        const myPatientIds = children.filter(c => 
          c.clinicianId === currentUser.id || 
          (c.clinician?.email === currentUser.email)
        ).map(c => c.id);
        patients = patients.filter(p => myPatientIds.includes(p.id));
    }
    
    if (searchTerm) {
        patients = patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient.primaryConcern && patient.primaryConcern.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    return patients;
  }, [searchTerm, allPatients, currentUser, showMyPatientsOnly]);

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPatients, currentPage]);

  const getStatusBadgeVariant = (status: ResourceStatus) => {
    switch (status) {
      case ResourceStatus.ACTIVE: return 'default';
      case ResourceStatus.INACTIVE: return 'secondary';
      case ResourceStatus.ARCHIVED: return 'outline';
      default: return 'default';
    }
  };

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFormSubmit = (data: any) => {
    console.log("New patient data submitted:", data);
    // In a real app, you would add the new child to your data source
    // For now, we just close the modal.
    setIsModalOpen(false);
  };

  if (!mounted || loading || !currentUser) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex justify-between items-center">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-10 w-32" />
        </div>
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <Card>
             {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-full border-b" />)}
          </Card>
        )}
      </div>
    );
  }

  const renderGrid = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedPatients.map((patient) => (
        <Card key={patient.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patient.imageUrl} alt={patient.name} />
                <AvatarFallback name={patient.name}>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline text-lg">
                  <Link href={`/dashboard/children/${patient.id}`} className="hover:underline">{patient.name}</Link>
                </CardTitle>
                <CardDescription>{getAgeFromDate(patient.dateOfBirth)}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">
              <span className="font-medium text-foreground">Concern:</span> {patient.primaryConcern || 'N/A'}
            </p>
             <Badge variant={getStatusBadgeVariant(patient.status)} className="mt-2">{patient.status}</Badge>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t pt-4">
             <span className="text-xs text-muted-foreground">Updated: {formatDateStandard(patient.updatedAt.toString())}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href={`/dashboard/children/${patient.id}`}><Eye className="mr-2 h-4 w-4" />View Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/children/${patient.id}/edit`}><Edit3 className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="hidden lg:table-cell">Primary Concern</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Update</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.imageUrl} alt={patient.name} />
                      <AvatarFallback name={patient.name}>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <Link href={`/dashboard/children/${patient.id}`} className="font-medium hover:underline">{patient.name}</Link>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{getAgeFromDate(patient.dateOfBirth)}</TableCell>
                <TableCell className="hidden lg:table-cell">{patient.primaryConcern || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDateStandard(patient.updatedAt.toString())}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Patient Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/children/${patient.id}`}><Eye className="mr-2 h-4 w-4" />View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/children/${patient.id}/edit`}><Edit3 className="mr-2 h-4 w-4" />Edit Profile</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PatientFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleFormSubmit}
        currentUser={currentUser}
      />
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Users className="mr-3 h-7 w-7 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>View and manage your assigned patients.</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Patients</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
               {currentUser?.role === UserRole.CLINICIAN && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="my-patients" 
                    checked={showMyPatientsOnly}
                    onCheckedChange={(checked) => setShowMyPatientsOnly(Boolean(checked))}
                  />
                  <Label htmlFor="my-patients" className="cursor-pointer whitespace-nowrap">My Patients</Label>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="Switch to list view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Switch to grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add New Patient</span>
              </Button>
            </div>
          </div>

          {filteredPatients.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Patients Found</CardTitle>
                <CardDescription>
                  {searchTerm ? "No patients match your search criteria." : "There are no patients assigned to you yet."}
                </CardDescription>
              </CardHeader>
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
        </div>
      </TooltipProvider>
    </>
  );
}
