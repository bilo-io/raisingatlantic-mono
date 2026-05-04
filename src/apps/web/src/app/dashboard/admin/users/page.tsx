'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PlusCircle,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/lib/constants';
import { formatDateStandard } from '@/utils/date';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
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
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/lib/api/hooks';
import { QueryStateView } from '@/components/ui/QueryStateView';
import { TableSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import type { User } from '@/types/models';

const ITEMS_PER_PAGE = 10;

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return 'destructive' as const;
    case UserRole.CLINICIAN:
      return 'default' as const;
    case UserRole.PARENT:
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

export default function UserManagementPage() {
  const router = useRouter();
  const usersQuery = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string) => deleteMutation.mutate(id);

  const handleFormSubmit = async (data: Partial<User>) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, patch: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
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
            <h1 className="font-headline text-2xl font-bold tracking-tight">
              User Management
            </h1>
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(v) => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }}
              >
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
              <QueryStateView
                query={usersQuery}
                skeleton={<TableSkeleton rows={5} cols={5} />}
                isEmpty={(data) => data.length === 0}
                empty={
                  <EmptyState
                    icon={Users}
                    title="No users yet"
                    description="Add your first user to get started."
                    action={
                      <Button onClick={handleAddUser}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add User
                      </Button>
                    }
                  />
                }
              >
                {(users) => {
                  const filtered = users.filter((u) => {
                    const search = searchTerm.toLowerCase();
                    const matchesSearch =
                      !search ||
                      u.name?.toLowerCase().includes(search) ||
                      u.email?.toLowerCase().includes(search);
                    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                    return matchesSearch && matchesRole;
                  });
                  const totalPages = Math.max(
                    1,
                    Math.ceil(filtered.length / ITEMS_PER_PAGE),
                  );
                  const safePage = Math.min(currentPage, totalPages);
                  const start = (safePage - 1) * ITEMS_PER_PAGE;
                  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

                  return (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Joined Date
                            </TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginated.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                No users match your filters.
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginated.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <RoleAvatar
                                      src={user.imageUrl}
                                      name={user.name}
                                      role={user.role}
                                      avatarClassName="h-10 w-10"
                                    />
                                    <Link
                                      href={`/dashboard/admin/users/${user.id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {(user.title || '') + user.name}
                                    </Link>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {user.email}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role
                                      .replace(/_/g, ' ')
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {formatDateStandard(user.createdAt)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        router.push(`/dashboard/admin/users/${user.id}`)
                                      }
                                      aria-label="View user"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditUser(user)}
                                      aria-label="Edit user"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                          aria-label="Delete user"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you absolutely sure?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will
                                            permanently delete the user account and
                                            remove their data from our servers.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Yes, delete user
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                          <span className="text-sm text-muted-foreground">
                            Page {safePage} of {totalPages}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={safePage === 1}
                            >
                              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={safePage === totalPages}
                            >
                              Next <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }}
              </QueryStateView>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
}
