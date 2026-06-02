// app/catalog/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { MOCK_COURSES, Course } from '@/app/lib/mockCourses';

export default function CatalogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para manejar los datos reales
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Para consultar al microservicio de catálogo (Puerto 5000)
  useEffect(() => {
    console.log('Cargando MOCK_COURSES:', MOCK_COURSES.length);
    setCourses(MOCK_COURSES);
    setFilteredCourses(MOCK_COURSES);
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Catálogo de Cursos</h1>
          <p className="text-gray-600">
            {user ? `Bienvenido, ${user.email}` : 'Explora nuestros cursos'}
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Grilla de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
            >
              {/* Video de YouTube o Imagen */}
              {course.videoUrl ? (
                <div className="relative w-full h-48 bg-black">
                  <iframe
                    width="100%"
                    height="192"
                    src={course.videoUrl}
                    title={course.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {/* Contenido */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{course.description}</p>
                
                {/* Footer con info */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-blue-600 font-medium text-sm">⏱️ {course.duration}</span>
                  {course.price && (
                    <span className="text-green-600 font-semibold">${course.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No se encontraron cursos.</p>
        )}
      </div>
    </div>
  );
}