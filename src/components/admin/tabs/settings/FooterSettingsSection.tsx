interface FooterSettingsSectionProps {
  settings: {
    footer_description: string;
    footer_services: string;
    footer_copyright: string;
    footer_links: string;
    social_links: string;
  };
  onChange: (key: string, value: string) => void;
}

export const FooterSettingsSection = ({ settings, onChange }: FooterSettingsSectionProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-medium text-foreground mb-4">Footer Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Footer Description</label>
          <textarea
            value={settings.footer_description}
            onChange={(e) => onChange('footer_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Footer Services (one per line)</label>
          <textarea
            value={JSON.parse(settings.footer_services || '[]').join('\n')}
            onChange={(e) => {
              const services = e.target.value.split('\n').filter(s => s.trim());
              onChange('footer_services', JSON.stringify(services));
            }}
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Copyright Text (use {currentYear} for current year)</label>
          <input
            type="text"
            value={settings.footer_copyright}
            onChange={(e) => onChange('footer_copyright', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Footer Links (format: name|path, one per line)</label>
          <textarea
            value={JSON.parse(settings.footer_links || '[]').map((link: any) => `${link.name}|${link.path}`).join('\n')}
            onChange={(e) => {
              const links = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                const [name, path] = line.split('|');
                return { name: name?.trim() || '', path: path?.trim() || '' };
              });
              onChange('footer_links', JSON.stringify(links));
            }}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Social Links (format: platform|url|icon, one per line)</label>
          <textarea
            value={JSON.parse(settings.social_links || '[]').map((social: any) => `${social.platform}|${social.url}|${social.icon}`).join('\n')}
            onChange={(e) => {
              const socials = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                const [platform, url, icon] = line.split('|');
                return {
                  platform: platform?.trim() || '',
                  url: url?.trim() || '',
                  icon: icon?.trim() || ''
                };
              });
              onChange('social_links', JSON.stringify(socials));
            }}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};