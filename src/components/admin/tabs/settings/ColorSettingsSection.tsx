import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { hslToHex, hexToHsl, updateColorTheme, ColorTheme } from "@/utils/colorTheme";

interface ColorSettingsSectionProps {
  settings: ColorTheme;
  onChange: (key: string, value: string) => void;
}

export const ColorSettingsSection = ({ settings, onChange }: ColorSettingsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');

  // Apply color theme on mount and when settings change
  useEffect(() => {
    updateColorTheme(settings);
  }, [settings]);

  const ColorPicker = ({
    label,
    value,
    onChange: onColorChange,
    description
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
  }) => {

    return (
      <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hslToHex(value)}
            onChange={(e) => onColorChange(hexToHsl(e.target.value))}
            className="w-12 h-8 rounded border border-border cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-32 px-2 py-1 text-xs font-mono border border-border rounded bg-background text-foreground"
            placeholder="hsl(0, 0%, 0%)"
          />
        </div>
      </div>
    );
  };

  const lightColors = [
    { key: 'light_background', label: 'Background', description: 'Main page background color' },
    { key: 'light_foreground', label: 'Foreground', description: 'Primary text color' },
    { key: 'light_card', label: 'Card Background', description: 'Card and panel backgrounds' },
    { key: 'light_card_foreground', label: 'Card Text', description: 'Text color on cards' },
    { key: 'light_popover', label: 'Popover Background', description: 'Dropdown and modal backgrounds' },
    { key: 'light_popover_foreground', label: 'Popover Text', description: 'Text in popovers' },
    { key: 'light_primary', label: 'Primary', description: 'Main brand color' },
    { key: 'light_primary_foreground', label: 'Primary Text', description: 'Text on primary backgrounds' },
    { key: 'light_secondary', label: 'Secondary', description: 'Secondary background color' },
    { key: 'light_secondary_foreground', label: 'Secondary Text', description: 'Text on secondary backgrounds' },
    { key: 'light_muted', label: 'Muted Background', description: 'Subtle background areas' },
    { key: 'light_muted_foreground', label: 'Muted Text', description: 'Secondary text color' },
    { key: 'light_accent', label: 'Accent', description: 'Highlight and accent color' },
    { key: 'light_accent_foreground', label: 'Accent Text', description: 'Text on accent backgrounds' },
    { key: 'light_destructive', label: 'Destructive', description: 'Error and danger color' },
    { key: 'light_destructive_foreground', label: 'Destructive Text', description: 'Text on destructive backgrounds' },
    { key: 'light_border', label: 'Border', description: 'Border and divider colors' },
    { key: 'light_input', label: 'Input Border', description: 'Form input borders' },
    { key: 'light_ring', label: 'Focus Ring', description: 'Focus and selection indicators' },
  ];

  const customLightColors = [
    { key: 'light_sage', label: 'Sage', description: 'Natural green tone' },
    { key: 'light_sage_light', label: 'Sage Light', description: 'Lighter sage variant' },
    { key: 'light_sage_dark', label: 'Sage Dark', description: 'Darker sage variant' },
    { key: 'light_cream', label: 'Cream', description: 'Warm neutral tone' },
    { key: 'light_cream_dark', label: 'Cream Dark', description: 'Darker cream variant' },
    { key: 'light_terracotta', label: 'Terracotta', description: 'Warm earth tone' },
    { key: 'light_terracotta_light', label: 'Terracotta Light', description: 'Lighter terracotta' },
    { key: 'light_forest', label: 'Forest', description: 'Deep forest green' },
    { key: 'light_warm_white', label: 'Warm White', description: 'Slightly warm white' },
  ];

  const darkColors = [
    { key: 'dark_background', label: 'Background', description: 'Main page background in dark mode' },
    { key: 'dark_foreground', label: 'Foreground', description: 'Primary text color in dark mode' },
    { key: 'dark_card', label: 'Card Background', description: 'Card backgrounds in dark mode' },
    { key: 'dark_card_foreground', label: 'Card Text', description: 'Text on cards in dark mode' },
    { key: 'dark_popover', label: 'Popover Background', description: 'Dropdown backgrounds in dark mode' },
    { key: 'dark_popover_foreground', label: 'Popover Text', description: 'Text in popovers in dark mode' },
    { key: 'dark_primary', label: 'Primary', description: 'Main brand color in dark mode' },
    { key: 'dark_primary_foreground', label: 'Primary Text', description: 'Text on primary backgrounds in dark mode' },
    { key: 'dark_secondary', label: 'Secondary', description: 'Secondary backgrounds in dark mode' },
    { key: 'dark_secondary_foreground', label: 'Secondary Text', description: 'Text on secondary backgrounds in dark mode' },
    { key: 'dark_muted', label: 'Muted Background', description: 'Subtle backgrounds in dark mode' },
    { key: 'dark_muted_foreground', label: 'Muted Text', description: 'Secondary text in dark mode' },
    { key: 'dark_accent', label: 'Accent', description: 'Highlight color in dark mode' },
    { key: 'dark_accent_foreground', label: 'Accent Text', description: 'Text on accent backgrounds in dark mode' },
    { key: 'dark_destructive', label: 'Destructive', description: 'Error color in dark mode' },
    { key: 'dark_destructive_foreground', label: 'Destructive Text', description: 'Text on destructive backgrounds in dark mode' },
    { key: 'dark_border', label: 'Border', description: 'Borders in dark mode' },
    { key: 'dark_input', label: 'Input Border', description: 'Form borders in dark mode' },
    { key: 'dark_ring', label: 'Focus Ring', description: 'Focus indicators in dark mode' },
  ];

  const customDarkColors = [
    { key: 'dark_sage', label: 'Sage', description: 'Natural green in dark mode' },
    { key: 'dark_sage_light', label: 'Sage Light', description: 'Lighter sage in dark mode' },
    { key: 'dark_sage_dark', label: 'Sage Dark', description: 'Darker sage in dark mode' },
    { key: 'dark_cream', label: 'Cream', description: 'Warm neutral in dark mode' },
    { key: 'dark_cream_dark', label: 'Cream Dark', description: 'Darker cream in dark mode' },
    { key: 'dark_terracotta', label: 'Terracotta', description: 'Warm earth tone in dark mode' },
    { key: 'dark_forest', label: 'Forest', description: 'Deep forest green in dark mode' },
    { key: 'dark_warm_white', label: 'Warm White', description: 'Slightly warm white in dark mode' },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-primary" />
        <h3 className="font-medium text-foreground">Color Theme Settings</h3>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('light')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'light'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Light Mode
        </button>
        <button
          onClick={() => setActiveTab('dark')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Dark Mode
        </button>
      </div>

      {/* Color Settings */}
      <div className="space-y-4">
        <div className="grid gap-4">
          <h4 className="text-lg font-medium text-foreground">
            {activeTab === 'light' ? 'Light Mode Colors' : 'Dark Mode Colors'}
          </h4>

          {(activeTab === 'light' ? lightColors : darkColors).map((color) => (
            <ColorPicker
              key={color.key}
              label={color.label}
              value={settings[color.key as keyof typeof settings] as string}
              onChange={(value) => onChange(color.key, value)}
              description={color.description}
            />
          ))}
        </div>

        <div className="grid gap-4 mt-8">
          <h4 className="text-lg font-medium text-foreground">
            Custom Brand Colors - {activeTab === 'light' ? 'Light Mode' : 'Dark Mode'}
          </h4>

          {(activeTab === 'light' ? customLightColors : customDarkColors).map((color) => (
            <ColorPicker
              key={color.key}
              label={color.label}
              value={settings[color.key as keyof typeof settings] as string}
              onChange={(value) => onChange(color.key, value)}
              description={color.description}
            />
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">🎨 Live Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sample Card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h5 className="text-card-foreground font-medium mb-2">Sample Card</h5>
            <p className="text-muted-foreground text-sm">This shows how cards will look with your colors.</p>
            <button className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
              Primary Button
            </button>
          </div>

          {/* Sample Form */}
          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-card-foreground mb-2">Sample Input</label>
            <input
              type="text"
              placeholder="Type here..."
              className="w-full px-3 py-2 border border-input bg-background rounded text-sm"
            />
          </div>

          {/* Color Palette */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h5 className="text-card-foreground font-medium mb-2">Color Palette</h5>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-primary border border-border"></div>
              <div className="w-6 h-6 rounded-full bg-secondary border border-border"></div>
              <div className="w-6 h-6 rounded-full bg-accent border border-border"></div>
              <div className="w-6 h-6 rounded-full bg-muted border border-border"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">💡 Tips for Color Customization:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Changes are applied immediately to the preview above</li>
          <li>• Use HSL format (hsl(hue, saturation%, lightness%)) for precise control</li>
          <li>• Ensure sufficient contrast between text and background colors</li>
          <li>• Test both light and dark modes thoroughly</li>
          <li>• Consider accessibility when choosing color combinations</li>
          <li>• Save your settings to persist changes across sessions</li>
        </ul>
      </div>
    </div>
  );
};
