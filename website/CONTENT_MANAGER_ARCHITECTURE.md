# Content Manager Architecture Blueprint

## Overview

A lightweight, independent admin panel for managing KRISM content. No database, no external CMS libraries. Pure TypeScript + Astro + plain file operations.

The system is split into three independent concerns:
1. **Authentication & Authorization** (login gate + role checks)
2. **Content Registry** (section metadata + schema definitions)
3. **Content Operations** (CRUD handler + form renderer)

---

## 1. Directory Structure

```
website/
├── src/
│   ├── admin/                          # Admin system (independent from public site)
│   │   ├── types.ts                    # Type definitions for content system
│   │   ├── registry.ts                 # Section metadata + schema config
│   │   ├── store.ts                    # Read/write operations on data files
│   │   ├── auth.ts                     # Session and credential validation
│   │   └── validator.ts                # Input validation & field type handling
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── login.astro             # Login page (public)
│   │   │   ├── content-manager.astro   # Main admin panel (protected)
│   │   │   └── logout.ts               # Logout endpoint
│   │   │
│   │   └── api/
│   │       └── admin/
│   │           ├── auth/
│   │           │   ├── login.ts        # POST: authenticate user
│   │           │   └── logout.ts       # POST: clear session
│   │           │
│   │           └── content/
│   │               ├── list.ts         # GET: list items in section
│   │               ├── get.ts          # GET: single item by slug
│   │               ├── create.ts       # POST: add new item
│   │               ├── update.ts       # PUT: update item
│   │               └── delete.ts       # DELETE: remove item
│   │
│   ├── components/
│   │   └── admin/
│   │       ├── AdminHeader.astro       # Admin panel header
│   │       ├── SectionBrowser.astro    # Left sidebar (section list)
│   │       ├── ItemList.astro          # Center (items table)
│   │       └── ContentForm.astro       # Right (dynamic editor form)
│   │
│   └── data/
│       ├── events.ts
│       ├── research.ts
│       ├── awareness.ts
│       ├── resources.ts
│       └── network.ts                  # Existing data files (unchanged)
│
└── .env.example                        # Sample environment variables
```

---

## 2. Authentication & Authorization

### Simple Credential Model

File: `website/src/admin/auth.ts`

```typescript
// Credentials stored in environment variables
// ADMIN_USERNAME=admin ADMIN_PASSWORD=secretpassword node run build

interface User {
  username: string;
  role: "admin" | "editor" | "viewer";
}

interface Session {
  user: User;
  expiresAt: number;
}

// Validate login credentials
function validateCredentials(username: string, password: string): User | null {
  // Check against hardcoded credentials from env
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return { username, role: "admin" };
  }
  return null;
}

// Create session cookie
function createSessionCookie(user: User): string {
  const session: Session = {
    user,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(session));
}

// Verify session from cookie
function verifySession(cookieValue: string): User | null {
  try {
    const session: Session = JSON.parse(atob(cookieValue));
    if (session.expiresAt > Date.now()) {
      return session.user;
    }
  } catch {
    return null;
  }
  return null;
}

// Check if user has permission for action
function checkPermission(role: string, action: "read" | "write" | "delete"): boolean {
  const permissions = {
    admin: ["read", "write", "delete"],
    editor: ["read", "write"],
    viewer: ["read"],
  };
  return permissions[role]?.includes(action) ?? false;
}
```

### Login Flow

1. User visits `/admin/login`
2. Enters credentials
3. POST to `/api/admin/auth/login`
4. Server validates against `ADMIN_USERNAME` + `ADMIN_PASSWORD`
5. If valid, set `admin_session` cookie
6. Redirect to `/admin/content-manager`
7. Protected routes check cookie on each request

### Session Cookie Check Pattern

```typescript
// In protected pages/routes
function getSession(cookies: AstroCookies): User | null {
  const sessionCookie = cookies.get("admin_session")?.value;
  if (!sessionCookie) return null;
  return verifySession(sessionCookie);
}

// Usage in page
const user = getSession(Astro.cookies);
if (!user) {
  return Astro.redirect("/admin/login");
}
```

---

## 3. Content Registry (Schema-Driven)

File: `website/src/admin/registry.ts`

Each section is defined with:
- **id**: unique identifier
- **label**: display name
- **filePath**: where the data lives
- **exportName**: name exported from the file
- **schema**: field definitions for the form renderer

