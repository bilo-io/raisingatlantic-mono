"use client";

import { Building, ChevronLeft, ChevronRight, LayoutGrid, List, PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useMemo, useState } from 'react';
import { ResourceStatus } from '@/types/enums';
import { TenantFormModal } from '@/components/admin/TenantFormModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTenants, createTenant, updateTenant } from '@/lib/api/adapters/tenant.adapter';
import { getPractices } from '@/lib/api/adapters/practice.adapter';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';

const ITEMS_PER_PAGE = 8;
const VIEW_MODE_STORAGE_KEY = 'viewMode_tenants';

export default function TenantsPage() {
  const { addToast } = useToast();
  const [tenants, setTenants] = useState<any[]>([]);
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list' | null;
    if (storedViewMode) {
      setViewMode(storedViewMode);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tenantsData, practicesData] = await Promise.all([
          getTenants(),
          getPractices()
        ]);
        setTenants(tenantsData);
        setPractices(practicesData);
      } catch (error) {
        console.error("Failed to fetch tenants data:", error);
        addToast({
          title: "Error",
          description: "Failed to load tenants and practices.",
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode, mounted]);

  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
        const searchMatch = (tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const statusMatch = statusFilter === 'all' || tenant.status === statusFilter;
        return searchMatch && statusMatch;
    });
  }, [tenants, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTenants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTenants, currentPage]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  const handleTenantFormSubmit = async (data: any) => {
    try {
      if (data.id) {
        const updated = await updateTenant(data.id, data);
        setTenants(current => current.map(t => t.id === updated.id ? { ...t, ...updated } : t));
        addToast({ title: "Success", description: "Tenant updated successfully.", type: 'success' });
      } else {
        const created = await createTenant(data);
        setTenants(current => [created, ...current]);
        addToast({ title: "Success", description: "Tenant created successfully.", type: 'success' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save tenant:", error);
      addToast({
        title: "Error",
        description: "Failed to save tenant details.",
        type: 'error',
      });
    }
  };
  
  const handlePracticeChange = (updatedPractices: any[]) => {
    setPractices(updatedPractices);
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const renderGrid = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedTenants.map(tenant => (
        <Card key={tenant.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tenant.logoUrl || ''} alt={`${tenant.name} logo`} />
              <AvatarFallback>{tenant.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-lg">{tenant.name}</CardTitle>
              <CardDescription className="line-clamp-1">{tenant.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow text-sm">
            <p className="text-muted-foreground">{tenant.phone || 'No phone'}</p>
            <Badge variant={getStatusBadgeVariant(tenant.status)} className="mt-3">{tenant.status}</Badge>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => { setEditingTenant(tenant); setIsModalOpen(true); }}>
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
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTenants.map(tenant => (
            <TableRow key={tenant.id} className="cursor-pointer" onClick={() => { setEditingTenant(tenant); setIsModalOpen(true); }}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={tenant.logoUrl || ''} alt={tenant.name} />
                    <AvatarFallback>{tenant.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{tenant.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{tenant.email}</TableCell>
              <TableCell className="hidden lg:table-cell">{tenant.phone || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(tenant.status)}>{tenant.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <Card key={i} className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-16" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <TenantFormModal 
        key={editingTenant?.id}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onTenantSubmit={handleTenantFormSubmit}
        tenant={editingTenant}
        practices={practices}
        onPracticesChange={handlePracticeChange}
      />
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Building className="mr-3 h-7 w-7 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage all tenants in the system.</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Tenant Management</h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full flex-1">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tenants..."
                  className="pl-8 w-full sm:w-[250px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
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
              <Button size="icon" onClick={handleAddTenant}>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Tenant</span>
              </Button>
            </div>
          </div>

          {loading ? (
             renderSkeletons()
          ) : paginatedTenants.length > 0 ? (
            <>
              {viewMode === 'grid' ? renderGrid() : renderList()}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="text-center py-12 col-span-full">
                <CardHeader>
                    <CardTitle>No Tenants Found</CardTitle>
                    <CardDescription>
                    {searchTerm || statusFilter !== 'all'
                        ? "No tenants match your filter criteria."
                        : "There are no tenants in the system yet."}
                    </CardDescription>
                </CardHeader>
            </Card>
          )}
        </div>
      </TooltipProvider>
    </>
  );
}
