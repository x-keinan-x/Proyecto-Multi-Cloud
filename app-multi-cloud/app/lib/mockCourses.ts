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
}

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'React Avanzado',
    description: 'Aprende patrones avanzados de React y optimización.',
    duration: '40 horas',
    category: 'Frontend',
    price: 4999,
  },
  {
    id: '2',
    title: 'Next.js Fullstack',
    description: 'Desarrollo completo con Next.js desde cero.',
    duration: '50 horas',
    category: 'Fullstack',
    price: 5999,
  },
  {
    id: '3',
    title: 'TypeScript Esencial',
    description: 'Domina TypeScript para escribir código más seguro.',
    duration: '30 horas',
    category: 'Backend',
    price: 3999,
  },
  // ... más cursos
];