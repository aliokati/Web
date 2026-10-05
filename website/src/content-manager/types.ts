export type Role = "admin" | "editor" | "viewer";
export type PublishStatus = "draft" | "review" | "published" | "archived";
export type FieldType = "text" | "textarea" | "date" | "select" | "boolean" | "array" | "number" | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
  default?: unknown;
  pattern?: string;
  help?: string;
  /** The field can be overridden per language. English remains the source value. */
  localized?: boolean;
}

export interface SectionConfig {
  id: string;
  label: string;
  description: string;
  fileName: string;
  primaryKey: string;
  titleField: string;
  roles: Role[];
  fields: FieldConfig[];
}

export interface SessionUser {
  username: string;
  role: Role;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export interface ValidationResult {
  valid: boolean;
  data: Record<string, unknown>;
  errors: Record<string, string>;
}

export interface PublishingMetadata {
  status: PublishStatus;
  translationStatus?: PublishStatus;
  publishedAt?: string;
  reviewedAt?: string;
  reviewer?: string;
}
