interface NavbarSettingsSectionProps {
  settings: {
    navbar_brand_name: string;
    navbar_brand_tagline: string;
  };
  onChange: (key: string, value: string) => void;
}

export const NavbarSettingsSection = ({ settings, onChange }: NavbarSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Navbar Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Brand Name</label>
          <input
            type="text"
            value={settings.navbar_brand_name}
            onChange={(e) => onChange('navbar_brand_name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Brand Tagline</label>
          <input
            type="text"
            value={settings.navbar_brand_tagline}
            onChange={(e) => onChange('navbar_brand_tagline', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};