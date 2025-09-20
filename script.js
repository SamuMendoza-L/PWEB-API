// URL base de la API
const BASE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Referencias a elementos del DOM
const pokemonName = document.getElementById('pokemon-name');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonStats = document.getElementById('pokemon-stats');
const changeButton = document.getElementById('change-pokemon');
const searchInput = document.getElementById('search-pokemon');
const suggestionsList = document.getElementById('suggestions-list');

// Cache para almacenar la lista de Pokémon
let pokemonList = [];

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

// Función para obtener la lista completa de Pokémon
async function fetchPokemonList() {
    try {
        const response = await fetch(`${BASE_API_URL}?limit=898`);
        const data = await response.json();
        pokemonList = data.results;
    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
    }
}

// Función para mostrar sugerencias
function showSuggestions(filter) {
    const filtered = pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filter.toLowerCase())
    ).slice(0, 5); // Limitar a 5 sugerencias

    suggestionsList.innerHTML = '';
    
    if (filtered.length > 0) {
        filtered.forEach(pokemon => {
            const pokemonId = pokemon.url.split('/')[6];
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" 
                     alt="${pokemon.name}">
                <span>${pokemon.name}</span>
            `;
            
            div.addEventListener('click', () => {
                fetchPokemon(pokemonId);
                searchInput.value = pokemon.name;
                suggestionsList.style.display = 'none';
            });
            
            suggestionsList.appendChild(div);
        });
        suggestionsList.style.display = 'block';
    } else {
        suggestionsList.style.display = 'none';
    }
}

// Evento para el botón de cambiar Pokémon
changeButton.addEventListener('click', () => {
    const randomId = getRandomPokemonId();
    fetchPokemon(randomId);
});

// Eventos
searchInput.addEventListener('input', (e) => {
    const filter = e.target.value;
    if (filter.length > 0) {
        showSuggestions(filter);
    } else {
        suggestionsList.style.display = 'none';
    }
});

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});

// Ejecutar al cargar la página con Ditto por defecto
window.addEventListener('load', () => {
    fetchPokemon();
    fetchPokemonList();
});