```typescript
export type FieldType =
  | "text"
  | "textarea"
  | "boolean"
  | "select"
  | "date"
  | "email"
  | "url"
  | "array";

export interface SchemaField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select fields
  itemType?: FieldType; // for array fields
  helpText?: string;
  default?: any;
}

export interface ContentSection {
  id: string;
  label: string;
  filePath: string;
  exportName: string;
  schema: SchemaField[];
  slug?: {
    sourceField: string; // which field to generate slug from
    autoGenerate: boolean;
  };
}

export const sections: ContentSection[] = [
  {
    id: "events",
    label: "Events",
    filePath: "src/data/events.ts",
    exportName: "events",
    slug: { sourceField: "title", autoGenerate: true },
    schema: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: false },
      { name: "location", label: "Location", type: "text", required: true },
      {
        name: "type",
        label: "Event Type",
        type: "select",
        required: true,
        options: ["Scientific Meeting", "Educational Workshop", "Webinar"],
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "featured",
        label: "Featured on Home",
        type: "boolean",
        required: false,
        default: false,
      },
      {
        name: "registrationOpen",
        label: "Registration Open",
        type: "boolean",
        required: false,
        default: false,
      },
      {
        name: "registrationUrl",
        label: "Registration URL",
        type: "url",
        required: false,
      },
    ],
  },

  {
    id: "research",
    label: "Research",
    filePath: "src/data/research.ts",
    exportName: "researchProjects",
    slug: { sourceField: "title", autoGenerate: true },
    schema: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "type",
        label: "Research Type",
        type: "select",
        required: true,
        options: ["Study", "Collaboration", "Publication"],
      },
      {
        name: "collaborators",
        label: "Collaborators",
        type: "array",
        itemType: "text",
        required: false,
      },
      {
        name: "featured",
        label: "Featured",
        type: "boolean",
        required: false,
        default: false,
      },
      {
        name: "registrationOpen",
        label: "Registration Open",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
  },

  {
    id: "awareness",
    label: "Sleep Awareness",
    filePath: "src/data/awareness.ts",
    exportName: "awarenessArticles",
    slug: { sourceField: "title", autoGenerate: true },
    schema: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Sleep Health", "Sleep Disorders", "Healthy Sleep"],
      },
      {
        name: "content",
        label: "Content Paragraphs",
        type: "array",
        itemType: "textarea",
        required: true,
      },
      {
        name: "featured",
        label: "Featured",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
  },

  {
    id: "resources",
    label: "Resources",
    filePath: "src/data/resources.ts",
    exportName: "resources",
    slug: { sourceField: "title", autoGenerate: true },
    schema: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Guideline", "Educational", "Clinical", "Research", "Public", "External"],
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "url", label: "URL", type: "url", required: false },
      {
        name: "featured",
        label: "Featured",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
  },

  {
    id: "network",
    label: "Network Members",
    filePath: "src/data/network.ts",
    exportName: "networkMembers",
    slug: { sourceField: "name", autoGenerate: true },
    schema: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "type",
        label: "Member Type",
        type: "select",
        required: true,
        options: ["Professional", "Researcher", "Organization", "Institution"],
      },
      {
        name: "specialty",
        label: "Specialty",
        type: "text",
        required: false,
      },
      { name: "affiliation", label: "Affiliation", type: "text", required: false },
      { name: "city", label: "City", type: "text", required: false },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "website", label: "Website", type: "url", required: false },
      {
        name: "featured",
        label: "Featured",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
  },
];

export function getSection(id: string): ContentSection | undefined {
  return sections.find((s) => s.id === id);
}
```

---

## 4. Content Store (Independent CRUD)

File: `website/src/admin/store.ts`

Handles all read/write operations on the TypeScript data files.

