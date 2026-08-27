export const ANALYTICS_EVENTS = {
  affiliateClick: "affiliate_click",
  newsletterSignup: "newsletter_signup",
  quizStarted: "quiz_started",
  quizAnswered: "quiz_answered",
  quizProgressReveal: "quiz_progress_reveal",
  quizCompleted: "quiz_completed",
  perfumerOpen: "perfumer_open",
  olfactoryNoteOpen: "olfactory_note_open",
  olfactoryConnectionClick: "olfactory_connection_click",
  similarPerfumeClick: "similar_perfume_click",
  pdpGalleryInteraction: "pdp_gallery_interaction",
  intentionDiscovery: "intention_discovery",
  discoveryProfileReset: "discovery_profile_reset",
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
