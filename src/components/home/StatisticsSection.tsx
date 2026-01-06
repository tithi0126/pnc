import { Users, Award, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const StatisticsSection = () => {
  const [settings, setSettings] = useState({
    stat_clients: '5003+',
    stat_experience: '15+',
    stat_success: '98%',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const publicSettings = await settingsAPI.getPublic();
        const settingsMap: any = publicSettings || {};

        setSettings({
          stat_clients: settingsMap.stat_clients || settings.stat_clients,
          stat_experience: settingsMap.stat_experience || settings.stat_experience,
          stat_success: settingsMap.stat_success || settings.stat_success,
        });
      } catch (error) {
        console.error('Error loading statistics settings:', error);
      }
    };
    loadSettings();
  }, []);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className="font-heading text-4xl lg:text-5xl font-bold text-foreground">{settings.stat_clients}</span>
            </div>
            <p className="text-lg text-muted-foreground font-medium">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-primary" />
              <span className="font-heading text-4xl lg:text-5xl font-bold text-foreground">{settings.stat_experience}</span>
            </div>
            <p className="text-lg text-muted-foreground font-medium">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="font-heading text-4xl lg:text-5xl font-bold text-foreground">{settings.stat_success}</span>
            </div>
            <p className="text-lg text-muted-foreground font-medium">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
