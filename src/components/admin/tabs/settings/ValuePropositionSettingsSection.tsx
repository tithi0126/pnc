interface ValuePropositionSettingsSectionProps {
  settings: {
    value_prop_title: string;
    value_prop_description: string;
    value_prop_benefits: string;
  };
  onChange: (key: string, value: string) => void;
}

export const ValuePropositionSettingsSection = ({ settings, onChange }: ValuePropositionSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Value Proposition Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.value_prop_title}
            onChange={(e) => onChange('value_prop_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={settings.value_prop_description}
            onChange={(e) => onChange('value_prop_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
          <textarea
            value={JSON.parse(settings.value_prop_benefits || '[]').join('\n')}
            onChange={(e) => {
              const benefits = e.target.value.split('\n').filter(b => b.trim());
              onChange('value_prop_benefits', JSON.stringify(benefits));
            }}
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

