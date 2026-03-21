
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, Award, FileEdit, PlusCircle } from 'lucide-react';
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
import { DUMMY_DEFAULT_USER_ID, dummyUsers, type User } from '@/data/users';
import { childrenDetails, type ChildDetail } from '@/data/children';
import { standardMilestonesByAge, type Milestone } from '@/data/milestones';
import { formatDateStandard } from '@/utils/date';
import { MilestoneRecordFormModal } from '@/components/records/MilestoneRecordFormModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

type FormattedMilestoneRecord = {
    id: string;
    childId: string;
    childName: string;
    childAvatar: string;
    childAiHint: string;
    date: string;
    category: string;
    description: string;
};

// Create a map for quick lookup of milestone details by ID
const allMilestonesMap = new Map<string, Milestone>();
standardMilestonesByAge.forEach(ageGroup => {
  ageGroup.milestones.forEach(milestone => {
    allMilestonesMap.set(milestone.id, milestone);
  });
});

export default function MilestoneRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childrenForUser, setChildrenForUser] = useState<ChildDetail[]>([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('currentUserId') || DUMMY_DEFAULT_USER_ID;
      const user = dummyUsers.find(u => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
        
        let relevantChildren: ChildDetail[];
        if (user.role === UserRole.PARENT) {
          relevantChildren = childrenDetails.filter(c => c.parentId === user.id);
        } else if (user.role === UserRole.CLINICIAN) {
          relevantChildren = childrenDetails.filter(c => c.clinicianId === user.id);
        } else { // Admin sees all
          relevantChildren = childrenDetails;
        }
        setChildrenForUser(relevantChildren);
      }
    }
  }, []);

  const allMilestoneRecords = useMemo(() => {
    if (!currentUser) return [];

    const formattedRecords: FormattedMilestoneRecord[] = [];
    childrenForUser.forEach(child => {
      child.completedMilestones.forEach(completed => {
        const milestoneDetails = allMilestonesMap.get(completed.milestoneId);
        if (milestoneDetails) {
            formattedRecords.push({
                id: `${child.id}-milestone-${completed.milestoneId}`,
                childId: child.id,
                childName: child.name,
                childAvatar: child.avatar,
                childAiHint: child.aiHint,
                date: completed.dateAchieved,
                category: milestoneDetails.category,
                description: milestoneDetails.description,
            });
        }
      });
    });

    return formattedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [currentUser, childrenForUser]);


  const filteredRecords = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return allMilestoneRecords.filter(record =>
      record.childName.toLowerCase().includes(lowercasedTerm) ||
      record.description.toLowerCase().includes(lowercasedTerm) ||
      record.category.toLowerCase().includes(lowercasedTerm)
    );
  }, [allMilestoneRecords, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  
  const handleFormSubmit = (data: any) => {
    console.log("New milestone record submitted:", data);
    // Here you would typically handle the API call to save the data
  };

  if (!mounted || !currentUser) return null;

  return (
    <>
      <MilestoneRecordFormModal 
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
                <Award className="mr-3 h-7 w-7 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>View all milestone records.</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Milestones</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or milestone..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Milestone Record</span>
              </Button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Milestones Found</CardTitle>
                <CardDescription>
                  {searchTerm ? "No milestones match your search criteria." : "There are no milestone records available."}
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
                      <TableHead className="hidden md:table-cell">Date Achieved</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead className="hidden lg:table-cell">Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={record.childAvatar} alt={record.childName} data-ai-hint={record.childAiHint} />
                              <AvatarFallback name={record.childName}>{record.childName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <Link href={`/dashboard/children/${record.childId}`} className="font-medium hover:underline">{record.childName}</Link>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatDateStandard(record.date)}</TableCell>
                        <TableCell>
                            <span className="truncate max-w-xs">{record.description}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{record.category}</TableCell>
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
