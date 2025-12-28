interface AboutPageSettingsSectionProps {
  settings: {
    about_page_title: string;
    about_page_subtitle: string;
    about_story_title: string;
    about_story_paragraph_1: string;
    about_story_paragraph_2: string;
    about_story_paragraph_3: string;
    about_mission: string;
    about_vision: string;
    about_page_credentials: string;
    about_page_achievements: string;
    about_core_values_title: string;
    about_core_values_subtitle: string;
  };
  onChange: (key: string, value: string) => void;
}

export const AboutPageSettingsSection = ({ settings, onChange }: AboutPageSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">About Page</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <input
            type="text"
            value={settings.about_page_title}
            onChange={(e) => onChange('about_page_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Page Subtitle</label>
          <textarea
            value={settings.about_page_subtitle}
            onChange={(e) => onChange('about_page_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Story Title</label>
          <input
            type="text"
            value={settings.about_story_title}
            onChange={(e) => onChange('about_story_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Story Paragraph 1</label>
          <textarea
            value={settings.about_story_paragraph_1}
            onChange={(e) => onChange('about_story_paragraph_1', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Story Paragraph 2</label>
          <textarea
            value={settings.about_story_paragraph_2}
            onChange={(e) => onChange('about_story_paragraph_2', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Story Paragraph 3</label>
          <textarea
            value={settings.about_story_paragraph_3}
            onChange={(e) => onChange('about_story_paragraph_3', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mission Statement</label>
          <textarea
            value={settings.about_mission}
            onChange={(e) => onChange('about_mission', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Vision Statement</label>
          <textarea
            value={settings.about_vision}
            onChange={(e) => onChange('about_vision', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Qualifications (one per line)</label>
          <textarea
            value={JSON.parse(settings.about_page_credentials || '[]').join('\n')}
            onChange={(e) => {
              const credentials = e.target.value.split('\n').filter(c => c.trim());
              onChange('about_page_credentials', JSON.stringify(credentials));
            }}
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Achievements (format: number|label, one per line)</label>
          <textarea
            value={JSON.parse(settings.about_page_achievements || '[]').map((a: any) => `${a.number}|${a.label}`).join('\n')}
            onChange={(e) => {
              const achievements = e.target.value.split('\n').filter(a => a.trim()).map(line => {
                const [number, label] = line.split('|');
                return { number: number?.trim() || '', label: label?.trim() || '' };
              });
              onChange('about_page_achievements', JSON.stringify(achievements));
            }}
            rows={4}
            placeholder="5000+|Clients Helped&#10;15+|Years Experience"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Core Values Title</label>
          <input
            type="text"
            value={settings.about_core_values_title}
            onChange={(e) => onChange('about_core_values_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Core Values Subtitle</label>
          <textarea
            value={settings.about_core_values_subtitle}
            onChange={(e) => onChange('about_core_values_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
};

