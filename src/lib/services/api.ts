import { supabase } from "$lib/supabaseClient";

export type Id = string | number;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

const TABLES = {
  events: "events",
  venues: "venues",
  users: "users",
  notifications: "notifications",
  registrations: "event_registrations",
};

const STORAGE_BUCKETS = {
  avatars: "avatars",
};

export const resolveApiImage = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!SUPABASE_URL) return path;
  if (path.startsWith("/")) return `${SUPABASE_URL}${path}`;
  return path;
};

const isMissingTable = (error: any) => {
  const message = String(error?.message ?? "");
  return error?.code === "42P01" || message.includes("does not exist");
};

const isNoRow = (error: any) => error?.code === "PGRST116";

const normalizeArray = (value: any): any[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return [value];
    }
  }
  return [value];
};

const toNumber = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const toIsoDate = (value?: string | null): string => {
  if (!value) return "";
  if (value.includes("T")) return value.slice(0, 10);
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return value;
};

const formatDateLabel = (value?: string | null): string => {
  const iso = toIsoDate(value ?? "");
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return value ?? "";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDateLabel = (value?: string | null): string => {
  const iso = toIsoDate(value ?? "");
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return value ?? "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatTimeRange = (start?: string | null, end?: string | null): string => {
  const formatTime = (time?: string | null) => {
    if (!time) return "";
    if (time.includes("T")) {
      const parsed = new Date(time);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
    const parts = time.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1] ?? 0);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startLabel = formatTime(start);
  const endLabel = formatTime(end);
  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  return startLabel || endLabel || "";
};

const computeRating = (comments: any[]): number => {
  if (!Array.isArray(comments) || comments.length === 0) return 0;
  const total = comments.reduce((sum, comment) => {
    return sum + toNumber(comment?.rating);
  }, 0);
  return Math.round((total / comments.length) * 10) / 10;
};

const parseAttendees = (attendees: any): number => {
  if (typeof attendees === "number") return attendees;
  if (typeof attendees === "string") {
    const match = attendees.match(/\d+/);
    if (match) return Number(match[0]);
  }
  return 0;
};

const indexById = (rows: any[]): Record<string, any> => {
  const index: Record<string, any> = {};
  rows.forEach((row) => {
    if (row?.id != null) {
      index[String(row.id)] = row;
    }
  });
  return index;
};

const buildFullName = (row: any): string => {
  if (!row) return "";
  if (row.full_name) return row.full_name;
  const parts = [row.first_name, row.last_name].filter(Boolean);
  return parts.join(" ").trim();
};

const mapEventRow = (
  row: any,
  venuesById: Record<string, any>,
  usersById: Record<string, any>,
): Event => {
  const venueId = row?.venue ?? row?.venue_id;
  const organizerId = row?.organizer ?? row?.organizer_id;

  const venue =
    row?.venue && typeof row.venue === "object"
      ? row.venue
      : venuesById[String(venueId ?? "")];
  const organizer =
    row?.organizer && typeof row.organizer === "object"
      ? row.organizer
      : usersById[String(organizerId ?? "")];

  const tags = normalizeArray(row?.tags);
  const highlights = normalizeArray(row?.highlights);
  const agenda = normalizeArray(row?.agenda);
  const speakers = normalizeArray(row?.speakers);
  const comments = normalizeArray(row?.comments);

  const dateIso = toIsoDate(row?.event_date ?? row?.date_iso ?? row?.date);
  const dateLabel = row?.date ?? formatDateLabel(dateIso || row?.event_date);
  const timeLabel = row?.time ?? formatTimeRange(row?.start_time, row?.end_time);

  const location =
    row?.location ??
    (venue
      ? [venue.city, venue.name].filter(Boolean).join(", ")
      : row?.location_override || "TBD");
  const address =
    row?.address ??
    (venue
      ? [venue.name, venue.address, venue.city].filter(Boolean).join(", ")
      : row?.address_override || "");

  const attendeesCount = toNumber(
    row?.attendees_count ??
      row?.registrations_count ??
      parseAttendees(row?.attendees),
  );
  const attendeesLabel =
    typeof row?.attendees === "string"
      ? row.attendees
      : `${attendeesCount} Attendees`;

  const organizerName =
    row?.organizer_name ||
    organizer?.organization_name ||
    buildFullName(organizer) ||
    "";

  const organizerImage =
    row?.organizerImage || organizer?.profile_image || "";

  const reviewsCount =
    typeof row?.reviews === "number"
      ? row.reviews
      : comments.length;

  const ratingValue =
    typeof row?.rating === "number" ? row.rating : computeRating(comments);

  return {
    id: row?.id,
    title: row?.title ?? "",
    date: dateLabel,
    date_iso: dateIso,
    time: timeLabel,
    location,
    address,
    size: row?.size ?? "",
    attendees: attendeesLabel,
    max_attendees: toNumber(row?.max_attendees),
    status: row?.status ?? "",
    image: row?.image ?? "",
    description: row?.description ?? "",
    organizer: organizerId ?? row?.organizer ?? null,
    organizer_name: organizerName,
    organizerImage,
    price: toNumber(row?.price),
    original_price: row?.original_price ?? null,
    category: row?.category ?? "General",
    tags,
    rating: ratingValue,
    reviews: reviewsCount,
    highlights,
    agenda,
    speakers,
    comments,
    venue_name: row?.venue_name ?? venue?.name ?? "",
  };
};

const mapUserToOrganizer = (row: any): Organizer => {
  const name = row?.organization_name || buildFullName(row) || "";
  return {
    id: row?.id,
    organization_name: row?.organization_name ?? "",
    first_name: row?.first_name ?? "",
    last_name: row?.last_name ?? "",
    email: row?.email ?? "",
    phone: row?.phone ?? "",
    profile_image: row?.profile_image ?? "",
    name,
    image: row?.profile_image ?? "",
  };
};

const mapUserToAttendee = (row: any): Attendee => {
  return {
    id: row?.id,
    first_name: row?.first_name ?? "",
    last_name: row?.last_name ?? "",
    name: buildFullName(row) || "User",
    email: row?.email ?? "",
    phone: row?.phone ?? "",
    company: row?.company ?? "Unknown",
    position: row?.position ?? "Attendee",
    status: row?.status ?? "confirmed",
    ticketType: row?.ticket_type ?? "Standard",
    checkedIn: Boolean(row?.checked_in),
    location: row?.location ?? "Unknown",
    avatar: resolveApiImage(row?.profile_image),
  };
};

const safeSelect = async (table: string, select = "*") => {
  const { data, error } = await supabase.from(table).select(select);
  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(error.message || `Failed to fetch ${table}`);
  }
  return data ?? [];
};