```typescript
import type { ContentSection, SchemaField } from "./registry";
import { sections, getSection } from "./registry";

export interface StoreResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ContentStore {
  /**
   * List all items in a section
   */
  static async list(sectionId: string): Promise<StoreResult<any[]>> {
    const section = getSection(sectionId);
    if (!section) {
      return { success: false, error: "Section not found" };
    }

    try {
      // Dynamically import the data file
      const module = await import(`../data/${section.id}.ts`);
      const data = module[section.exportName] || [];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to load section: ${error.message}` };
    }
  }

  /**
   * Get a single item by slug
   */
  static async get(sectionId: string, slug: string): Promise<StoreResult<any>> {
    const listResult = await this.list(sectionId);
    if (!listResult.success) {
      return listResult;
    }

    const item = listResult.data.find((i) => i.slug === slug);
    if (!item) {
      return { success: false, error: "Item not found" };
    }

    return { success: true, data: item };
  }

  /**
   * Create a new item (validate schema, generate slug if needed)
   */
  static async create(sectionId: string, input: any): Promise<StoreResult<any>> {
    const section = getSection(sectionId);
    if (!section) {
      return { success: false, error: "Section not found" };
    }

    // Validate input against schema
    const validation = this.validateInput(input, section.schema);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Auto-generate slug if configured
    if (section.slug?.autoGenerate && !input.slug && input[section.slug.sourceField]) {
      input.slug = this.generateSlug(input[section.slug.sourceField]);
    }

    // Get current items
    const listResult = await this.list(sectionId);
    if (!listResult.success) {
      return listResult;
    }

    // Check for duplicate slug
    if (listResult.data.some((item) => item.slug === input.slug)) {
      return { success: false, error: `Slug "${input.slug}" already exists` };
    }

    // Add new item
    const newItem = this.applyDefaults(input, section.schema);
    listResult.data.push(newItem);

    // Save back to file
    return await this.saveToFile(sectionId, listResult.data, newItem);
  }

  /**
   * Update an existing item
   */
  static async update(sectionId: string, slug: string, input: any): Promise<StoreResult<any>> {
    const section = getSection(sectionId);
    if (!section) {
      return { success: false, error: "Section not found" };
    }

    // Validate input
    const validation = this.validateInput(input, section.schema);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Get current items
    const listResult = await this.list(sectionId);
    if (!listResult.success) {
      return listResult;
    }

    // Find and update item
    const index = listResult.data.findIndex((i) => i.slug === slug);
    if (index === -1) {
      return { success: false, error: "Item not found" };
    }

    // Merge updates (preserve unchanged fields)
    const updatedItem = { ...listResult.data[index], ...input };
    listResult.data[index] = updatedItem;

    // Save back to file
    return await this.saveToFile(sectionId, listResult.data, updatedItem);
  }

  /**
   * Delete an item
   */
  static async delete(sectionId: string, slug: string): Promise<StoreResult<null>> {
    const section = getSection(sectionId);
    if (!section) {
      return { success: false, error: "Section not found" };
    }

    // Get current items
    const listResult = await this.list(sectionId);
    if (!listResult.success) {
      return listResult;
    }

    // Remove item
    const filtered = listResult.data.filter((i) => i.slug !== slug);
    if (filtered.length === listResult.data.length) {
      return { success: false, error: "Item not found" };
    }

    // Save back to file
    return await this.saveToFile(sectionId, filtered, null);
  }

  /**
   * Validate input against schema
   */
  private static validateInput(
    input: any,
    schema: SchemaField[]
  ): { valid: boolean; error?: string } {
    for (const field of schema) {
      if (field.required && (input[field.name] === undefined || input[field.name] === null || input[field.name] === "")) {
        return { valid: false, error: `Field "${field.label}" is required` };
      }

      if (input[field.name] !== undefined) {
        if (field.type === "email" && !this.isValidEmail(input[field.name])) {
          return { valid: false, error: `Field "${field.label}" must be a valid email` };
        }

        if (field.type === "url" && input[field.name] && !this.isValidUrl(input[field.name])) {
          return { valid: false, error: `Field "${field.label}" must be a valid URL` };
        }

        if (field.type === "date" && !this.isValidDate(input[field.name])) {
          return { valid: false, error: `Field "${field.label}" must be a valid date` };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Generate URL-safe slug
   */
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /**
   * Apply schema defaults to new item
   */
  private static applyDefaults(input: any, schema: SchemaField[]): any {
    const result = { ...input };
    for (const field of schema) {
      if (field.default !== undefined && result[field.name] === undefined) {
        result[field.name] = field.default;
      }
    }
    return result;
  }

  /**
   * Save data array back to file (in proper TypeScript format)
   */
  private static async saveToFile(
    sectionId: string,
    data: any[],
    updatedItem: any
  ): Promise<StoreResult<any>> {
    try {
      // This would be implemented in a server API route using Node fs
      // For now, return placeholder result
      return { success: true, data: updatedItem };
    } catch (error) {
      return { success: false, error: `Failed to save: ${error.message}` };
    }
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidDate(date: string): boolean {
    return !isNaN(new Date(date).getTime());
  }
}
```

---

## 5. Types & Interfaces

File: `website/src/admin/types.ts`

```typescript
export interface User {
  username: string;
  role: "admin" | "editor" | "viewer";
}

export interface ContentItem {
  slug: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
  submitError?: string;
}
```

---

## 6. Page Flow

### `/admin/login` (Public)
- Simple credential form
- POST to `/api/admin/auth/login`
- If valid: set cookie, redirect to `/admin/content-manager`
- If invalid: show error

### `/admin/content-manager` (Protected)
- Check session cookie
- If not logged in: redirect to `/admin/login`
- If logged in:
  - **Left panel**: Section browser (clickable list)
  - **Center panel**: Item list (table with search, add, edit, delete)
  - **Right panel**: Content form (dynamic schema-based editor)

### API Routes (Protected)
- `/api/admin/auth/login` — POST: validate credentials
- `/api/admin/auth/logout` — POST: clear session
- `/api/admin/content/list?section=events` — GET: list items
- `/api/admin/content/get?section=events&slug=xyz` — GET: single item
- `/api/admin/content/create` — POST: add item
- `/api/admin/content/update` — PUT: update item
- `/api/admin/content/delete` — DELETE: remove item

---

## 7. Security & Constraints

### Authentication
- Single username/password pair (from environment variables)
- All users get same role (simplest model)
- Cookie-based session with 7-day expiry
- No CSRF tokens needed (only internal tool)

### Authorization
- Only `/admin/*` routes require session
- All API routes check session before processing
- Public site pages unchanged

### File Operations
- Only read/write via dedicated CRUD handlers
- Schema validation on all inputs
- No direct file access from client

### Environment Variables

```bash
# .env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

---

## 8. Minimal Implementation Order

1. **Phase 1: Auth System**
   - `src/admin/auth.ts` (credential validation + sessions)
   - `src/pages/admin/login.astro` (login form)
   - `src/pages/api/admin/auth/login.ts` (POST handler)
   - Route guard middleware

2. **Phase 2: Registry & Store**
   - `src/admin/registry.ts` (section definitions)
   - `src/admin/store.ts` (CRUD operations)
   - `src/admin/validator.ts` (input validation)

3. **Phase 3: API Routes**
   - `src/pages/api/admin/content/*` (list, get, create, update, delete)

4. **Phase 4: UI Components**
   - `src/components/admin/SectionBrowser.astro`
   - `src/components/admin/ItemList.astro`
   - `src/components/admin/ContentForm.astro`

5. **Phase 5: Main Page**
   - `src/pages/admin/content-manager.astro` (layout + orchestration)

---

## 9. Key Design Principles

✅ **Independent**: Admin system isolated from public site  
✅ **Schema-Driven**: One form renderer for all sections  
✅ **No Database**: Direct TypeScript file management  
✅ **Simple Auth**: Single credential pair, cookie-based  
✅ **Type-Safe**: Full TypeScript for operations  
✅ **Extensible**: Add new sections via registry only  
✅ **Stateless**: No background jobs or caching complexity  

---

## 10. Example Workflow

1. Admin visits `https://krisms.ir/admin/login`
2. Enters username/password
3. System validates against `ADMIN_USERNAME` / `ADMIN_PASSWORD`
4. Creates session cookie
5. Redirects to `/admin/content-manager`
6. Left sidebar shows:
   - Events (5 items)
   - Research (3 items)
   - Awareness (4 items)
   - Resources (8 items)
   - Network (12 items)
7. Admin clicks "Events"
8. Center panel shows event list with search/add button
9. Admin clicks an event to edit
10. Right panel loads the event data into a dynamic form based on Events schema
11. Admin modifies fields and clicks "Save"
12. POST to `/api/admin/content/update` with updated data
13. Server validates, updates file, returns success
14. Form reflects the save

---

This blueprint is ready for implementation. Each file has a clear responsibility, and the system is self-contained.

Would you like me to proceed to code implementation, starting with Phase 1 (Auth System)?
