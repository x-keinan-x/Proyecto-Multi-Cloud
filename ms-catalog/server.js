const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración del Pool de conexiones a Amazon RDS
const pool = new Pool({
    host: process.env.DATABASE_URL, 
    user: 'dbadmin',                
    password: process.env.DB_PASSWORD || 'PasswordSeguro123',
    database: 'postgres',           
    port: 5432,
    ssl: {
        rejectUnauthorized: false   
    }
});

// Inicialización automática de la tabla de cursos con datos semilla
async function initDB() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cursos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            duration VARCHAR(50),
            category VARCHAR(100),
            price NUMERIC(10, 2),
            video_url TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    const checkEmptyQuery = `SELECT COUNT(*) FROM cursos;`;
    
    const seedDataQuery = `
        INSERT INTO cursos (title, description, duration, category, price, video_url) VALUES 
        ('Chatbot con IA', 'desarrollo de un chatbot inteligente.', '1 hora', 'Cloud', 5999, 'https://youtu.be/9PdpOJDcLmU?si=m1-ncPdqJ84R7J2r'),
        ('Orquestación con Kubernetes', 'Domina K3s y la gestión de microservicios.', '2 horas', 'DevOps', 4500, 'https://youtu.be/DCoBcpOA7W4?si=Vk7eJ9rJ2Q5cKkoy')
        ON CONFLICT DO NOTHING;
    `;

    try {
        await pool.query(createTableQuery);
        const res = await pool.query(checkEmptyQuery);
        
        if (parseInt(res.rows[0].count) === 0) {
            await pool.query(seedDataQuery);
            console.log("[RDS] Datos semilla inyectados en la tabla 'cursos'.");
        } else {
            console.log("[RDS] La tabla 'cursos' ya contiene datos.");
        }
    } catch (err) {
        console.error("[RDS] Error al inicializar la base de datos de catálogo:", err);
    }
}
initDB();

// ENDPOINT: Obtener el catálogo dinámico desde la Base de Datos
app.get('/api/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cursos ORDER BY id ASC');
        
        // Se mapean los resultados para asegurar que el Frontend reciba el formato exacto que espera
        const formattedCourses = result.rows.map(row => ({
            id: row.id.toString(),
            title: row.title,
            description: row.description,
            duration: row.duration,
            category: row.category,
            price: row.price,
            videoUrl: row.video_url,
            image: row.image_url
        }));

        res.json(formattedCourses);
    } catch (error) {
        console.error("[RDS] Error al consultar los cursos:", error);
        res.status(500).json({ error: "Error interno al conectar con la base de datos de catálogo" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Microservicio de Catálogo corriendo en puerto ${PORT} conectado a AWS RDS`));
