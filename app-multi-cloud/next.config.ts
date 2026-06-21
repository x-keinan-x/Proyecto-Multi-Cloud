import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Enviar peticiones de login/registro al microservicio de Usuarios
        source: '/api/auth/:path*',
        destination: 'http://ms-users-service.default.svc.cluster.local/api/auth/:path*',
      },
      {
        // Enviar peticiones del catálogo al microservicio de Catálogo
        source: '/api/courses/:path*',
        destination: 'http://ms-catalog-service.default.svc.cluster.local/api/courses/:path*',
      }
    ];
  },
};

export default nextConfig;