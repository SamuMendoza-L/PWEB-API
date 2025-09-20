// URL base de la API
const BASE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Referencias a elementos del DOM
const pokemonName = document.getElementById('pokemon-name');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonStats = document.getElementById('pokemon-stats');
const changeButton = document.getElementById('change-pokemon');

// Función para obtener un número aleatorio de Pokémon (hay 898 en total)
function getRandomPokemonId() {
    return Math.floor(Math.random() * 898) + 1;
}

// Función para obtener datos del Pokémon
async function fetchPokemon(id = 132) { // 132 es el ID de Ditto
    try {
        const response = await fetch(`${BASE_API_URL}${id}`);
        if (!response.ok) throw new Error('Error al obtener datos');
        
        const data = await response.json();

        // Nombre
        pokemonName.textContent = data.name.toUpperCase();

        // Imagen oficial
        pokemonImage.src = data.sprites.other['official-artwork'].front_default;

        // Tipos
        pokemonTypes.innerHTML = '';
        data.types.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t.type.name;
            pokemonTypes.appendChild(li);
        });

        // Estadísticas base
        pokemonStats.innerHTML = '';
        data.stats.forEach(stat => {
            const li = document.createElement('li');
            li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            pokemonStats.appendChild(li);
        });

    } catch (error) {
        pokemonName.textContent = 'No se pudo cargar la información';
        console.error(error);
    }
}

// Evento para el botón de cambiar Pokémon
changeButton.addEventListener('click', () => {
    const randomId = getRandomPokemonId();
    fetchPokemon(randomId);
});

// Ejecutar al cargar la página con Ditto por defecto
fetchPokemon();