const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message || "Failed to load user");
  return data.user;
};

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const eventRevenue = (event: any): number => {
  const price = toNumber(event?.price);
  const attendeesCount = toNumber(
    event?.attendees_count ??
      event?.registrations_count ??
      parseAttendees(event?.attendees),
  );
  if (attendeesCount > 0) return price * attendeesCount;
  return price;
};

const eventDateIso = (event: any): string => {
  return toIsoDate(event?.date_iso ?? event?.event_date ?? event?.date);
};

// =======================
// Types
// =======================

export type Event = {
  id: Id;
  title: string;
  date: string;
  date_iso?: string;
  time: string;
  location: string;
  address: string;
  size: string;
  attendees: string;
  max_attendees: number;
  status: string;
  image: string;
  description: string;
  organizer: Id | null; // organizer ID
  organizer_name: string; // organizer display name
  organizerImage: string;
  price: number;
  original_price: number | null;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  highlights: string[];
  agenda: any[];
  speakers: any[];
  comments: any[];
  venue_name: string;
};

export type DashboardStats = {
  total_events: number;
  participants: number;
  revenue: number;
  growth: number;
  event_change: number;
  participant_change: number;
  revenue_change: number;
};

export type DashboardEvent = {
  id: Id;
  title: string;
  date: string;
  date_label: string;
  location: string;
  status: string;
  image: string;
  description: string;
  price: number;
  category: string;
  attendees: string;
  tags: string[];
};

export type DashboardSummary = {
  stats: DashboardStats;
  events: DashboardEvent[];
};

export type Venue = {
  id: Id;
  name: string;
  address: string;
  city: string;
  capacity: number;
  price_per_hour: number;
  venue_type: string;
  // Frontend props
  image?: string;
  rating?: number;
  upcomingEvents?: number;
  description?: string;
  type?: string; // mapped from venue_type
  pricePerHour?: number; // mapped from price_per_hour
  location?: string; // mapped from city/address
  status?: string; // added in frontend
};

export type Organizer = {
  id: Id;
  organization_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string;
  // Frontend props
  name?: string; // mapped from organization_name
  image?: string; // mapped from profile_image
  eventsCount?: number;
  rating?: number;
  bio?: string;
  location?: string;
  tags?: string[];
  featured?: boolean;
  contact?: { email: string; phone: string };
  socialMedia?: Record<string, string>;
};

