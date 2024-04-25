function initializeWorldMap() {
    // Récupérer l'élément contenant la carte
    var mapElement = document.getElementById('worldMap');

    // Créer un élément SVG pour contenir les chemins
    var draw = SVG().addTo(mapElement).size('100%', '100%');

    // Dessiner les chemins des différentes régions
    for (var key in simplemaps_worldmap_mapinfo.paths) {
        var pathData = simplemaps_worldmap_mapinfo.paths[key];
        var path = draw.path(pathData).fill('none').stroke({ color: '#000000', width: 2 });
    }
}
