'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { MOCK_COURSES } from '@/app/lib/mockCourses';

export default function CatalogPage() {
  // Extraemos user, loading y logout del contexto de autenticación
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para manejar los datos reales / mock
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Carga de los cursos simulados/reales
  useEffect(() => {
    console.log('Cargando MOCK_COURSES:', MOCK_COURSES.length);
    setCourses(MOCK_COURSES);
    setFilteredCourses(MOCK_COURSES);
  }, []);

  // Filtro de búsqueda por término
  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Cargando catálogo...</p>
      </div>
    );
  }

  // Manejador para el cierre de sesión seguro
  const handleLogout = async () => {
    if (logout) {
      await logout();
      router.push('/'); // Redirige a la landing page pública tras limpiar el JWT
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 🔹 BARRA DE NAVEGACIÓN SUPERIOR ADAPTATIVA */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        {/* Identificador de marca oficial */}
        <div className="flex items-center gap-3 select-none">
          <Image 
            src="/EdTech.svg" 
            alt="Logo EdTech" 
            width={250} 
            height={250} 
            className="object-contain"
          />
        </div>

        {/* Control de botones condicional según el estado del usuario */}
        <div className="flex items-center gap-4">
          {user ? (
            /* CASO 1: USUARIO LOGUEADO -> MUESTRA INFO Y CERRAR SESIÓN */
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Conectado: <strong className="text-gray-900 font-semibold">{user.email}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-md border border-red-200 hover:bg-red-100 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l4-4m-4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01 3-3h4a3 3 0 01 3 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            /* CASO 2: VISITANTE ANÓNIMO -> MUESTRA BOTÓN RETROCEDER A LA BIENVENIDA */
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Inicio
            </button>
          )}
        </div>
      </nav>

      {/* 🔹 CONTENEDOR PRINCIPAL DEL CATÁLOGO */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 mt-4">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Catálogo de Cursos</h1>
          <p className="text-gray-600">
            {user ? `Bienvenido de nuevo, ${user.email}` : 'Explora de forma libre nuestra oferta académica'}
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
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full border border-gray-100"
            >
              {/* Video de YouTube o Imagen optimizada */}
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
                <div className="relative w-full h-48">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Contenido de la tarjeta académica */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">{course.description}</p>
                
                {/* Footer descriptivo */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-auto">
                  <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-2.5 py-1 rounded">
                    ⏱️ {course.duration}
                  </span>
                  {course.price && (
                    <span className="text-green-600 font-bold text-lg">${course.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-8 py-12 text-lg">No se encontraron cursos que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  );
}