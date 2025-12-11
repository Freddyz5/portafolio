export type Link = {
  id: string;
  name: { es: string; en: string } | string;
  href: string;
  isIcon?: boolean;
}

export const LINKS: Array<Link> = [
  {
    id: 'home',
    name: { es: 'Inicio', en: 'Home' },
    href: '#home',
    isIcon: true
  },
  {
    id: 'experience',
    name: { es: 'Experiencia', en: 'Experience' },
    href: '#experience',
    isIcon: false
  },
  {
    id: 'projects',
    name: { es: 'Proyectos', en: 'Projects' },
    href: '#projects',
    isIcon: false
  },
  {
    id: 'contact',
    name: { es: 'Contacto', en: 'Contact' },
    href: '#contact',
    isIcon: false
  }
]

export const PROJECT_LINKS: Array<Link> = [
  {
    id: 'home',
    name: { es: 'Inicio', en: 'Home' },
    href: './',
    isIcon: true
  },
  {
    id: 'experience',
    name: { es: 'Experiencia', en: 'Experience' },
    href: './portafolio#experience',
    isIcon: false
  },
  {
    id: 'contact',
    name: { es: 'Contacto', en: 'Contact' },
    href: './portafolio#contact',
    isIcon: false
  }
];