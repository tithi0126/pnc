import { useAuth } from "@/contexts/AuthContext";

export const AccountInfoSection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Account Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">User ID</label>
          <input
            type="text"
            value={user?.id || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

