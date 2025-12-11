const BASE_URL = import.meta.env.BASE_URL;

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
    href: `${BASE_URL}/es`,
    isIcon: false
  },
  {
    id: 'curriculumVitae',
    name: 'CV',
    href: `${BASE_URL}/es/cv`,
    isIcon: false
  },
]