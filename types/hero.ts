export type CcmHeroVariant = 'default' | 'minimal' | (string & {})

export interface CcmHeroAction {
  label: string
  to?: string
  href?: string
  color?: string
}

export interface CcmHeroContent {
  brow?: string
  title: string
  tagline?: string
  backgroundColor?: string
  size?: string
  hideTop?: boolean
  hideTopbar?: boolean
  hideBottom?: boolean
  hideLogoReel?: boolean
  variant?: CcmHeroVariant
  author?: string
  date?: string
  tags?: string[]
  client?: string
  project?: string
  actions?: CcmHeroAction[]
  [key: string]: unknown
}