export type Attendee = {
  id: Id;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  // Frontend props
  name?: string; // mapped from first_name + last_name
  company?: string;
  position?: string;
  status: string;
  ticketType: string;
  checkedIn: boolean;
  location?: string;
  avatar?: string;
};

export type ReportsAnalytics = {
  metrics: {
    total_revenue: { value: number; change: number };
    active_users: { value: number; change: number };
    events_hosted: { value: number; change: number };
    avg_engagement: { value: number; change: number };
  };
  monthly_revenue: number[];
  top_categories: { name: string; count: number; percent: number }[];
};

export type Notification = {
  id: Id;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  user?: Id | null;
  user_name?: string;
  data?: Record<string, any>;
};

export type CreateEventInput = {
  title: string;
  description?: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  venue?: Id | null;
  location_override?: string;
  address_override?: string;
  organizer: Id;
  image?: string;
  status?: string;
  category?: string;
  size?: string;
  price?: number;
  original_price?: number | null;
  highlights?: string[];
  tags?: string[];
  max_attendees?: number;
};

export type CreateVenueInput = {
  name: string;
  address: string;
  city: string;
  capacity: number;
  price_per_hour: number;
  venue_type: string;
};

export type CreateUserInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  organization_name?: string;
  profile_image?: string;
};

export type AuthResponse = {
  token: string;
  user: any;
};

// =======================
// Auth
// =======================

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || "Failed to get session");
  return data.session ?? null;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) {
    throw new Error(error?.message || "Invalid email or password");
  }
  return {
    token: data.session.access_token,
    user: data.user,
  };
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const name = input.name?.trim() || "";
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ").trim();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: name,
        first_name: firstName || "User",
        last_name: lastName || "User",
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to register");
  }

  if (!data.session) {
    throw new Error("Check your email to confirm your account.");
  }

  // Try to create/update profile row if the table exists
  const { error: profileError } = await supabase
    .from(TABLES.users)
    .upsert(
      {
        id: data.user?.id,
        email: input.email,
        first_name: firstName || "User",
        last_name: lastName || "User",
        organization_name: null,
      },
      { onConflict: "id" },
    );

  if (profileError && !isMissingTable(profileError)) {
    throw new Error(profileError.message || "Failed to create profile");
  }

  return {
    token: data.session.access_token,
    user: data.user,
  };
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Failed to logout");
  }
}

export async function fetchMe(): Promise<any> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  let profile: any = null;
  const { data, error } = await supabase
    .from(TABLES.users)
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && !isMissingTable(error) && !isNoRow(error)) {
    throw new Error(error.message || "Failed to load profile");
  }

  if (!error) profile = data;

  const metadata = user.user_metadata || {};

  const firstName = profile?.first_name ?? metadata.first_name ?? "";
  const lastName = profile?.last_name ?? metadata.last_name ?? "";
  const fullName =
    profile?.full_name ||
    metadata.full_name ||
    [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: user.id,
    email: user.email || profile?.email || metadata.email || "",
    created_at: user.created_at,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName || "User",
    phone: profile?.phone ?? metadata.phone ?? "",
    organization_name:
      profile?.organization_name ?? metadata.organization_name ?? "",
    profile_image: profile?.profile_image ?? metadata.profile_image ?? "",
  };
}

