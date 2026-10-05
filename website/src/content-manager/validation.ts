import { getSection } from "./registry";
import type { FieldConfig, ValidationResult } from "./types";

function normalize(field: FieldConfig, value: unknown): unknown {
  if (field.type === "boolean") return value === true || value === "true" || value === "on";
  if (field.type === "number") return value === "" || value == null ? undefined : Number(value);
  if (field.type === "array") {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    return String(value ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
  if (value == null) return undefined;
  const text = String(value).trim();
  return text === "" ? undefined : text;
}

export function validateItem(sectionId: string, input: unknown): ValidationResult {
  const section = getSection(sectionId);
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of section.fields) {
    const value = normalize(field, source[field.name] ?? field.default);
    if (field.required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (value === undefined) continue;
    if (field.type === "number" && (!Number.isFinite(value) || Number(value) < 0)) errors[field.name] = `${field.label} must be a valid number.`;
    if (field.pattern && typeof value === "string" && !new RegExp(field.pattern).test(value)) errors[field.name] = `${field.label} has an invalid format.`;
    if (field.options && !field.options.includes(String(value))) errors[field.name] = `Choose a valid ${field.label.toLowerCase()}.`;
    if (field.type === "url" && typeof value === "string") {
      try { const url = new URL(value); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
      catch { errors[field.name] = `${field.label} must be an http or https URL.`; }
    }
    data[field.name] = value;
  }

  const translations = source.translations && typeof source.translations === "object" && !Array.isArray(source.translations)
    ? source.translations as Record<string, unknown>
    : {};
  const persian = translations.fa && typeof translations.fa === "object" && !Array.isArray(translations.fa)
    ? translations.fa as Record<string, unknown>
    : {};
  const normalizedPersian: Record<string, unknown> = {};

  for (const field of section.fields.filter((candidate) => candidate.localized)) {
    const value = normalize(field, persian[field.name]);
    if (value !== undefined) normalizedPersian[field.name] = value;
  }
  if (data.translationStatus === "published") {
    for (const field of section.fields.filter((candidate) => candidate.localized && candidate.required)) {
      const value = normalizedPersian[field.name];
      if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        errors[`fa.${field.name}`] = `${field.label} requires a Persian translation before publishing.`;
      }
    }
  }
  if (sectionId === "network" && data.status === "published" && data.publicConsent !== true) {
    errors.publicConsent = "Public directory approval is required before publishing a profile.";
  }
  if (sectionId === "board" && data.status === "published" && data.profileConsent !== true) {
    errors.profileConsent = "Documented profile approval is required before publishing a board member.";
  }
  if (sectionId === "events" && data.status === "published" && data.registrationOpen === true && data.registrationMode === "external" && !data.registrationUrl) {
    errors.registrationUrl = "An external registration URL is required for external registration.";
  }
  if (sectionId === "events" && data.endDate && data.date && String(data.endDate) < String(data.date)) {
    errors.endDate = "End date cannot be before the start date.";
  }
  if (Object.keys(normalizedPersian).length > 0) data.translations = { fa: normalizedPersian };
  return { valid: Object.keys(errors).length === 0, data, errors };
}

export function blankItem(sectionId: string): Record<string, unknown> {
  const section = getSection(sectionId);
  return Object.fromEntries(section.fields.map((field) => [field.name, field.default ?? (field.type === "boolean" ? false : field.type === "array" ? [] : "")]));
}
