'use client';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  MoreVertical,
  UserPlus,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { usersApi, queryKeys, invalidateQueries } from '@/lib/api';
import type { UserDetail, UserFilters } from '@/lib/api/types';
import UserFormDialog from '@/components/users/UserFormDialog';
import UserDetailDialog from '@/components/users/UserDetailDialog';

export default function UsersPage() {
  const t = useTranslations('users');
  const locale = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for filters and pagination
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    page_size: 10,
    search: '',
    role: undefined,
    user_type: undefined,
    is_active: undefined,
  });

  // State for user form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<UserDetail | undefined>(undefined);

  // State for user detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);

  // State for bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Fetch users with React Query
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersApi.getUsers(filters),
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      toast({
        title: t('messages.deleteSuccess'),
        variant: 'default',
      });
      invalidateQueries.users();
    },
    onError: (error: any) => {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Bulk delete users mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      // Delete users one by one
      const results = await Promise.allSettled(
        userIds.map((id) => usersApi.deleteUser(id))
      );

      // Count successes and failures
      const successCount = results.filter((r) => r.status === 'fulfilled').length;
      const failureCount = results.filter((r) => r.status === 'rejected').length;

      return { successCount, failureCount };
    },
    onSuccess: ({ successCount, failureCount }) => {
      if (failureCount > 0) {
        toast({
          title: t('messages.error'),
          description: `${successCount} users deleted, ${failureCount} failed`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('messages.deleteSuccess'),
          description: `${successCount} users deleted successfully`,
          variant: 'default',
        });
      }
      invalidateQueries.users();
      setSelectedUserIds(new Set());
    },
    onError: (error: any) => {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle delete
  const handleDelete = async (userId: string) => {
    if (confirm(t('messages.deleteConfirm'))) {
      await deleteMutation.mutateAsync(userId);
    }
  };

  // Handle open add user dialog
  const handleAddUser = () => {
    setDialogMode('create');
    setSelectedUser(undefined);
    setDialogOpen(true);
  };

  // Handle open edit user dialog
  const handleEditUser = (user: UserDetail) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Handle open user detail dialog
  const handleViewUser = (user: UserDetail) => {
    setDetailUser(user);
    setDetailDialogOpen(true);
  };

  // Handle edit from detail view
  const handleEditFromDetail = (user: UserDetail) => {
    setDetailDialogOpen(false);
    handleEditUser(user);
  };

  // Handle select all users on current page
  const handleSelectAll = (checked: boolean) => {
    if (checked && usersData?.items) {
      const newSelected = new Set(usersData.items.map((user) => user.id));
      setSelectedUserIds(newSelected);
    } else {
      setSelectedUserIds(new Set());
    }
  };

  // Handle select individual user
  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUserIds);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUserIds(newSelected);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const count = selectedUserIds.size;
    const confirmMessage = t('messages.bulkDeleteConfirm').replace('{count}', count.toString());

    if (confirm(confirmMessage)) {
      await bulkDeleteMutation.mutateAsync(Array.from(selectedUserIds));
    }
  };

  // Check if all users on current page are selected
  const allSelected =
    usersData?.items &&
    usersData.items.length > 0 &&
    usersData.items.every((user) => selectedUserIds.has(user.id));

  // Check if some (but not all) users are selected
  const someSelected =
    usersData?.items &&
    usersData.items.some((user) => selectedUserIds.has(user.id)) &&
    !allSelected;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
          <Button className="bg-[#8B2635] hover:bg-[#6B1F2E]" onClick={handleAddUser}>
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('addUser')}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 rtl:pr-10 rtl:pl-3"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <Select
                value={filters.role || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('role', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                  <SelectItem value="librarian">{t('roles.librarian')}</SelectItem>
                  <SelectItem value="patron">{t('roles.patron')}</SelectItem>
                </SelectContent>
              </Select>

              {/* User Type Filter */}
              <Select
                value={filters.user_type || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('user_type', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.userType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="Staff">{t('filters.staff')}</SelectItem>
                  <SelectItem value="Patron">{t('filters.patron')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 mt-4">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{t('filters.status')}:</span>
              <div className="flex gap-2">
                <Button
                  variant={filters.is_active === undefined ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('is_active', undefined)}
                  className={
                    filters.is_active === undefined
                      ? 'bg-[#8B2635] hover:bg-[#6B1F2E]'
                      : ''
                  }
                >
                  {t('filters.all')}
                </Button>
                <Button
                  variant={filters.is_active === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('is_active', true)}
                  className={
                    filters.is_active === true ? 'bg-[#8B2635] hover:bg-[#6B1F2E]' : ''
                  }
                >
                  {t('filters.active')}
                </Button>
                <Button
                  variant={filters.is_active === false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('is_active', false)}
                  className={
                    filters.is_active === false ? 'bg-[#8B2635] hover:bg-[#6B1F2E]' : ''
                  }
                >
                  {t('filters.inactive')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{t('messages.error')}</p>
                <p className="text-sm text-gray-500 mt-2">{error.message}</p>
              </div>
            ) : !usersData?.items || usersData.items.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('table.noUsers')}</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className={someSelected ? 'data-[state=checked]:bg-[#8B2635]' : ''}
                        />
                      </TableHead>
                      <TableHead>{t('table.name')}</TableHead>
                      <TableHead>{t('table.email')}</TableHead>
                      <TableHead>{t('table.role')}</TableHead>
                      <TableHead>{t('table.userType')}</TableHead>
                      <TableHead>{t('table.status')}</TableHead>
                      <TableHead>{t('table.createdAt')}</TableHead>
                      <TableHead className="text-right rtl:text-left">
                        {t('table.actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.items.map((user) => (
                      <TableRow key={user.id} className={selectedUserIds.has(user.id) ? 'bg-gray-50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUserIds.has(user.id)}
                            onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                            aria-label={`Select ${user.full_name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              user.user_type === 'Staff'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {user.user_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_active ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle2 className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                              {t('status.active')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              <XCircle className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                              {t('status.inactive')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString(
                            locale === 'ar' ? 'ar-SA' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('actions.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('actions.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    {t('table.showing')} {(filters.page! - 1) * filters.page_size! + 1} -{' '}
                    {Math.min(filters.page! * filters.page_size!, usersData.total)} of{' '}
                    {usersData.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page === 1}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page! >= usersData.total_pages}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedUserIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Card className="shadow-lg border-2 border-gray-200">
              <CardContent className="flex items-center gap-4 py-3 px-6">
                <span className="text-sm font-medium text-gray-700">
                  {t('actions.selected').replace('{count}', selectedUserIds.size.toString())}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUserIds(new Set())}
                  >
                    <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Clear
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('actions.bulkDelete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* User Form Dialog */}
      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={selectedUser}
      />

      {/* User Detail Dialog */}
      <UserDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        user={detailUser}
        onEdit={handleEditFromDetail}
      />
    </AdminLayout>
  );
}
