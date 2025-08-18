
// This is a supplementary type definition file to extend the generated types
// The main types file is not directly editable

import type { Database as GeneratedDatabase } from './types';

// Extend with custom types
export type Database = GeneratedDatabase;

// Extract specific types for easier usage
export type LocationUpdate = Database['public']['Tables']['location_updates']['Row'];
export type TrackingSession = Database['public']['Tables']['tracking_sessions']['Row'];
export type LocationPermission = Database['public']['Tables']['location_permissions']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];
export type Professional = Database['public']['Tables']['professionals']['Row'];
export type ProfessionalService = Database['public']['Tables']['professional_services']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];

// Enum types
export type UserType = 'PROVIDER' | 'CUSTOMER';
export type TrackingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PermissionStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';
