export interface NavigationLink {
  to: string
  label: string
}

export const useNavigation = (): NavigationLink[] => {
  return [
    { to: '/work', label: 'Work' },
    { to: '/services', label: 'What we do' },
    // { to: '/blog', label: 'Insights' },
    { to: '/contact', label: 'Contact' },
  ]
}
