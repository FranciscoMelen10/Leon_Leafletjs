/* 
    Ingenieria en Sistemas de Información
    Clase: Sistemas de Información Geográfica
    Estudiante: Francisco De Jesús Meléndez Simplina
    Fecha: 15/11/2024
*/

// Inicializar el mapa
var map = L.map("map").setView([12.559255, -86.671143], 9);
var map2 = L.map("map2").setView([12.559255, -86.671143], 9);

// Función para obtener colores del coropleta
function getColor(d) {
  return d > 50000
    ? "#1a1a1d"
    : d > 20000
    ? "#6f2232"
    : d > 15000
    ? "#950740"
    : d > 10000
    ? "#c3073f"
    : d > 5000
    ? "#ff5733"
    : d > 1000
    ? "#ffc300"
    : d > 0
    ? "#daf7a6"
    : "#f7f7f7";
}

// Estilos del GeoJSON del coropleta
function style(feature) {
  return {
    fillColor: getColor(feature.properties.Hombres),
    weight: 2,
    opacity: 1,
    color: "#FF0000",
    fillOpacity: 0.7,
  };
}

// Estilos del centroide
function getColorCentroide(d) {
  return d > 50000
    ? 14
    : d > 20000
    ? 12
    : d > 15000
    ? 10
    : d > 10000
    ? 8
    : d > 5000
    ? 6
    : d > 1000
    ? 4
    : d > 0
    ? 2
    : 1;
}

// Estilos del GeoJSON del centroide
function styleCentroide(feature) {
  return {
    fillColor: "#FF0000",
    weight: getColorCentroide(feature.properties.Hombres),
    opacity: 1,
    color: "#FF0000",
  };
}

// Capa base del mapa
const mapaBase = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Capa base del mapa 2
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 7,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map2);

// Inicializar el control de capas
const controlCapas = L.control.layers({ Mapa: mapaBase }).addTo(map);

// Variables para las capas
let coropleta, centroide;

fetch("./layers/LEON.json")
  .then((response) => {
    if (!response.ok) throw new Error("Error al cargar el archivo JSON");
    return response.json();
  })
  .then((data) => {
    coropleta = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<table style='border-collapse: collapse; width: 100%;'>" +
            "<tr><td style='border: 1px solid black; padding: 4px; font-weight: 700;'>Departamento</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Municipio +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px; font-weight: 700;'>Hombres</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Hombres +
            "</td></tr>" +
            "</table>"
        );
      },
      style: style,
    });
    controlCapas.addOverlay(coropleta, "Coropleta"); // Añadir la capa al control de capas
    coropleta.addTo(map); // Añadir por defecto al mapa

    L.geoJSON(data).addTo(map2);
  })
  .catch((error) => console.error("Error al cargar la coropleta:", error));

fetch("./layers/LEON_CENTROIDES.json")
  .then((response) => {
    if (!response.ok) throw new Error("Error al cargar el archivo JSON");
    return response.json();
  })
  .then((data) => {
    centroide = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<table style='border-collapse: collapse; width: 100%;'>" +
            "<tr><td style='border: 1px solid black; padding: 4px; font-weight: 700;'>Departamento</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Municipio +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px; font-weight: 700;'>Hombres</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Hombres +
            "</td></tr>" +
            "</table>"
        );
      },
      pointToLayer: function (feature, latlng) {
        // Crear un círculo para cada punto
        return L.circle(latlng);
      },
      style: styleCentroide,
    });
    // Añadir la capa al control de capas
    controlCapas.addOverlay(centroide, "Centroide"); // Añadir la capa al control de capas
    centroide.addTo(map); // Añadir por defecto al mapa
  })
  .catch((error) => console.error("Error al cargar los centroides:", error));

// Añadir el control de escala al mapa
L.control.scale().addTo(map);

// Escuchar el evento 'zoomend' para actualizar la escala
const escalaElemento = document.querySelector(".escala");
const escalaMetrica = document.querySelector(".leaflet-control-scale-line");

function actualizarEscalaDesdeLeaflet() {
  escalaElemento.textContent = escalaMetrica.textContent;
}
map.on("zoomend", actualizarEscalaDesdeLeaflet);
actualizarEscalaDesdeLeaflet();
