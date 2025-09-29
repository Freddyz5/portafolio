type Link = {
  id: string;
  name: string;
  href: string;
  isIcon?: boolean;
}

export const LINKS: Array<Link> = [
  {
    id: 'home',
    name: 'Home',
    href: '#home',
    isIcon: true
  },
  {
    id: 'experience',
    name: 'Experiencia',
    href: '#experience',
    isIcon: false
  },
  {
    id: 'projects',
    name: 'Proyectos',
    href: '#projects',
    isIcon: false
  },
  {
    id: 'about',
    name: 'Acerca de mi',
    href: '#about',
    isIcon: false
  },
  {
    id: 'contact',
    name: 'Contacto',
    href: '#contact',
    isIcon: false
  }
]