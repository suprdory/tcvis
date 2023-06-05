// let TESTER = document.getElementById('tester');
// Plotly.newPlot(TESTER, [{
//     x: [1, 2, 3, 4, 5],
//     y: [1, 2, 4, 8, 16]
// }], {
//     margin: { t: 0 }
// });

var data = [{
    type: 'scattergeo',
    lat: [40.7127, 51.5072],
    lon: [-74.0059, 0.1275],
    mode: 'lines',
    line: {
        width: 2,
        color: 'blue'
    }
}];

var layout = {
    title: 'Tracks',
    showlegend: false,
    geo: {
        resolution: 30,
        showland: true,
        // showlakes: true,
        landcolor: 'rgb(204, 204, 204)',
        countrycolor: 'rgb(204, 204, 204)',
        lakecolor: 'rgb(255, 255, 255)',
        projection: {
            type: 'equirectangular'
        },
        coastlinewidth: 0,
        lataxis: {
            range: [-90, 90],
            showgrid: true,
            tickmode: 'linear',
            dtick: 10
        },
        lonaxis: {
            range: [0, 360],
            showgrid: true,
            tickmode: 'linear',
            dtick: 30
        }
    }
};

Plotly.newPlot('tester', data, layout);