// Inicializar el mapa (los límites se ajustarán automáticamente al cargar los datos)
const map = L.map('map');

// Agregar la capa de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Estilo por defecto para los departamentos
function style(feature) {
    return {
        fillColor: '#3498db',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.5
    };
}

// Estilo cuando se pasa el mouse por encima (hover)
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        fillColor: '#e74c3c', // Color de resalte rojo
        weight: 2,
        color: '#fff',
        fillOpacity: 0.8
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Restaurar el estilo original
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

// Variables de UI
const offcanvas = document.getElementById('info-panel');
const closeBtn = document.getElementById('close-btn');
const deptTitle = document.getElementById('dept-title');
const politicosList = document.getElementById('politicos-list');
const politicoDetail = document.getElementById('politico-detail');
const tabBtns = document.querySelectorAll('.tab-btn');
const backBtn = document.getElementById('back-btn');

let datosActuales = null;
let tabActual = 'senadores';

// Cierra el panel
closeBtn.addEventListener('click', () => {
    offcanvas.classList.remove('open');
});

// Volver a la lista
backBtn.addEventListener('click', () => {
    politicoDetail.classList.add('hidden');
    politicosList.classList.remove('hidden');
});

// Cambiar pestañas
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        tabActual = e.target.getAttribute('data-tab');
        
        // Volver a la lista y renderizar
        politicoDetail.classList.add('hidden');
        politicosList.classList.remove('hidden');
        renderizarLista();
    });
});

// Renderiza la lista de políticos
function renderizarLista() {
    politicosList.innerHTML = '';
    
    if (!datosActuales || !datosActuales[tabActual] || datosActuales[tabActual].length === 0) {
        politicosList.innerHTML = '<p>No hay datos disponibles para este departamento.</p>';
        return;
    }

    datosActuales[tabActual].forEach(politico => {
        const item = document.createElement('div');
        item.className = 'politico-item';
        item.innerHTML = `<h4>${politico.nombre}</h4> <i class="fa-solid fa-chevron-right"></i>`;
        
        item.addEventListener('click', () => {
            mostrarDetalle(politico);
        });
        
        politicosList.appendChild(item);
    });
}

// Muestra la tarjeta de detalle de un político
function mostrarDetalle(politico) {
    politicosList.classList.add('hidden');
    politicoDetail.classList.remove('hidden');
    
    document.getElementById('pol-nombre').textContent = politico.nombre;
    document.getElementById('pol-partido').textContent = politico.partido;
    document.getElementById('pol-votos').textContent = politico.votos;
    
    // Configurar foto
    const imgEl = document.getElementById('pol-foto');
    imgEl.src = politico.foto_path;
    // Si la imagen no carga, poner un placeholder
    imgEl.onerror = () => {
        imgEl.src = 'https://via.placeholder.com/400x400.png?text=Sin+Foto';
    };
}

// Evento al hacer click en un departamento
function clickDepartamento(e) {
    const layer = e.target;
    const nombreDepto = layer.feature.properties.DPTO_CNMBR;
    
    // Zoom al departamento
    map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    
    // Actualizar UI
    deptTitle.textContent = nombreDepto;
    
    // Obtener datos (usando la función del archivo datos_politicos.js)
    if (typeof obtenerPoliticos === 'function') {
        datosActuales = obtenerPoliticos(nombreDepto);
    }
    
    // Asegurar que volvemos a la vista de lista
    politicoDetail.classList.add('hidden');
    politicosList.classList.remove('hidden');
    
    renderizarLista();
    offcanvas.classList.add('open');
}

// Agregar interacciones a cada departamento
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.DPTO_CNMBR) {
        layer.bindTooltip(feature.properties.DPTO_CNMBR, {
            sticky: true,
            className: 'departamento-tooltip'
        });
    }

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickDepartamento
    });
}

let geojsonLayer;

// Cargar el archivo GeoJSON desde la variable cargada en el HTML
geojsonLayer = L.geoJSON(colombiaGeoJSON, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Centrar y ajustar el mapa exactamente a los límites de Colombia (responsive)
map.fitBounds(geojsonLayer.getBounds());
