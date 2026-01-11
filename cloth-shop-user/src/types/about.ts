// About Page Content
export interface AboutPageContent {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string | null;
  missionTitle: string;
  missionText: string | null;
  visionTitle: string;
  visionText: string | null;
  valuesTitle: string;
  valuesText: string | null;
  storyTitle: string;
  storyParagraph1: string | null;
  storyParagraph2: string | null;
  storyImageUrl: string | null;
  stats: {
    clients: string;
    collections: string;
    quality: string;
  };
  features: AboutFeature[];
  updatedAt: string;
}

export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface UpdateAboutData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
  valuesTitle?: string;
  valuesText?: string;
  storyTitle?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyImageUrl?: string;
  stats?: {
    clients: string;
    collections: string;
    quality: string;
  };
  features?: AboutFeature[];
}
