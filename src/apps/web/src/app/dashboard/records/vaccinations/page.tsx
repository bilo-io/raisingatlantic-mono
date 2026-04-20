
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ShieldPlus, PlusCircle, AlertTriangle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from '@/lib/constants';
import { 
  getChildren, 
} from "@/lib/api/adapters/child.adapter";
import { 
  getUsers, 
} from "@/lib/api/adapters/user.adapter";
import { 
  getVaccinationSchedule, 
  getAllCompletedVaccinations,
} from "@/lib/api/adapters/master-data.adapter";
import { formatDateStandard } from '@/utils/date';
import { VaccinationRecordFormModal } from '@/components/records/VaccinationRecordFormModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

type FormattedVaccinationRecord = {
    id: string;
    childId: string;
    childName: string;
    childImageUrl: string;
    date: string;
    vaccineName: string;
    doseInfo: string;
};

export default function VaccinationRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<any | undefined>();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childrenForUser, setChildrenForUser] = useState<any[]>([]);
  const [vaccinationsMaster, setVaccinationsMaster] = useState<any[]>([]);
  const [allRecordsFlat, setAllRecordsFlat] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [allChildren, allUsers, allVaccinations] = await Promise.all([
          getChildren(),
          getUsers(),
          getVaccinationSchedule()
        ]);
        
        setVaccinationsMaster(allVaccinations);
        
        const storedUserId = localStorage.getItem('currentUserId') || 'user-1';
        let user = allUsers.find((u: any) => u.id === storedUserId);
        
        // Fallback for Super Admin if not found in API list
        if (!user && storedUserId) {
          const { dummyUsers } = await import('@/data/users');
          user = dummyUsers.find(u => u.id === storedUserId);
        }

        if (user) {
          setCurrentUser(user);
          
          if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
            const records = await getAllCompletedVaccinations();
            setAllRecordsFlat(records);
            setChildrenForUser(allChildren);
          } else {
            let relevantChildren: any[];
            if (user.role === UserRole.PARENT) {
              relevantChildren = allChildren.filter(c => c.parentId === user.id);
            } else {
              relevantChildren = allChildren.filter(c => c.clinicianId === user.id);
            }
            setChildrenForUser(relevantChildren);
            
            // Map records from children for non-admins
            const localRecords: any[] = [];
            relevantChildren.forEach(child => {
              (child.completedVaccinations || []).forEach((v: any) => {
                localRecords.push({ ...v, child });
              });
            });
            setAllRecordsFlat(localRecords);
          }
        } else {
          setCurrentUser({ id: storedUserId, name: 'Super Admin', role: UserRole.SUPER_ADMIN });
          const [records] = await Promise.all([
            getAllCompletedVaccinations(),
          ]);
          setAllRecordsFlat(records);
          setChildrenForUser(allChildren);
        }
      } catch (error) {
        console.error("Failed to load vaccination records:", error);
        setLoadError(error instanceof Error ? error.message : 'An unknown network or server error occurred.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const allVaccinationRecords = useMemo(() => {
    if (!currentUser) return [];

    const allVaccinationsMap = new Map<string, any>();
    vaccinationsMaster.forEach(vaccine => {
        allVaccinationsMap.set(vaccine.id, vaccine);
    });

    const formattedRecords: FormattedVaccinationRecord[] = allRecordsFlat.map(record => {
      const vaccineDetails = allVaccinationsMap.get(record.vaccineId);
      if (!vaccineDetails || !record.child) return null;
      
      return {
        id: record.id,
        childId: record.child.id,
        childName: record.child.name || `${record.child.firstName} ${record.child.lastName}`,
        childImageUrl: record.child.imageUrl || '',
        date: record.dateAdministered,
        vaccineName: vaccineDetails.name,
        doseInfo: vaccineDetails.doseInfo,
      };
    }).filter(Boolean) as FormattedVaccinationRecord[];

    return formattedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allRecordsFlat, vaccinationsMaster, currentUser]);


  const filteredRecords = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return allVaccinationRecords.filter(record =>
      record.childName?.toLowerCase().includes(lowercasedTerm) ||
      record.vaccineName.toLowerCase().includes(lowercasedTerm)
    );
  }, [allVaccinationRecords, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleFormSubmit = (data: any) => {
    console.log("New vaccination record submitted:", data);
    // Here you would typically handle the API call to save the data
  };
  
  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex justify-between items-center">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-10 w-10" />
        </div>
        <Card>
           {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full border-b" />)}
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-lg border-destructive/20 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold font-headline">Something went wrong</CardTitle>
            <CardDescription className="text-base mt-2">
              We encountered an issue loading vaccination records. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground text-left overflow-auto max-h-32 font-mono">
              {loadError}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button variant="default" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex justify-between items-center">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-10 w-10" />
        </div>
        <Card>
           {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full border-b" />)}
        </Card>
      </div>
    );
  }

  return (
    <>
      <VaccinationRecordFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        childrenList={childrenForUser}
        onFormSubmit={handleFormSubmit}
      />
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldPlus className="mr-3 h-7 w-7 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>View all vaccination records.</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Vaccinations</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or vaccine..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Vaccination Record</span>
              </Button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Vaccinations Found</CardTitle>
                <CardDescription>
                  {searchTerm ? "No vaccinations match your search criteria." : "There are no vaccination records available."}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Child Name</TableHead>
                      <TableHead className="hidden md:table-cell">Date Administered</TableHead>
                      <TableHead>Vaccine</TableHead>
                      <TableHead className="hidden lg:table-cell">Dose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={record.childImageUrl} alt={record.childName} />
                              <AvatarFallback name={record.childName}>{record.childName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <Link href={`/dashboard/children/${record.childId}`} className="font-medium hover:underline">{record.childName}</Link>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatDateStandard(record.date)}</TableCell>
                        <TableCell>
                            <span className="truncate max-w-xs">{record.vaccineName}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{record.doseInfo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              {totalPages > 1 && (
                <CardFooter className="flex items-center justify-between border-t pt-6">
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
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </TooltipProvider>
    </>
  );
}
