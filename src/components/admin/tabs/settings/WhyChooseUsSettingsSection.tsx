interface WhyChooseUsSettingsSectionProps {
  settings: {
    why_choose_title: string;
    why_choose_subtitle: string;
    why_choose_features: string;
  };
  onChange: (key: string, value: string) => void;
}

export const WhyChooseUsSettingsSection = ({ settings, onChange }: WhyChooseUsSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Why Choose Us Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.why_choose_title}
            onChange={(e) => onChange('why_choose_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <textarea
            value={settings.why_choose_subtitle}
            onChange={(e) => onChange('why_choose_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Features (format: title|description, one per line)</label>
          <textarea
            value={JSON.parse(settings.why_choose_features || '[]').map((f: any) => `${f.title}|${f.description}`).join('\n')}
            onChange={(e) => {
              const features = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                const [title, description] = line.split('|');
                return {
                  title: title?.trim() || '',
                  description: description?.trim() || ''
                };
              });
              onChange('why_choose_features', JSON.stringify(features));
            }}
            rows={6}
            placeholder="Expert Guidance|Work with certified nutrition professionals&#10;Personalized Plans|Tailored solutions for your unique needs"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

