export interface TodoItem {
  id: string                    // Unique identifier (UUID or timestamp-based)
  description: string          // Task description (required, non-empty)
  priority: number             // Priority 1-5 (required, default: 3)
  dueDate: string | null       // ISO date string YYYY-MM-DD or null (optional)
  createdAt: string            // ISO timestamp of creation (required, immutable)
}