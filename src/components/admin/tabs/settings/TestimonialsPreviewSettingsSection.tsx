interface TestimonialsPreviewSettingsSectionProps {
  settings: {
    testimonials_title: string;
    testimonials_subtitle: string;
  };
  onChange: (key: string, value: string) => void;
}

export const TestimonialsPreviewSettingsSection = ({ settings, onChange }: TestimonialsPreviewSettingsSectionProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Testimonials Preview Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={settings.testimonials_title}
            onChange={(e) => onChange('testimonials_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <textarea
            value={settings.testimonials_subtitle}
            onChange={(e) => onChange('testimonials_subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
};
