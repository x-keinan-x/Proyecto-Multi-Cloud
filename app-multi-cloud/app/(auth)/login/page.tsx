'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Importamos para renderizar eficientemente EdTech.svg
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/catalog');
    } catch (err) {
      setError('Email o contraseña inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      
      {/* 🔹 ESQUINA SUPERIOR IZQUIERDA: ICONO Y BOTÓN RETROCEDER */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        {/* Botón para volver a la página de bienvenida (raíz) */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Separador Visual */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Identificador de Marca */}
        <div className="flex items-center gap-2 select-none">
          <Image 
            src="/EdTech.svg" 
            alt="Logo EdTech" 
            width={250} 
            height={250} 
            className="object-contain"
          />
        </div>
      </div>

      {/* 🔹 CONTENEDOR DEL FORMULARIO CENTRAL */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Inicia Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          ¿No tienes cuenta?{' '}
          {/* CORRECCIÓN: Apunta correctamente a la ruta del subdirectorio auth */}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>

    </div>
  );
}