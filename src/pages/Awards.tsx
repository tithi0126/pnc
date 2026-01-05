import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Trophy, Calendar, Award as AwardIcon, MapPin } from "lucide-react";
import { awardsAPI } from "@/lib/api";
import { ImageModal } from "@/components/ImageModal";
import { colors } from "@/theme/colors";
import { normalizeImageUrl } from "@/utils/imageUrl";

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

const Awards = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const awardsData = await awardsAPI.getAll();
        setAwards(awardsData);
      } catch (error) {
        console.error('Failed to fetch awards:', error);
        setError('Failed to load awards and events');
        setAwards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAwards();
  }, []);

  const openImageModal = (images: string[], startIndex: number = 0, title: string = '') => {
    setImageModal({
      isOpen: true,
      images,
      currentIndex: startIndex,
      title
    });
  };

  const closeImageModal = () => {
    setImageModal(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading awards and events...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-destructive mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Content</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const awardsList = awards.filter(award => award.type === 'award');
  const eventsList = awards.filter(award => award.type === 'event');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Recognition & Participation</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Awards & Events
            </h1>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Celebrating achievements, milestones, and contributions to the field of nutrition and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Awards Section */}
          {awardsList.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${colors.awardsIconAward}`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Awards & Recognition
                  </h2>
                </div>
                <p className="text-lg text-foreground font-medium max-w-2xl mx-auto">
                  Professional accolades and certifications that reflect commitment to excellence in nutrition consulting.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {awardsList.map((award, index) => (
                  <div
                    key={award.id}
                    className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-center">
                      {award.images && award.images.length > 0 ? (
                        <div className="mb-6">
                          {/* Main image - large and prominent */}
                          <div
                            className="relative w-80 h-56 mx-auto mb-4 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 group"
                            onClick={() => openImageModal(award.images, 0, award.title)}
                          >
                            <img
                              src={normalizeImageUrl(award.images[0])}
                              alt={award.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = `w-48 h-32 rounded-xl flex items-center justify-center ${colors.awardsMainImageFallbackAward}`;
                                fallback.innerHTML = '<div class="text-4xl">🏆</div>';
                                target.parentElement?.appendChild(fallback);
                              }}
                            />
                            {/* Overlay with click indicator */}
                            <div
                              className={`absolute inset-0 transition-colors duration-300 flex items-center justify-center ${colors.awardsImageOverlayBackground}`}
                            >
                              <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-2 ${colors.awardsImageOverlayContent}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Clickable thumbnails - larger size */}
                          {award.images.length > 1 && (
                            <div className="flex justify-center gap-3">
                              {award.images.slice(1, 5).map((image, idx) => (
                                <div
                                  key={idx}
                                  className={`w-20 h-20 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-200 ${colors.awardsMoreImagesPill}`}
                                  onClick={() => openImageModal(award.images, idx + 1, award.title)}
                                >
                                  <img
                                    src={normalizeImageUrl(image)}
                                    alt={`${award.title} ${idx + 2}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                              {award.images.length > 5 && (
                                <div
                                  className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-200 ${colors.awardsMoreImagesPill}`}
                                  onClick={() => openImageModal(award.images, 0, award.title)}
                                >
                                  <span className="text-sm font-medium">+{award.images.length - 5}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-80 h-56 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 ${colors.awardsMainImageFallbackAward}`}
                        >
                          <div className="text-center">
                            <Trophy className="w-20 h-20 mx-auto mb-2 text-primary/60" />
                            <p className="text-sm font-medium text-primary/80">Award Image</p>
                          </div>
                        </div>
                      )}

                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${colors.awardsPillAward}`}
                      >
                        <AwardIcon className="w-4 h-4" />
                        Award
                      </div>

                      <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                        {award.title}
                      </h3>

                      {award.organization && (
                        <p className="text-primary font-medium mb-2">
                          {award.organization}
                        </p>
                      )}

                      <p className="text-sm text-foreground font-medium mb-4">
                        {new Date(award.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>

                      {award.description && (
                        <p className="text-foreground font-medium leading-relaxed">
                          {award.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {eventsList.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${colors.awardsIconEvent}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Events & Participation
                  </h2>
                </div>
                <p className="text-lg text-foreground font-medium max-w-2xl mx-auto">
                  Professional engagements, conferences, and workshops demonstrating leadership in nutrition education.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {eventsList.map((event, index) => (
                  <div
                    key={event.id}
                    className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-6">
                      {event.images && event.images.length > 0 ? (
                        <div className="flex-shrink-0">
                          {/* Main image - large and prominent */}
                          <div
                            className="w-72 h-72 rounded-2xl overflow-hidden shadow-xl mb-4 cursor-pointer hover:shadow-2xl transition-all duration-300 group relative"
                            onClick={() => openImageModal(event.images, 0, event.title)}
                          >
                            <img
                              src={normalizeImageUrl(event.images[0])}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = `w-40 h-40 rounded-xl flex items-center justify-center ${colors.awardsMainImageFallbackEvent}`;
                                fallback.innerHTML = '<div class="text-5xl">📅</div>';
                                target.parentElement?.appendChild(fallback);
                              }}
                            />
                            {/* Overlay with click indicator */}
                            <div
                              className={`absolute inset-0 transition-colors duration-300 flex items-center justify-center ${colors.awardsImageOverlayBackground}`}
                            >
                              <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-2 ${colors.awardsImageOverlayContent}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Clickable thumbnails - larger size */}
                          {event.images.length > 1 && (
                            <div className="flex justify-center gap-3">
                              {event.images.slice(1, 4).map((image, idx) => (
                                <div
                                  key={idx}
                                  className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-200"
                                  onClick={() => openImageModal(event.images, idx + 1, event.title)}
                                >
                                  <img
                                    src={normalizeImageUrl(image)}
                                    alt={`${event.title} ${idx + 2}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                              {event.images.length > 4 && (
                                <div
                                  className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-200 ${colors.awardsMoreImagesPill}`}
                                  onClick={() => openImageModal(event.images, 0, event.title)}
                                >
                                  <span className="text-sm font-medium">+{event.images.length - 4}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-72 h-72 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 ${colors.awardsMainImageFallbackEvent}`}
                        >
                          <div className="text-center">
                            <Calendar className="w-24 h-24 mx-auto mb-2 text-primary/60" />
                            <p className="text-sm font-medium text-primary/80">Event Image</p>
                          </div>
                        </div>
                      )}

                      <div className="flex-1">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${colors.awardsPillEvent}`}
                        >
                          <Calendar className="w-4 h-4" />
                          Event
                        </div>

                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                          {event.title}
                        </h3>

                        {event.organization && (
                          <p className="text-primary font-medium mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.organization}
                          </p>
                        )}

                        <p className="text-sm text-foreground font-medium mb-4">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>

                        {event.description && (
                          <p className="text-foreground font-medium leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {awardsList.length === 0 && eventsList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Awards and events will be displayed here as they become available.
                Stay tuned for updates on professional achievements and engagements.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {(awardsList.length > 0 || eventsList.length > 0) && (
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{awardsList.length}</div>
                <div className="text-sm text-muted-foreground">Awards Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{eventsList.length}</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {new Date().getFullYear() - 2015}+
                </div>
                <div className="text-sm text-muted-foreground">Years Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">5000+</div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      <ImageModal
        images={imageModal.images}
        currentIndex={imageModal.currentIndex}
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        title={imageModal.title}
      />
    </Layout>
  );
};

export default Awards;
