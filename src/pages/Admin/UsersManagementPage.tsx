// src/pages/Admin/UsersManagementPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { userService } from '@/api/userService';
import type { AdminUser, UserRole } from '@/api/userService';

import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { SelectDropdown } from '@/components/forms/SelectDropdown';
import { toast } from 'sonner';
import { usersMockData } from '@/pages/Admin/data/usersMockData';

export default function UsersManagementPage() {
  const { t } = useTranslation();

  const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
    { value: 'STUDENT', label: t('roles.student') },
    { value: 'ORGANIZER', label: t('roles.organizer') },
    { value: 'ADMIN', label: t('roles.admin') },
  ];

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Use mock data in development
      if (import.meta.env.DEV) {
        setUsers(usersMockData as AdminUser[]);
      } else {
        const fetchedUsers = await userService.getAllUsers();
        setUsers(fetchedUsers);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const originalUsers = [...users];
    // Optimistic update
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      await userService.updateUserRole(userId, newRole);
      toast.success(t('admin.users.roleUpdateSuccess', { userId }));
    } catch (err) {
      // Revert on error
      setUsers(originalUsers);
      toast.error(t('admin.users.roleUpdateError'));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-h2">{t('admin.users.title')}</h1>
        <p className="text-body-sm mt-1">{t('admin.users.subtitle')}</p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('admin.users.searchPlaceholder')}
          className="input-field max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card bg-card p-0">
        {isLoading ? (
          <div className="p-8 text-center text-muted">{t('admin.users.loading')}</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : (
          <div className="">
            <table className="w-full text-left">
              <thead className="border-b border-border">
                <tr>
                  <th className="p-4 font-semibold text-main">{t('admin.users.table.fullName')}</th>
                  <th className="p-4 font-semibold text-main">{t('admin.users.table.email')}</th>
                  <th className="p-4 font-semibold text-main">
                    {t('admin.users.table.currentRole')}
                  </th>
                  <th className="p-4 font-semibold text-main text-right">
                    {t('admin.users.table.changeRole')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="p-4 text-main">{user.fullName}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'tag',
                          user.role === 'ADMIN' && 'tag-social',
                          user.role === 'ORGANIZER' && 'tag-career',
                          user.role === 'STUDENT' && 'tag-academic',
                        )}
                      >
                        {user.role ? t(`roles.${user.role.toLowerCase()}`) : ''}
                      </span>
                    </td>
                    <td className="p-4 w-48">
                      <SelectDropdown
                        options={ROLE_OPTIONS}
                        selected={user.role ?? null}
                        onChange={(role) => handleRoleChange(user.id, role as UserRole)}
                        title={t('admin.users.table.changeRole')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="p-8 text-center text-muted">{t('admin.users.noUsersFound')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
