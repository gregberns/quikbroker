'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, UserCog, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/dashboard/data-table';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
  broker_name: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setResetSuccess(false);
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setResetSuccess(false);

    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!selectedUser) {
      setPasswordError('No user selected');
      return;
    }

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
        // Clear password fields after successful reset
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setPasswordError('An error occurred while resetting the password');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'id' as keyof User,
      header: 'ID',
      className: 'font-medium'
    },
    {
      key: 'email' as keyof User,
      header: 'Email'
    },
    {
      key: 'role' as keyof User,
      header: 'Role',
      cell: (user: User) => (
        <span className={cn(
          "px-2 py-1 text-xs font-medium rounded-full",
          user.role === 'admin' && "bg-purple-100 text-purple-800",
          user.role === 'broker' && "bg-green-100 text-green-800",
          user.role === 'carrier' && "bg-blue-100 text-blue-800"
        )}>
          {user.role}
        </span>
      )
    },
    {
      key: 'created_at' as keyof User,
      header: 'Created At',
      cell: (user: User) => formatDate(user.created_at)
    },
    {
      key: 'broker_name' as keyof User,
      header: 'Company',
      cell: (user: User) => user.broker_name || 'N/A'
    },
    {
      key: 'actions' as keyof User,
      header: 'Actions',
      className: 'text-right',
      cell: (user: User) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => openPasswordModal(user)}
          className="text-primary hover:text-primary/90"
        >
          <UserCog className="h-4 w-4 mr-1" />
          Reset Password
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/admin')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-sm text-muted-foreground mt-1">
                A list of all users in the system.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={fetchUsers} 
                variant="outline"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start" role="alert">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <DataTable 
              data={users}
              columns={columns}
              searchable
              searchPlaceholder="Search users..."
              pagination
              itemsPerPage={10}
              emptyMessage="No users found."
            />
          )}
        </div>
      </Card>

      {/* Password Reset Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-medium">Reset Password for {selectedUser.email}</h3>
              <Button variant="ghost" size="icon" onClick={closePasswordModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="p-6 space-y-4">
                {resetSuccess && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded border border-green-200 flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-green-500" />
                    <span>Password reset successfully!</span>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t p-4 bg-muted/20">
                <Button type="button" variant="outline" onClick={closePasswordModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  Reset Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
