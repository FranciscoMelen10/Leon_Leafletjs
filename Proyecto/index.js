/* 
    Ingenieria en Sistemas de Información
    Clase: Sistemas de Información Geográfica
    Estudiante: Francisco De Jesús Meléndez Simplina
    Fecha: 15/11/2024
*/

// Inicializar el mapa
var map = L.map("map").setView([12.565287, -86.64917], 9);

// Estilos del GeoJSON
const myStyle = {
  color: "#FF0000",
  weight: 3,
  opacity: 1,
};

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
            "<tr><th style='border: 1px solid black; padding: 4px; text-align: left;'>Propiedad</th><th style='border: 1px solid black; padding: 4px; text-align: left;'>Valor</th></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Departamento</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Municipio +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Hombres</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Hombres +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Mujeres</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Mujeres +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Total de habitantes</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Total +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Viviendas</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.Viviendas_ +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Viviendas Urbanas</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.VIV_Urbana +
            "</td></tr>" +
            "<tr><td style='border: 1px solid black; padding: 4px;'>Viviendas Rurales</td><td style='border: 1px solid black; padding: 4px;'>" +
            feature.properties.VIV_Rurale +
            "</td></tr>" +
            "</table>"
        );
      },
      style: myStyle,
    }).addTo(map);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
