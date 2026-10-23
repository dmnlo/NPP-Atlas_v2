// Loads palynomorph records from data/NPP_atlas.csv, adds them to the map layer,
// then starts qgis2web.js (search, popups, controls).
// The CSV can be saved from Excel with ; or , as separator, in UTF-8 or Windows-1250.
(function () {
    var CSV_URL = 'data/NPP_atlas.csv';

    function decode(buffer) {
        try {
            return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        } catch (e) {
            return new TextDecoder('windows-1250').decode(buffer);
        }
    }

    function clean(v) {
        if (v === undefined || v === null) return null;
        v = String(v).trim();
        return v === '' ? null : v;
    }

    function num(v) {
        v = clean(v);
        if (v === null) return null;
        var n = parseFloat(v.replace(/\s/g, '').replace(',', '.'));
        return isNaN(n) ? null : n;
    }

    function startApp() {
        // qgis2web.js now starts after the page has loaded, so its
        // DOMContentLoaded handlers are run as soon as they are registered.
        var origAdd = document.addEventListener;
        document.addEventListener = function (type, fn, opts) {
            if (type === 'DOMContentLoaded' && document.readyState !== 'loading') {
                setTimeout(fn, 0);
            } else {
                origAdd.call(document, type, fn, opts);
            }
        };
        var s = document.createElement('script');
        s.src = './resources/qgis2web.js';
        s.onload = s.onerror = function () { document.addEventListener = origAdd; };
        document.body.appendChild(s);
    }

    fetch(CSV_URL, { cache: 'no-cache' })
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.arrayBuffer();
        })
        .then(function (buf) {
            var text = decode(buf).replace(/^﻿/, '');
            var rows = Papa.parse(text, { header: true, skipEmptyLines: 'greedy' }).data;
            var features = [];
            rows.forEach(function (r, i) {
                var npp = clean(r['NPP']);
                var site = clean(r['Site name']);
                var link = clean(r['Article link']);
                var x = num(r['X (HTRS96)']);
                var y = num(r['Y (HTRS96)']);
                var f = new ol.Feature({
                    'fid': String(i + 1),
                    'Group': clean(r['Group']),
                    'Subgroup': clean(r['Subgroup']),
                    'NPP': npp,
                    'Site name': site,
                    'X (HTRS96)': x,
                    'Y (HTRS96)': y,
                    'Paper': clean(r['Paper']),
                    'Article link': link,
                    'Search': (npp || '') + ', ' + (site || ''),
                    'Ammended name': clean(r['Ammended name']),
                    'Link': link ? '<a href="' + link + '">link</a>' : null
                });
                if (x !== null && y !== null) {
                    f.setGeometry(new ol.geom.Point([x, y])); // HTRS96/TM = map projection
                }
                features.push(f);
            });
            jsonSource__2.addFeatures(features);
        })
        .catch(function (err) {
            console.error('Could not load ' + CSV_URL + ': ' + err);
        })
        .then(startApp);
})();
