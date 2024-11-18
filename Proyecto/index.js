/* 
    Ingenieria en Sistemas de Información
    Clase: Sistemas de Información Geográfica
    Estudiante: Francisco De Jesús Meléndez Simplina
    Fecha: 15/11/2024
*/

// Inicializar el mapa
var map = L.map("map").setView([12.565287, -86.64917], 9);

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

// Estilos del GeoJSON
function style(feature) {
  return {
    fillColor: getColor(feature.properties.Hombres),
    weight: 2,
    opacity: 1,
    color: "#FF0000",
    fillOpacity: 0.7,
  };
}

// Añadir el mapa base
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Importar el archivo JSON
fetch("./layers/LEON.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    return response.json();
  })
  .then((data) => {
    // Almacenar los datos
    let JSON_LEON = data;

    // Añadir las capas al mapa (si es GeoJSON)
    L.geoJSON(JSON_LEON, {
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
    }).addTo(map);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
