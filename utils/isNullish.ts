/**
 * Check if a value is null, undefined, or the string "null".
 *
 * Nuxt Content's SQLite / queryCollection layer sometimes serialises
 * `null` YAML values to the string `"null"`.  This helper provides a
 * single source of truth so every call-site handles the quirk the
 * same way.
 */
export function isNullish(value: unknown): value is null | undefined {
  return value == null || value === 'null'
}
