interface HeroSettingsSectionProps {
  settings: {
    hero_badge: string;
    hero_title: string;
    hero_title_highlight: string;
    hero_subtitle: string;
    stat_clients: string;
    stat_experience: string;
    stat_success: string;
  };
  onChange: (key: string, value: string) => void;
}

export const HeroSettingsSection = ({ settings, onChange }: HeroSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Hero Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Badge Text</label>
          <input
            type="text"
            value={settings.hero_badge}
            onChange={(e) => onChange('hero_badge', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => onChange('hero_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title Highlight Text (will be styled differently)</label>
          <input
            type="text"
            value={settings.hero_title_highlight}
            onChange={(e) => onChange('hero_title_highlight', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <textarea
            value={settings.hero_subtitle}
            onChange={(e) => onChange('hero_subtitle', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Clients Count</label>
            <input
              type="text"
              value={settings.stat_clients}
              onChange={(e) => onChange('stat_clients', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years Experience</label>
            <input
              type="text"
              value={settings.stat_experience}
              onChange={(e) => onChange('stat_experience', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Success Rate</label>
            <input
              type="text"
              value={settings.stat_success}
              onChange={(e) => onChange('stat_success', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

