// Contact Inquiry
export interface ContactInquiry {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateInquiryData {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

// Contact Settings
export interface ContactSettings {
  id: number;
  phone: string;
  phoneHours: string;
  email: string;
  address: string;
  workingHours: string;
  mapImageUrl: string | null;
  googleMapsLink: string | null;
  updatedAt: string;
}

export interface InquiryStats {
  totalInquiries: number;
  unreadInquiries: number;
  readInquiries: number;
  recentInquiries: ContactInquiry[];
}

export interface InquiryFilters {
  page: number;
  limit: number;
  search: string;
  isRead: string;
  startDate: string;
  endDate: string;
  sort: "newest" | "oldest" | "name-asc" | "name-desc";
}
