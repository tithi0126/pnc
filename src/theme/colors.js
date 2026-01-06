// Centralized color theme for the frontend
// Semantic keys are grouped by feature/usage. Values are Tailwind utility fragments
// so we can keep existing layout and style structure while centralizing colors.

export const colors = {
  // Generic overlays
  overlayBackdrop: "bg-black/80",
  imageModalOverlay: "bg-black/90",

  // Image modal
  imageModalButton: "bg-white/90 text-gray-900 hover:bg-white",
  imageModalCounter: "bg-white/90 text-gray-900",
  imageModalTitle: "bg-white/90 text-gray-900",
  imageModalThumbnailActive: "border-white shadow-lg scale-110",
  imageModalThumbnailInactive:
    "border-gray-500 hover:border-gray-300 opacity-70 hover:opacity-100",

  // Toasts
  toastCloseDestructive:
    "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",

  // Gallery page
  galleryInactiveBadge: "bg-red-500/90 text-white",

  // Contact page
  whatsappButton: "bg-[#25D366] hover:bg-[#20BD5A] text-primary-foreground",

  // Awards (admin & public)
  awardsIconAward: "bg-yellow-100 text-yellow-600",
  awardsIconEvent: "bg-blue-100 text-blue-600",
  awardsPillAward: "bg-yellow-100 text-yellow-700",
  awardsPillEvent: "bg-blue-100 text-blue-700",
  awardsMoreImagesPill:
    "bg-gray-200 text-gray-600 hover:bg-gray-300 border-2 border-gray-800",
  awardsMainImageFallbackAward:
    "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600",
  awardsMainImageFallbackEvent:
    "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600",
  awardsImageOverlayBackground:
    "bg-black/0 group-hover:bg-black/20",
  awardsImageOverlayContent: "bg-white/90 text-gray-800",
  awardsImageDeleteButton: "bg-red-500 text-white",

  // Services page
  servicesRatingStar: "text-amber-500",
  servicesRatingStarFilled: "fill-amber-500 text-amber-500",
  servicesRatingValue: "text-amber-600",
  servicesCtaGuaranteeIcon: "text-green-500",
  servicesStatsGradientClients: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
  servicesStatsGradientAwards: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
  servicesStatsGradientSuccess: "bg-gradient-to-br from-orange-500/20 to-pink-500/20",
  servicesStatsGradientSupport: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
};
