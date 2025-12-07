export type Link = {
  id: string;
  name: string;
  href: string;
  isIcon?: boolean;
}

export const LINKS: Array<Link> = [
  {
    id: 'home',
    name: 'Home',
    href: '#',
    isIcon: true
  },
  {
    id: 'portafolio',
    name: 'Portafolio',
    href: '/portafolio',
    isIcon: false
  },
  {
    id: 'curriculumVitae',
    name: 'CV',
    href: '/curriculum-vitae',
    isIcon: false
  },
]