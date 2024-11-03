
// If the string is empty, return null. This is useful as Postgres stores empty strings as a blank string and not null
export function toNullableString(str: string): string | null {
    return (str) ? str : null;
}