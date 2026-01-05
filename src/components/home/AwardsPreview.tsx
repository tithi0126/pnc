import { useState, useEffect } from "react";
import { Trophy, Calendar, Award } from "lucide-react";
import { awardsAPI } from "@/lib/api";
import { colors } from "@/theme/colors";

interface Award {
  id: string;
  title: string;
  description?: string;
  organization?: string;
  date: string;
  type: 'award' | 'event';
  images: string[];
  is_active: boolean;
  sort_order: number;
}

const AwardsPreview = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const awardsData = await awardsAPI.getAll();
        setAwards(awardsData.slice(0, 6)); // Show first 6 awards/events
      } catch (error) {
        console.error('Failed to fetch awards:', error);
        setAwards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    );
  }

  if (awards.length === 0) {
    return null; // Don't show section if no awards
  }

  const awardsList = awards.filter(award => award.type === 'award');
  const eventsList = awards.filter(award => award.type === 'event');

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Awards & Events
          </h2>
          <p className="text-lg text-foreground font-medium">
            Celebrating achievements and milestones in nutrition excellence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Awards Section */}
          {awardsList.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${colors.awardsIconAward}`}>
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Awards</h3>
              </div>

              <div className="space-y-6">
                {awardsList.map((award) => (
                  <div
                    key={award.id}
                    className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {award.images && award.images.length > 0 && (
                        <img
                          src={award.images[0]}
                          alt={award.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-2">{award.title}</h4>
                        {award.organization && (
                          <p className="text-sm text-primary font-medium mb-1">{award.organization}</p>
                        )}
                        <p className="text-sm text-foreground font-medium mb-2">
                          {new Date(award.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        {award.description && (
                          <p className="text-sm text-foreground font-medium line-clamp-2">{award.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {eventsList.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${colors.awardsIconEvent}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Events</h3>
              </div>

              <div className="space-y-6">
                {eventsList.map((event) => (
                  <div
                    key={event.id}
                    className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {event.images && event.images.length > 0 && (
                        <img
                          src={event.images[0]}
                          alt={event.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                        {event.organization && (
                          <p className="text-sm text-primary font-medium mb-1">{event.organization}</p>
                        )}
                        <p className="text-sm text-foreground font-medium mb-2">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {event.description && (
                          <p className="text-sm text-foreground font-medium line-clamp-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{awardsList.length}</div>
            <div className="text-sm text-foreground font-medium">Awards Won</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{eventsList.length}</div>
            <div className="text-sm text-foreground font-medium">Events Attended</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {new Date().getFullYear() - 2015}+
            </div>
            <div className="text-sm text-foreground font-medium">Years Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">5000+</div>
            <div className="text-sm text-foreground font-medium">Lives Impacted</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsPreview;
