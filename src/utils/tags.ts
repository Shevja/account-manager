import type {Tag} from "@/models/accounts.ts";

export function parseTags(tags: string): Tag[] {
    return tags
        .split(';')
        .map(tag => ({text: tag.trim()}))
        .filter(tag => !!tag.text)
}

export function stringifyTags(tags: Tag[]): string {
    return tags.map(t => t.text).join('; ')
}