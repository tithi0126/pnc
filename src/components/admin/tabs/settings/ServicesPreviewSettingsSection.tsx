interface ServicesPreviewSettingsSectionProps {
  settings: {
    services_title: string;
    services_subtitle: string;
    services_features: string;
  };
  onChange: (key: string, value: string) => void;
}

export const ServicesPreviewSettingsSection = ({ settings, onChange }: ServicesPreviewSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Services Preview Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.services_title}
            onChange={(e) => onChange('services_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <textarea
            value={settings.services_subtitle}
            onChange={(e) => onChange('services_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Features (format: title|description, one per line)</label>
          <textarea
            value={JSON.parse(settings.services_features || '[]').map((f: any) => `${f.title}|${f.description}`).join('\n')}
            onChange={(e) => {
              const features = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                const [title, description] = line.split('|');
                return { title: title?.trim() || '', description: description?.trim() || '' };
              });
              onChange('services_features', JSON.stringify(features));
            }}
            rows={6}
            placeholder="Personalized Plans|Custom nutrition plans for your goals&#10;Weight Management|Evidence-based weight loss/gain"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};
