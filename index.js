require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/peliculas', async (req, res) => {
    try {
        const response = await axios.get (
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
    );
    res.json(response.data)
    }catch (error) {
    console.error('Error al hacer la petición a TMDB:');
    if (error.response) {
        console.error('Código de estado:', error.response.status);
        console.error('Respuesta de TMDB:', error.response.data);
    } else {
        console.error('Error genérico:', error.message);
    }
    res.status(500).json({ error: 'No se pudo obtener las películas' });
}

});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:3000/api/peliculas`);
});

