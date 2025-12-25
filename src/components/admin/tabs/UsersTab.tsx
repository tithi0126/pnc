import { useState, useEffect } from "react";
import { UserPlus, Shield, Trash2, Search } from "lucide-react";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

export const UsersTab = () => {
  const [users, setUsers] = useState<(Profile & { roles: UserRole[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await usersAPI.getAll();
      
      // Transform MongoDB data to match interface
      const usersWithRoles = (allUsers || []).map((user: any) => {
        const roles: UserRole[] = [];
        if (user.roles && Array.isArray(user.roles)) {
          user.roles.forEach((role: string, index: number) => {
            roles.push({
              id: `${user._id || user.id}_${index}`,
              user_id: user._id?.toString() || user.id || '',
              role: role as "admin" | "moderator" | "user",
              created_at: user.createdAt || user.created_at || new Date().toISOString(),
            });
          });
        }
        
        return {
          id: user._id?.toString() || user.id || '',
          email: user.email || '',
          full_name: user.fullName || user.full_name || user.name || '',
          roles,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async (userId: string, role: "admin" | "moderator" | "user") => {
    try {
      await usersAPI.addRole(userId, role);
      toast({ title: `${role} role added` });
      fetchUsers();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    try {
      await usersAPI.removeRole(userId, role);
      toast({ title: "Role removed" });
      fetchUsers();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter(u => u.roles.some(r => r.role === "admin")).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            {users.length} users • {adminCount} admins
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 border border-border text-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-card rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.full_name || "No name"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Current Roles */}
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <span 
                        key={role.id} 
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          role.role === "admin" ? "bg-primary/10 text-primary" :
                          role.role === "moderator" ? "bg-accent/10 text-accent" :
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {role.role}
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleRemoveRole(user.id, role.role)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Add Role */}
                  {user.id !== currentUser?.id && user.roles.length === 0 && (
                    <button
                      onClick={() => handleAddRole(user.id, "admin")}
                      className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                      title="Make Admin"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 rounded-2xl p-4 border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Users need to register through the admin login page first. 
          Then you can assign them admin privileges here.
        </p>
      </div>
    </div>
  );
};
