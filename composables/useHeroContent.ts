import { computed, unref } from 'vue'
import type { MaybeRef } from 'vue'
import type { CcmHeroContent } from '~/types/hero'

export const useHeroContent = (
  hero?: MaybeRef<CcmHeroContent | null | undefined>,
  fallback?: MaybeRef<CcmHeroContent | null | undefined>
) => {
  const route = useRoute()
  const sharedHero = useState<CcmHeroContent | null>('hero', () => null)

  return computed<CcmHeroContent | null>(() => {
    const explicitHero = hero ? unref(hero) : null
    if (explicitHero) { return explicitHero }

    const metaHero = route.meta?.hero as CcmHeroContent | null | undefined
    if (metaHero) { return metaHero }

    if (sharedHero.value) { return sharedHero.value }

    const fallbackHero = fallback ? unref(fallback) : null
    return fallbackHero ?? null
  })
}

