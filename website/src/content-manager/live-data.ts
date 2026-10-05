import { readSectionSync } from "./store";

type ManagedRecord = Record<string, unknown> & { status?: string; translationStatus?: string };

function published(sectionId: string): ManagedRecord[] {
  return readSectionSync<ManagedRecord>(sectionId).filter((item) => item.status === "published");
}

export function createLiveCollection<T>(sectionId: string): T[] {
  return new Proxy([] as T[], {
    get(_target, property) {
      const current = published(sectionId) as T[];
      const value = Reflect.get(current, property);
      return typeof value === "function" ? value.bind(current) : value;
    },
  });
}

export function createLocalizedCollection<T>(sectionId: string, locale: string): T[] {
  return new Proxy([] as T[], {
    get(_target, property) {
      const current = published(sectionId).filter((item) => item.translationStatus === "published").map((item) => {
        const translations = item.translations as Record<string, Record<string, unknown>> | undefined;
        return { ...item, ...(translations?.[locale] ?? {}) } as T;
      });
      const value = Reflect.get(current, property);
      return typeof value === "function" ? value.bind(current) : value;
    },
  });
}
