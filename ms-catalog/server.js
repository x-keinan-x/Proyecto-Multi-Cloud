// ms-catalog/server.js (Node.js + Express)
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Endpoint para listar cursos
app.get('/api/courses', (req, res) => {
    // Estos datos idealmente se jalan desde la BD en Amazon RDS
    const courses = [
        { id: 1, title: "Introducción a Cloud Computing", duration: "10h", videoUrl: "videos/curso-cloud/intro.m3u8" },
        { id: 2, title: "Kubernetes desde Cero", duration: "15h", videoUrl: "videos/curso-k8s/main.m3u8" }
    ];
    res.json(courses);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Microservicio de Catálogo corriendo en puerto ${PORT}`));
