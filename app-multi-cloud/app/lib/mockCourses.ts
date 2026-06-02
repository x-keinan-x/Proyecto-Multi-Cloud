// app/lib/mockCourses.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  category?: string;
  instructor?: string;
  price?: number;
  image?: string;
  videoUrl?: string; // URL de video de YouTube
}

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'React Avanzado',
    description: 'Aprende patrones avanzados de React y optimización.',
    duration: '40 horas',
    category: 'Frontend',
    price: 4999,
    videoUrl: 'https://www.youtube.com/embed/jQEl0pvg8X4',
  },
  {
    id: '2',
    title: 'Next.js Fullstack',
    description: 'Desarrollo completo con Next.js desde cero.',
    duration: '50 horas',
    category: 'Fullstack',
    price: 5999,
    videoUrl: 'https://www.youtube.com/embed/9P8mAofYApA',
  },
  {
    id: '3',
    title: 'TypeScript Esencial',
    description: 'Domina TypeScript para escribir código más seguro.',
    duration: '30 horas',
    category: 'Backend',
    price: 3999,
    videoUrl: 'https://www.youtube.com/embed/30LWayoaoAE',
  },
  {
    id: '4',
    title: 'Python para Data Science',
    description: 'Análisis de datos, visualización y machine learning con Python.',
    duration: '45 horas',
    category: 'Data Science',
    price: 5499,
    videoUrl: 'https://www.youtube.com/embed/XGvf3hT-4W0',
  },
  {
    id: '5',
    title: 'Diseño UX/UI Moderno',
    description: 'Aprende a diseñar interfaces hermosas y funcionales.',
    duration: '35 horas',
    category: 'Design',
    price: 4499,
    videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
  },
  {
    id: '6',
    title: 'DevOps con Docker y Kubernetes',
    description: 'Containerización y orquestación de aplicaciones.',
    duration: '55 horas',
    category: 'DevOps',
    price: 6499,
    videoUrl: 'https://www.youtube.com/embed/VqzVrul7Qmk',
  },
  {
    id: '7',
    title: 'Vue.js 3 Completo',
    description: 'Construcción de aplicaciones interactivas con Vue 3.',
    duration: '42 horas',
    category: 'Frontend',
    price: 4999,
    videoUrl: 'https://www.youtube.com/embed/FXpIoQ_rT_c',
  },
  {
    id: '8',
    title: 'Seguridad en Desarrollo Web',
    description: 'Protege tus aplicaciones contra vulnerabilidades comunes.',
    duration: '38 horas',
    category: 'Security',
    price: 5299,
    videoUrl: 'https://www.youtube.com/embed/gKPZe6ahjNE',
  },
  {
    id: '9',
    title: 'AWS para Desarrolladores',
    description: 'Despliegue y gestión de aplicaciones en la nube con AWS.',
    duration: '48 horas',
    category: 'Cloud',
    price: 5999,
    videoUrl: 'https://www.youtube.com/embed/SOTAmWjovzE',
  },
];