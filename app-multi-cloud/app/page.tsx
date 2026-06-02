'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* 🔹 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">
        {/* Agregamos tu logo EdTech.svg propio aquí */}
        <div className="flex items-center gap-3">
          <Image 
            src="/EdTech.svg" 
            alt="Logo EdTech" 
            width={250} 
            height={250} 
            className="object-contain"
          />
        </div>
        
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-md text-gray-600 font-medium hover:text-gray-900 transition">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Regístrate Gratis
          </Link>
        </div>
      </nav>

      {/* 🔹 SECCIÓN HERO (PRINCIPAL) */}
      <header className="flex flex-col items-center text-center px-5 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          La plataforma de aprendizaje <span className="text-blue-600">Multi-Cloud</span> más rápida del mundo
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Accede a tus cursos en video al instante, con calidad adaptativa garantizada por infraestructura en la nube global. Diseñado para estudiantes e instructores del futuro.
        </p>
        <div className="flex gap-5">
          <Link href="/catalog" className="px-8 py-4 text-lg font-semibold rounded-lg bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition">
            Explorar Catálogo
          </Link>
        </div>
      </header>

      {/* 🔹 SECCIÓN DE BENEFICIOS (VINCULADO A TU INFRAESTRUCTURA) */}
      <section className="bg-white px-10 py-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-12">
            ¿Por qué elegir nuestra plataforma EdTech?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Streaming de Baja Latencia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gracias a la integración con Amazon CloudFront CDN, los fragmentos de video se distribuyen desde el nodo perimetral más cercano.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Calidad Auto-Adaptativa</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nuestro pipeline automatizado de transcodificación procesa los videos a múltiples resoluciones para evitar interrupciones.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Alta Disponibilidad</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Desplegado sobre clústeres elásticos en Kubernetes (EKS) con escalado automático para soportar picos de demanda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer className="text-center py-10 text-gray-400 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} EdTech Platform. Desarrollado con Next.js y Arquitectura Multi-Cloud.
      </footer>

    </div>
  );
}