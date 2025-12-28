interface ContactPageSettingsSectionProps {
  settings: {
    contact_page_title: string;
    contact_page_subtitle: string;
    contact_page_description: string;
  };
  onChange: (key: string, value: string) => void;
}

export const ContactPageSettingsSection = ({ settings, onChange }: ContactPageSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Contact Page Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <input
            type="text"
            value={settings.contact_page_title}
            onChange={(e) => onChange('contact_page_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Page Subtitle</label>
          <textarea
            value={settings.contact_page_subtitle}
            onChange={(e) => onChange('contact_page_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Page Description</label>
          <textarea
            value={settings.contact_page_description}
            onChange={(e) => onChange('contact_page_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
};