export async function uploadAvatar(file: File): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const safeName = file.name.replace(/\s+/g, "-");
  const filePath = `${user.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload avatar");
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .getPublicUrl(filePath);

  const publicUrl = data.publicUrl;

  const { error: authError } = await supabase.auth.updateUser({
    data: { profile_image: publicUrl },
  });

  if (authError) {
    throw new Error(authError.message || "Failed to update avatar");
  }

  const { error: profileError } = await supabase
    .from(TABLES.users)
    .upsert(
      {
        id: user.id,
        profile_image: publicUrl,
        email: user.email,
      },
      { onConflict: "id" },
    );

  if (profileError && !isMissingTable(profileError)) {
    throw new Error(profileError.message || "Failed to update avatar");
  }

  return publicUrl;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.email) throw new Error("Not authenticated");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message || "Failed to change password");
  }
}

// =======================
// Events
// =======================

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from(TABLES.events).select("*");
  if (error) {
    throw new Error(error.message || "Failed to fetch events");
  }

  const [venues, users] = await Promise.all([
    safeSelect(TABLES.venues),
    safeSelect(TABLES.users),
  ]);

  const venuesById = indexById(venues);
  const usersById = indexById(users);

  return (data ?? []).map((row) => mapEventRow(row, venuesById, usersById));
}

export async function fetchEventById(id: Id): Promise<Event> {
  const { data, error } = await supabase
    .from(TABLES.events)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message || "Failed to fetch event");
  }

  const [venue, organizer] = await Promise.all([
    data?.venue ? safeSelect(TABLES.venues).then((rows) => rows) : [],
    data?.organizer ? safeSelect(TABLES.users).then((rows) => rows) : [],
  ]);

  const venuesById = indexById(Array.isArray(venue) ? venue : []);
  const usersById = indexById(Array.isArray(organizer) ? organizer : []);

  return mapEventRow(data, venuesById, usersById);
}

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const { data: created, error } = await supabase
    .from(TABLES.events)
    .insert(data)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create event");
  }

  return fetchEventById(created.id);
}

export async function updateEvent(
  id: Id,
  data: Partial<CreateEventInput>,
): Promise<Event> {
  const { data: updated, error } = await supabase
    .from(TABLES.events)
    .update(data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update event");
  }

  return fetchEventById(updated.id);
}

export async function deleteEvent(id: Id): Promise<void> {
  const { error } = await supabase.from(TABLES.events).delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete event");
  }
}

// =======================
// Venues
// =======================

export async function fetchVenues(): Promise<Venue[]> {
  const { data, error } = await supabase.from(TABLES.venues).select("*");
  if (error) {
    throw new Error(error.message || "Failed to fetch venues");
  }
  return data ?? [];
}

export async function fetchVenueById(id: Id): Promise<Venue> {
  const { data, error } = await supabase
    .from(TABLES.venues)
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message || "Failed to fetch venue");
  }
  return data;
}

export async function createVenue(data: CreateVenueInput): Promise<Venue> {
  const { data: created, error } = await supabase
    .from(TABLES.venues)
    .insert(data)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message || "Failed to create venue");
  }
  return created;
}

export async function updateVenue(
  id: Id,
  data: Partial<CreateVenueInput>,
): Promise<Venue> {
  const { data: updated, error } = await supabase
    .from(TABLES.venues)
    .update(data)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message || "Failed to update venue");
  }
  return updated;
}

export async function deleteVenue(id: Id): Promise<void> {
  const { error } = await supabase.from(TABLES.venues).delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete venue");
  }
}

// =======================
// Users (Attendees/Organizers)
// =======================

export async function fetchOrganizers(): Promise<Organizer[]> {
  const users = await safeSelect(TABLES.users);
  return users.filter((u: any) => u.organization_name).map(mapUserToOrganizer);
}

export async function fetchAttendees(): Promise<Attendee[]> {
  const users = await safeSelect(TABLES.users);
  return users
    .filter((u: any) => !u.organization_name)
    .map(mapUserToAttendee);
}

export async function fetchUserById(id: Id): Promise<Attendee> {
  const { data, error } = await supabase
    .from(TABLES.users)
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (isMissingTable(error) || isNoRow(error)) {
      const me = await fetchMe();
      if (String(me.id) === String(id)) {
        return mapUserToAttendee(me);
      }
    }
    throw new Error(error.message || "Failed to fetch user");
  }
  return mapUserToAttendee(data);
}

export async function createUser(data: CreateUserInput): Promise<any> {
  const { data: created, error } = await supabase
    .from(TABLES.users)
    .insert(data)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message || "Failed to create user");
  }
  return created;
}

export async function updateUser(
  id: Id,
  data: Partial<CreateUserInput>,
): Promise<any> {
  const authUser = await getCurrentUser().catch(() => null);
  const isSelf = authUser && String(authUser.id) === String(id);

  if (isSelf) {
    const metaUpdates: Record<string, any> = {};
    if (data.first_name !== undefined) metaUpdates.first_name = data.first_name;
    if (data.last_name !== undefined) metaUpdates.last_name = data.last_name;
    if (data.organization_name !== undefined)
      metaUpdates.organization_name = data.organization_name;
    if (data.phone !== undefined) metaUpdates.phone = data.phone;
    if (data.profile_image !== undefined)
      metaUpdates.profile_image = data.profile_image;

    if (Object.keys(metaUpdates).length > 0) {
      const fullName =
        metaUpdates.first_name || metaUpdates.last_name
          ? [metaUpdates.first_name || "", metaUpdates.last_name || ""]
              .filter(Boolean)
              .join(" ")
              .trim()
          : undefined;
      if (fullName) metaUpdates.full_name = fullName;
    }

    if (data.email || Object.keys(metaUpdates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser({
        email: data.email,
        data: Object.keys(metaUpdates).length ? metaUpdates : undefined,
      });
      if (authError) {
        throw new Error(authError.message || "Failed to update profile");
      }
    }
  }

  const { data: updated, error } = await supabase
    .from(TABLES.users)
    .upsert({ id, ...data }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    if (isMissingTable(error) && isSelf) {
      return fetchMe();
    }
    throw new Error(error.message || "Failed to update user");
  }

  return updated;
}

export async function deleteUser(id: Id): Promise<void> {
  const { error } = await supabase.from(TABLES.users).delete().eq("id", id);
  if (error && !isMissingTable(error)) {
    throw new Error(error.message || "Failed to delete user");
  }
}

// Organizer aliases
export const fetchOrganizerById = fetchUserById;
export const createOrganizer = createUser;
export const updateOrganizer = updateUser;
export const deleteOrganizer = deleteUser;

// =======================
// Notifications
// =======================

export async function fetchNotifications(
  userId?: Id | null,
): Promise<Notification[]> {
  let query = supabase.from(TABLES.notifications).select("*");
  if (userId) query = query.eq("user", userId);
  const { data, error } = await query.order("created_at", {
    ascending: false,
  });
  if (error) {
    throw new Error(error.message || "Failed to fetch notifications");
  }
  return data ?? [];
}

export async function markNotificationRead(
  id: Id,
  read = true,
): Promise<Notification> {
  const { data, error } = await supabase
    .from(TABLES.notifications)
    .update({ read })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message || "Failed to update notification");
  }
  return data;
}

export async function deleteNotification(id: Id): Promise<void> {
  const { error } = await supabase
    .from(TABLES.notifications)
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete notification");
  }
}

export async function markAllNotificationsRead(
  userId?: Id | null,
): Promise<number> {
  let query = supabase.from(TABLES.notifications).update({ read: true });
  if (userId) query = query.eq("user", userId);
  const { data, error } = await query.select("id");
  if (error) {
    throw new Error(error.message || "Failed to mark notifications as read");
  }
  return data?.length || 0;
}

export async function clearAllNotifications(
  userId?: Id | null,
): Promise<number> {
  let countQuery = supabase
    .from(TABLES.notifications)
    .select("id", { count: "exact", head: true });
  if (userId) countQuery = countQuery.eq("user", userId);
  const { count, error: countError } = await countQuery;
  if (countError) {
    throw new Error(countError.message || "Failed to count notifications");
  }

  let deleteQuery = supabase.from(TABLES.notifications).delete();
  if (userId) deleteQuery = deleteQuery.eq("user", userId);
  const { error } = await deleteQuery;
  if (error) {
    throw new Error(error.message || "Failed to clear notifications");
  }
  return count || 0;
}

// =======================
// Dashboard & Reports
// =======================

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const events = await fetchEvents();

  const totalEvents = events.length;
  const participants = events.reduce((sum, event) => {
    return sum + parseAttendees(event.attendees);
  }, 0);

  const revenue = events.reduce((sum, event) => sum + eventRevenue(event), 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentEvents = events.filter((event) => {
    const iso = eventDateIso(event);
    if (!iso) return false;
    const date = new Date(iso);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const previousEvents = events.filter((event) => {
    const iso = eventDateIso(event);
    if (!iso) return false;
    const date = new Date(iso);
    return (
      date.getFullYear() === previousYear && date.getMonth() === previousMonth
    );
  });

  const currentRevenue = currentEvents.reduce(
    (sum, event) => sum + eventRevenue(event),
    0,
  );
  const previousRevenue = previousEvents.reduce(
    (sum, event) => sum + eventRevenue(event),
    0,
  );

  const currentParticipants = currentEvents.reduce(
    (sum, event) => sum + parseAttendees(event.attendees),
    0,
  );
  const previousParticipants = previousEvents.reduce(
    (sum, event) => sum + parseAttendees(event.attendees),
    0,
  );

  const eventChange = calculateChange(currentEvents.length, previousEvents.length);
  const participantChange = calculateChange(
    currentParticipants,
    previousParticipants,
  );
  const revenueChange = calculateChange(currentRevenue, previousRevenue);

  const dashboardEvents: DashboardEvent[] = events.map((event) => {
    const isoDate = event.date_iso || eventDateIso(event);
    return {
      id: event.id,
      title: event.title,
      date: isoDate,
      date_label: formatShortDateLabel(isoDate),
      location: event.location,
      status: event.status,
      image: event.image,
      description: event.description,
      price: event.price,
      category: event.category,
      attendees: event.attendees,
      tags: event.tags || [],
    };
  });

  return {
    stats: {
      total_events: totalEvents,
      participants,
      revenue,
      growth: revenueChange,
      event_change: eventChange,
      participant_change: participantChange,
      revenue_change: revenueChange,
    },
    events: dashboardEvents,
  };
}

export async function fetchReportsAnalytics(): Promise<ReportsAnalytics> {
  const events = await fetchEvents();
  const users = await safeSelect(TABLES.users);

  const totalRevenue = events.reduce(
    (sum, event) => sum + eventRevenue(event),
    0,
  );
  const totalEvents = events.length;
  const totalParticipants = events.reduce(
    (sum, event) => sum + parseAttendees(event.attendees),
    0,
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const monthlyRevenue = Array.from({ length: 12 }, () => 0);
  events.forEach((event) => {
    const iso = eventDateIso(event);
    if (!iso) return;
    const date = new Date(iso);
    if (date.getFullYear() !== currentYear) return;
    monthlyRevenue[date.getMonth()] += eventRevenue(event);
  });

  const currentEvents = events.filter((event) => {
    const iso = eventDateIso(event);
    if (!iso) return false;
    const date = new Date(iso);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const previousEvents = events.filter((event) => {
    const iso = eventDateIso(event);
    if (!iso) return false;
    const date = new Date(iso);
    return (
      date.getFullYear() === previousYear && date.getMonth() === previousMonth
    );
  });

  const currentRevenue = currentEvents.reduce(
    (sum, event) => sum + eventRevenue(event),
    0,
  );
  const previousRevenue = previousEvents.reduce(
    (sum, event) => sum + eventRevenue(event),
    0,
  );

  const currentParticipants = currentEvents.reduce(
    (sum, event) => sum + parseAttendees(event.attendees),
    0,
  );
  const previousParticipants = previousEvents.reduce(
    (sum, event) => sum + parseAttendees(event.attendees),
    0,
  );

  const engagementValues = events
    .map((event) => {
      const maxAttendees = toNumber(event.max_attendees);
      if (maxAttendees <= 0) return null;
      const attendees = parseAttendees(event.attendees);
      return (attendees / maxAttendees) * 100;
    })
    .filter((value) => value != null) as number[];

  const averageEngagement = engagementValues.length
    ? engagementValues.reduce((sum, value) => sum + value, 0) /
      engagementValues.length
    : 0;

  const currentEngagement = currentEvents
    .map((event) => {
      const maxAttendees = toNumber(event.max_attendees);
      if (maxAttendees <= 0) return null;
      const attendees = parseAttendees(event.attendees);
      return (attendees / maxAttendees) * 100;
    })
    .filter((value) => value != null) as number[];

  const previousEngagement = previousEvents
    .map((event) => {
      const maxAttendees = toNumber(event.max_attendees);
      if (maxAttendees <= 0) return null;
      const attendees = parseAttendees(event.attendees);
      return (attendees / maxAttendees) * 100;
    })
    .filter((value) => value != null) as number[];

  const currentEngagementAvg = currentEngagement.length
    ? currentEngagement.reduce((sum, value) => sum + value, 0) /
      currentEngagement.length
    : 0;

  const previousEngagementAvg = previousEngagement.length
    ? previousEngagement.reduce((sum, value) => sum + value, 0) /
      previousEngagement.length
    : 0;

  const categoryCounts: Record<string, number> = {};
  events.forEach((event) => {
    const category = event.category || "General";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: totalEvents ? (count / totalEvents) * 100 : 0,
    }));

  return {
    metrics: {
      total_revenue: {
        value: totalRevenue,
        change: calculateChange(currentRevenue, previousRevenue),
      },
      active_users: {
        value: users.length || totalParticipants,
        change: calculateChange(currentParticipants, previousParticipants),
      },
      events_hosted: {
        value: totalEvents,
        change: calculateChange(currentEvents.length, previousEvents.length),
      },
      avg_engagement: {
        value: averageEngagement,
        change: calculateChange(currentEngagementAvg, previousEngagementAvg),
      },
    },
    monthly_revenue: monthlyRevenue,
    top_categories: topCategories,
  };
}
