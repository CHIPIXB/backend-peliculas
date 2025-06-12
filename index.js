require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/peliculas', async (req, res) => {
    const page = req.query.page || 1; 
    try {
        const response = await axios.get (
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=es-ES&page=${page}`
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

app.get('/api/peliculas/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error al hacer la petición a TMDB:');
        if (error.response) {
            console.error('Código de estado:', error.response.status);
            console.error('Respuesta de TMDB:', error.response.data);
        } else {
            console.error('Error genérico:', error.message);
        }
        res.status(500).json({ error: 'No se pudo obtener la película' });
    }
});

app.get('/api/peliculas/:id/credits', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
        );

        // Busca el director en el array crew
        const directorObj = response.data.crew.find(person => person.job === 'Director');
        const director = directorObj ? directorObj.name : 'Desconocido';

        // Reparto (primeros 3 actores)
        const cast = response.data.cast.slice(0, 5).map(actor => ({
            name: actor.name,
            character: actor.character,
            profile_path: actor.profile_path
        }));

        res.json({
            director,
            cast
        });
    } catch (error) {
        console.error('Error al hacer la petición de créditos a TMDB:');
        if (error.response) {
            console.error('Código de estado:', error.response.status);
            console.error('Respuesta de TMDB:', error.response.data);
        } else {
            console.error('Error genérico:', error.message);
        }
        res.status(500).json({ error: 'No se pudo obtener los créditos de la película' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:3000/api/peliculas`);
});

