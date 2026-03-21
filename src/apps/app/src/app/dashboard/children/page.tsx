
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, PlusCircle, Search, Trash2, Edit3, Eye, List, LayoutGrid, Baby } from 'lucide-react';
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
import { childrenDetails } from '@/data/children';
import { UserRole } from '@/lib/constants';
import { DUMMY_DEFAULT_USER_ID, dummyUsers } from '@/data/users';
import { formatDateStandard } from '@/utils/date';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type Child = {
  id: string;
  name: string;
  age: string;
  avatar: string;
  lastUpdate: string;
  status: 'Active' | 'Inactive' | 'Archived';
  clinician?: string;
  aiHint: string;
};

const VIEW_MODE_STORAGE_KEY = 'viewMode_children';

export default function ChildrenListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const storedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list' | null;
        if (storedViewMode) {
          setViewMode(storedViewMode);
        }
        
        const userId = localStorage.getItem('currentUserId') || DUMMY_DEFAULT_USER_ID;
        setCurrentUserId(userId);
        const user = dummyUsers.find(u => u.id === userId);
        if(user) {
            setCurrentUserRole(user.role);
        }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode, mounted]);


  const displayedChildren = useMemo(() => {
    let childrenForUser = childrenDetails;
    if(currentUserRole === UserRole.PARENT && currentUserId) {
        childrenForUser = childrenDetails.filter(child => child.parentId === currentUserId);
    }
    
    const mappedChildren: Child[] = childrenForUser.map(child => {
      const clinician = child.clinicianId ? dummyUsers.find(u => u.id === child.clinicianId) : undefined;
      const clinicianName = clinician ? `${clinician.title || ''} ${clinician.name}`.trim() : undefined;

      return {
        id: child.id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        lastUpdate: new Date(child.lastUpdate).toISOString().split('T')[0],
        status: child.status,
        clinician: clinicianName,
        aiHint: child.aiHint,
      };
    });
    
    return mappedChildren;
  }, [currentUserId, currentUserRole]);


  const filteredChildren = useMemo(() => {
    return displayedChildren.filter(child =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.clinician && child.clinician.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, displayedChildren]);

  const getStatusBadgeVariant = (status: Child['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'default';
    }
  };


  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Baby className="mr-3 h-7 w-7 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage your children's profiles.</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="font-headline text-2xl font-bold tracking-tight">My Children</h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search children..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <Button asChild size="icon">
              <Link href="/dashboard/children/new">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add New Child</span>
              </Link>
            </Button>
          </div>
        </div>

        {filteredChildren.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Children Found</CardTitle>
              <CardDescription>
                {searchTerm ? "No children match your search criteria." : "You haven't added any child profiles yet."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/children/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Child
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredChildren.map((child) => (
              <Card key={child.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatar} alt={child.name} data-ai-hint={child.aiHint} />
                      <AvatarFallback name={child.name}>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-headline text-lg">
                        <Link href={`/dashboard/children/${child.id}`} className="hover:underline">{child.name}</Link>
                      </CardTitle>
                      <CardDescription>{child.age}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link href={`/dashboard/children/${child.id}`}><Eye className="mr-2 h-4 w-4" />View Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/dashboard/children/${child.id}/edit`}><Edit3 className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">Last Update: {formatDateStandard(child.lastUpdate)}</p>
                  {child.clinician && <p className="text-sm text-muted-foreground">Clinician: {child.clinician}</p>}
                  <Badge variant={getStatusBadgeVariant(child.status)} className="mt-2">{child.status}</Badge>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/children/${child.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Age</TableHead>
                  <TableHead className="hidden lg:table-cell">Clinician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Update</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={child.avatar} alt={child.name} data-ai-hint={child.aiHint}/>
                          <AvatarFallback name={child.name}>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <Link href={`/dashboard/children/${child.id}`} className="font-medium hover:underline">{child.name}</Link>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{child.age}</TableCell>
                    <TableCell className="hidden lg:table-cell">{child.clinician || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(child.status)}>{child.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDateStandard(child.lastUpdate)}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/dashboard/children/${child.id}`}><Eye className="mr-2 h-4 w-4" />View Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href={`/dashboard/children/${child.id}/edit`}><Edit3 className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
