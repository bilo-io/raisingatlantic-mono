"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserFormModal } from '@/components/admin/UserFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle, Search, Users, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api/adapters/user.adapter';
import { UserRole } from '@/lib/constants';
import { formatDateStandard } from '@/utils/date';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
import { useToast } from '@/hooks/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      addToast({
        title: "Error",
        description: "Failed to load users directory.",
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [users, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
      addToast({
          title: "User Deleted",
          description: "The user has been successfully removed.",
          type: "error"
      });
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
        if (editingUser) {
          const updated = await updateUser(editingUser.id, data);
          setUsers(currentUsers => currentUsers.map(u => u.id === editingUser.id ? updated : u));
          addToast({
            title: "User Updated",
            description: `${data.name}'s profile has been updated.`,
            type: 'success',
          });
        } else {
          const newUser = await createUser(data);
          setUsers(currentUsers => [newUser, ...currentUsers]);
          addToast({
            title: "User Added",
            description: `${newUser.name} has been successfully added.`,
            type: 'success',
          });
        }
    } catch (error) {
        console.error("Failed to save user:", error);
        addToast({
            title: "Error",
            description: "Failed to save user details.",
            type: 'error',
        });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.ADMIN: return 'destructive';
      case UserRole.SUPER_ADMIN: return 'destructive';
      case UserRole.CLINICIAN: return 'default';
      case UserRole.PARENT: return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <UserFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleFormSubmit}
        user={editingUser}
      />
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Users className="mr-3 h-7 w-7 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage all users in the system.</p>
                </TooltipContent>
              </Tooltip>
              <h1 className="font-headline text-2xl font-bold tracking-tight">User Management</h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full flex-1">
                  <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                      type="search"
                      placeholder="Search by name or email..."
                      className="pl-8 w-full sm:w-[250px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value={UserRole.PARENT}>Parent</SelectItem>
                          <SelectItem value={UserRole.CLINICIAN}>Clinician</SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Button onClick={handleAddUser}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all users in the system. You can add, edit, or delete users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined Date</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <RoleAvatar
                            src={user.imageUrl}
                            name={user.name}
                            role={user.role}
                            avatarClassName="h-10 w-10"
                          />
                          <Link href={`/dashboard/admin/users/${user.id}`} className="font-medium hover:underline">
                              {(user.title || '') + user.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDateStandard(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}>
                                <Eye className="h-4 w-4" />
                             </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user account
                                        and remove their data from our servers.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Yes, delete user
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
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
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
}
