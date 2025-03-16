export interface Organization {
    id: string
    name: string
    slug: string
    logo?: string | null
    metadata?: Record<string, string> | null
    createdAt: Date
}
