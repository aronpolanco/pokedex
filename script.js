// ============================================
// CONFIGURACIÓN
// ============================================
const API_KEY = "clase_pokemon_2024";
const BASE_URL = "https://aronunisur.pythonanywhere.com";

// Variables globales
let todosPokemon = [];
let pokemonFiltrados = [];
let paginaActual = 1;
const pokemonPorPagina = 20;
let tiempoInicio = Date.now();

// Colores para tipos
const coloresTipo = {
    'Planta': '#78c850', 'Fuego': '#f08030', 'Agua': '#6890f0',
    'Electrico': '#f8d030', 'Normal': '#a8a878', 'Veneno': '#a040a0',
    'Bicho': '#a8b820', 'Tierra': '#e0c068', 'Hada': '#ee99ac',
    'Lucha': '#c03028', 'Psiquico': '#f85888', 'Roca': '#b8a038',
    'Fantasma': '#705898', 'Hielo': '#98d8d8', 'Dragon': '#7038f8',
    'Volador': '#a890f0'
};

// ============================================
// CARGAR TODOS LOS POKÉMON
// ============================================
async function cargarTodosPokemon() {
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const cargadosSpan = document.getElementById('cargados');
    
    loading.style.display = 'block';
    errorDiv.style.display = 'none';
    
    todosPokemon = [];
    let contador = 0;
    
    try {
        for (let numero = 1; numero <= 151; numero++) {
            try {
                const url = `${BASE_URL}/pokemon/${numero}?api_key=${API_KEY}`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const data = await response.json();
                    todosPokemon.push(data);
                    contador++;
                    cargadosSpan.textContent = contador;
                }
            } catch (e) {
                console.log(`Error #${numero}:`, e);
            }
        }
        
        if (todosPokemon.length > 0) {
            todosPokemon.sort((a, b) => a.id - b.id);
            document.getElementById('totalPokemon').textContent = todosPokemon.length;
            
            const tiposUnicos = new Set(todosPokemon.map(p => p.tipo));
            document.getElementById('tiposUnicos').textContent = tiposUnicos.size;
            
            pokemonFiltrados = [...todosPokemon];
            mostrarPokemon();
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '❌ No se pudo cargar ningún Pokémon';
        }
        
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `❌ Error: ${error.message}`;
    } finally {
        loading.style.display = 'none';
        document.getElementById('tiempoCarga').textContent = 
            `${((Date.now() - tiempoInicio) / 1000).toFixed(1)}s`;
    }
}

// ============================================
// OBTENER IMAGEN - VERSIÓN CORREGIDA
// ============================================
function obtenerImagenPokemon(id, nombre) {
    // Usar IDs para imágenes más confiables
    // Pokémon.com usa IDs, es más seguro
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.toString().padStart(3, '0')}.png`;
}

// ============================================
// MOSTRAR POKÉMON
// ============================================
function mostrarPokemon() {
    const container = document.getElementById('pokemonContainer');
    
    if (!pokemonFiltrados || pokemonFiltrados.length === 0) {
        container.innerHTML = '<div class="error-message" style="display:block;">❌ No hay Pokémon para mostrar</div>';
        return;
    }
    
    const inicio = (paginaActual - 1) * pokemonPorPagina;
    const fin = inicio + pokemonPorPagina;
    const pokemonPagina = pokemonFiltrados.slice(inicio, fin);
    
    container.innerHTML = '';
    
    pokemonPagina.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.style.borderLeftColor = coloresTipo[pokemon.tipo] || '#a8a878';
        
        const numeroFormateado = pokemon.id.toString().padStart(3, '0');
        const imagenUrl = obtenerImagenPokemon(pokemon.id, pokemon.nombre);
        
        card.innerHTML = `
            <div class="pokemon-image">
                <img src="${imagenUrl}" 
                     alt="${pokemon.nombre}"
                     onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
            </div>
            <div class="pokemon-number">#${numeroFormateado}</div>
            <div class="pokemon-name">${pokemon.nombre}</div>
            <div class="pokemon-types">
                <span class="type-badge type-${pokemon.tipo.toLowerCase()}">${pokemon.tipo}</span>
            </div>
            <div class="pokemon-stats">
                <div class="stat-item">
                    <div class="stat-label">Peso</div>
                    <div class="stat-value">${pokemon.peso_kg} kg</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Altura</div>
                    <div class="stat-value">${pokemon.altura_m} m</div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    actualizarPaginacion();
}

// ============================================
// BUSCAR POKÉMON
// ============================================
function buscarPokemon() {
    const busqueda = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!busqueda) {
        pokemonFiltrados = [...todosPokemon];
    } else {
        pokemonFiltrados = todosPokemon.filter(pokemon => 
            pokemon.nombre.toLowerCase().includes(busqueda) ||
            pokemon.id.toString().includes(busqueda) ||
            pokemon.tipo.toLowerCase().includes(busqueda)
        );
    }
    
    paginaActual = 1;
    mostrarPokemon();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === 'Todos') btn.classList.add('active');
    });
}

function filtrarPorTipo(tipo, elemento) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');
    
    if (tipo === 'todos') {
        pokemonFiltrados = [...todosPokemon];
    } else {
        pokemonFiltrados = todosPokemon.filter(pokemon => 
            pokemon.tipo.toLowerCase() === tipo.toLowerCase()
        );
    }
    
    document.getElementById('searchInput').value = '';
    paginaActual = 1;
    mostrarPokemon();
}

function mostrarTodos() {
    document.getElementById('searchInput').value = '';
    pokemonFiltrados = [...todosPokemon];
    paginaActual = 1;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === 'Todos') btn.classList.add('active');
    });
    
    mostrarPokemon();
}

function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(pokemonFiltrados.length / pokemonPorPagina);
    
    if (direccion === 'siguiente' && paginaActual < totalPaginas) {
        paginaActual++;
    } else if (direccion === 'anterior' && paginaActual > 1) {
        paginaActual--;
    }
    
    mostrarPokemon();
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(pokemonFiltrados.length / pokemonPorPagina);
    document.getElementById('pageInfo').textContent = `Página ${paginaActual} de ${totalPaginas}`;
    document.getElementById('btnAnterior').disabled = paginaActual === 1;
    document.getElementById('btnSiguiente').disabled = paginaActual === totalPaginas;
}

document.addEventListener('DOMContentLoaded', cargarTodosPokemon);
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarPokemon();
});