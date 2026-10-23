ol.proj.proj4.register(proj4);
var wms_layers = [];

var lyr_GoogleSatellite_0 = new ol.layer.Tile({
    'title': 'Google Satellite',
    'opacity': 1.000000,
    source: new ol.source.XYZ({
        attributions: '&nbsp;&middot; <a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
    })
});

var format_hr_shape_1 = new ol.format.GeoJSON();
var features_hr_shape_1 = format_hr_shape_1.readFeatures(json_hr_shape_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3765'});
var jsonSource_hr_shape_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_hr_shape_1.addFeatures(features_hr_shape_1);
var lyr_hr_shape_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_hr_shape_1, 
                style: style_hr_shape_1,
                popuplayertitle: 'hr_shape',
                interactive: false,
                title: '<img src="styles/legend/hr_shape_1.png" /> hr_shape'
            });

// Palynomorph records are loaded from data/NPP_atlas.csv by resources/load_csv.js
var jsonSource__2 = new ol.source.Vector({
    attributions: ' ',
});
var lyr__2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__2, 
                style: style__2,
                popuplayertitle: '',
                interactive: true,
                title: '<img src="styles/legend/_2.png" /> '
            });

// ---- CLIPPING: clip satellite to country shape ----
lyr_GoogleSatellite_0.on('prerender', function(event) {
    var ctx = event.context;
    var pixelRatio = event.frameState.pixelRatio;
    ctx.save();
    ctx.beginPath();
    var features = jsonSource_hr_shape_1.getFeatures();
    features.forEach(function(feature) {
        var geometry = feature.getGeometry();
        var coordinates = geometry.getCoordinates();
        coordinates.forEach(function(polygon) {
            polygon.forEach(function(ring) {
                ring.forEach(function(coord, i) {
                    var px = ol.transform.apply(event.frameState.coordinateToPixelTransform, coord);
                    if (i === 0) {
                        ctx.moveTo(px[0] * pixelRatio, px[1] * pixelRatio);
                    } else {
                        ctx.lineTo(px[0] * pixelRatio, px[1] * pixelRatio);
                    }
                });
                ctx.closePath();
            });
        });
    });
    ctx.clip();
});

lyr_GoogleSatellite_0.on('postrender', function(event) {
    event.context.restore();
});
// ---- END CLIPPING ----

lyr_GoogleSatellite_0.setVisible(true);
lyr_hr_shape_1.setVisible(true);
lyr__2.setVisible(true);

var layersList = [lyr_GoogleSatellite_0, lyr_hr_shape_1, lyr__2];

lyr_hr_shape_1.set('fieldAliases', {'NATION': 'NATION', 'CNTRYNAME': 'CNTRYNAME', 'CNTRYABBR': 'CNTRYABBR', });
lyr__2.set('fieldAliases', {'fid': 'fid', 'Group': 'Group', 'Subgroup': 'Subgroup', 'NPP': 'NPP', 'Site name': 'Site name', 'X (HTRS96)': 'X (HTRS96)', 'Y (HTRS96)': 'Y (HTRS96)', 'Paper': 'Paper', 'Article link': 'Article link', 'Search': 'Search', 'Ammended name': 'Ammended name', 'Link': 'Link', });
lyr_hr_shape_1.set('fieldImages', {'NATION': 'Range', 'CNTRYNAME': 'TextEdit', 'CNTRYABBR': 'TextEdit', });
lyr__2.set('fieldImages', {'fid': 'TextEdit', 'Group': 'TextEdit', 'Subgroup': 'TextEdit', 'NPP': 'TextEdit', 'Site name': 'TextEdit', 'X (HTRS96)': 'Range', 'Y (HTRS96)': 'Range', 'Paper': 'TextEdit', 'Article link': 'TextEdit', 'Search': 'TextEdit', 'Ammended name': 'TextEdit', 'Link': '', });
lyr_hr_shape_1.set('fieldLabels', {'NATION': 'no label', 'CNTRYNAME': 'no label', 'CNTRYABBR': 'no label', });
lyr__2.set('fieldLabels', {'fid': 'hidden field', 'Group': 'inline label - always visible', 'Subgroup': 'inline label - visible with data', 'NPP': 'inline label - always visible', 'Site name': 'inline label - always visible', 'X (HTRS96)': 'hidden field', 'Y (HTRS96)': 'hidden field', 'Paper': 'inline label - always visible', 'Article link': 'hidden field', 'Search': 'hidden field', 'Ammended name': 'inline label - visible with data', 'Link': 'inline label - always visible', });
