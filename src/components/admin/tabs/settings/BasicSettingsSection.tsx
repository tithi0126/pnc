interface BasicSettingsSectionProps {
  settings: {
    site_name: string;
    contact_email: string;
    whatsapp_number: string;
    phone_number: string;
    address: string;
    working_hours: string;
  };
  onChange: (key: string, value: string) => void;
}

export const BasicSettingsSection = ({ settings, onChange }: BasicSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Basic Settings</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => onChange('site_name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) => onChange('contact_email', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.phone_number}
            onChange={(e) => onChange('phone_number', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
          <input
            type="tel"
            value={settings.whatsapp_number}
            onChange={(e) => onChange('whatsapp_number', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Working Hours</label>
          <input
            type="text"
            value={settings.working_hours}
            onChange={(e) => onChange('working_hours', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

