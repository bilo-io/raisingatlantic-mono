
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
import { dummyUsers, type User } from '@/data/users';
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

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
    addToast({
        title: "User Deleted",
        description: "The user has been successfully removed.",
        type: "error"
    });
  };

  const handleFormSubmit = (data: { name: string; email: string; role: UserRole; title?: string; phone?: string; imageUrl?: string } & { id?: string }) => {
    if (editingUser) { // Update existing user
      setUsers(currentUsers => currentUsers.map(u => u.id === editingUser.id ? { ...u, ...data, phone: data.phone || '', updatedAt: new Date().toISOString() } : u));
      addToast({
        title: "User Updated",
        description: `${data.name}'s profile has been updated.`,
        type: 'success',
      });
    } else { // Add new user
      const newUser: User = {
        ...data,
        phone: data.phone || '',
        id: `user-${Date.now()}`, // Simple unique ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers(currentUsers => [newUser, ...currentUsers]);
      addToast({
        title: "User Added",
        description: `${newUser.name} has been successfully added.`,
        type: 'success',
      });
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
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
                  {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
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
                          {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDateStandard(user.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DropdownMenuItem onSelect={() => router.push(`/dashboard/admin/users/${user.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                             </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                     <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
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
