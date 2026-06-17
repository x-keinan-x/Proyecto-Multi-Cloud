const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_temporal';

// Configuración del Pool de conexiones a Amazon RDS
// Kubernetes inyecta estas variables desde ConfigMap y Secret
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

// Inicialización automática de la tabla
async function initDB() {
    const query = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            rol VARCHAR(50) DEFAULT 'estudiante',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("[RDS] Tabla 'usuarios' verificada/creada exitosamente.");
    } catch (err) {
        console.error("[RDS] Error al inicializar la tabla de usuarios:", err);
    }
}
initDB();

// ENDPOINT DE REGISTRO
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "El correo y la contraseña son obligatorios" });
    }

    try {
        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar en PostgreSQL
        const result = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email, rol',
            [email, hashedPassword]
        );

        const nuevoUsuario = result.rows[0];
        console.log(`[RDS] Usuario registrado exitosamente: ${nuevoUsuario.email}`);
        
        return res.status(201).json({ message: "Usuario creado exitosamente" });

    } catch (error) {
        // Error de restricción UNIQUE
        if (error.code === '23505') {
            return res.status(400).json({ error: "Este correo ya se encuentra registrado" });
        }
        console.error("Error en el registro:", error);
        return res.status(500).json({ error: "Error interno del servidor al conectar con la base de datos" });
    }
});

// ENDPOINT DE INICIO DE SESIÓN
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Buscar al usuario por email
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Email o contraseña inválidos" });
        }

        const usuario = result.rows[0];

        // Comparar la contraseña ingresada con el hash en la base de datos
        const passwordValida = await bcrypt.compare(password, usuario.password);
        
        if (!passwordValida) {
            return res.status(401).json({ error: "Email o contraseña inválidos" });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario.id, role: usuario.rol }, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );
        
        console.log(`[RDS] Inicio de sesión exitoso: ${usuario.email}`);

        // Devolver el token y el objeto user para el Frontend
        return res.json({ 
            token, 
            message: "Autenticación exitosa",
            user: { id: usuario.id.toString(), email: usuario.email }
        });

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Microservicio de Usuarios corriendo en puerto ${PORT} conectado a AWS RDS`));