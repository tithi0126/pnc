interface AboutSettingsSectionProps {
  settings: {
    about_title: string;
    about_description_1: string;
    about_description_2: string;
    about_credentials: string;
  };
  onChange: (key: string, value: string) => void;
}

export const AboutSettingsSection = ({ settings, onChange }: AboutSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">About Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.about_title}
            onChange={(e) => onChange('about_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description (First Paragraph)</label>
          <textarea
            value={settings.about_description_1}
            onChange={(e) => onChange('about_description_1', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description (Second Paragraph)</label>
          <textarea
            value={settings.about_description_2}
            onChange={(e) => onChange('about_description_2', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Credentials (one per line)</label>
          <textarea
            value={JSON.parse(settings.about_credentials || '[]').join('\n')}
            onChange={(e) => {
              const credentials = e.target.value.split('\n').filter(c => c.trim());
              onChange('about_credentials', JSON.stringify(credentials));
            }}
            rows={4}
            placeholder="Ph.D. in Nutrition Science&#10;Certified Dietitian&#10;Sports Nutrition Expert&#10;Published Author"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

