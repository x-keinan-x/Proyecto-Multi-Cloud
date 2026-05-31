// ms-users/server.js (Node.js + Express)
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// NOTA DE INFRAESTRUCTURA: La clave secreta se inyectará desde un Kubernetes Secret
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_temporal';

// Endpoint de Inicio de Sesión (Login)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Aquí se consultaría a Amazon RDS. Simulamos la validación:
    if (email === "estudiante@edtech.com" && password === "password123") {
        // Generar el token JWT válido por 2 horas
        const token = jwt.sign({ id: 1, role: 'student' }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token, message: "Autenticación exitosa" });
    }
    
    return res.status(401).json({ error: "Credenciales incorrectas" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Microservicio de Usuarios corriendo en puerto ${PORT}`));
