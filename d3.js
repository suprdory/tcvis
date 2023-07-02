

// draggable north-locked globe
// https://observablehq.com/@jnschrag/draggable-globe-in-d3

let apiurl = "https://tcvisapi.eu.pythonanywhere.com/";
// let apiurl = "http://127.0.0.1:5000/";
//wake up server
fetch(apiurl)

let width = d3.select("#map").node().getBoundingClientRect().width;
let height = 500;
const sensitivity = 75;

var coords0 = [120, 10]
var coords = [coords0[0], coords0[1]] // selection coords, map init coords

let projection = d3.geoOrthographic()
    .scale(200)
    .center([0, 0])
    .rotate([-coords[0], -coords[1]])
    .translate([width / 2, height / 2]);


const initialScale = projection.scale()
let path = d3.geoPath().projection(projection)

let svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

let globe = svg.append("circle")
    .attr("fill", "lightblue")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.2")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", initialScale)
    .style("opacity", 0.8)

const graticule = d3.geoGraticule()
svg.append("path")
    .datum(graticule())
    .attr("class", "graticule")
    .attr("d", path)
    .attr('fill', 'none')
    .attr('stroke', '#cccccc')
    .attr('stroke-width', '0.5px');


svg.on("click", function () {
    coords = projection.invert(d3.mouse(this))
    updateData();
}
)


function updateData() {
    if (obsReady & simReady) {
        spinner.style.visibility = "visible"

        let getobsstr = apiurl + "get_obs_lonlatr?lon=" + coords[0] + "&lat=" + coords[1] + "&r=" + selRad
        let getsimstr = apiurl + "get_sim_lonlatr?lon=" + coords[0] + "&lat=" + coords[1] + "&r=" + selRad

        obstracks.selectAll("path").remove()
        simtracks.selectAll("path").remove()
        targetcirc.selectAll('*').remove()
        obsReady = false;
        simReady = false;
        eraseGraph();

        d3.json(getsimstr).then(function (data) {
            data.forEach(d => {
                let trackDat = JSON.parse(JSON.parse(d)['tracks']);
                let rprvDat = JSON.parse(JSON.parse(d)['rprv']);
                plotTracks(trackDat, 2, 'coral', simtracks, 0.2)
                plotgraph(rprvDat, 2.0, 'coral', simlines);
            });
            simReady = true;
            if (obsReady) {
                spinner.style.visibility = "hidden"
            }
        })
        d3.json(getobsstr).then(function (data) {
            let trackDat = JSON.parse(data['tracks'])
            let rprvDat = JSON.parse(data['rprv'])

            plotTracks(trackDat, 2, 'yellow', obstracks)
            plotgraph(rprvDat, 4.0, 'yellow', obslines)
            plotCirc(coords, selRad)

            obsReady = true;
            if (simReady) {
                spinner.style.visibility = "hidden"
            }

        })
    }
}


function plotCirc(coords, r) {
    targetcirc
        .append("path")
        .datum(circlePath(coords[0], coords[1], r))
        .attr("d", path)
        .attr("fill", "none")
        .attr('fill-opacity', 1.0)
        .attr('stroke', 'black')
        .attr("stroke-width", 2.0)
        .style("opacity", 1.0)
}

function plotTracks(trackDat, lw, col, targel, opacity = 1.0) {
    targel
        .append("path")
        .datum(trackDat)
        .attr("d", path)
        .attr('fill-opacity', 0)
        .attr('stroke', col)
        .attr("stroke-width", lw)
        .style("opacity", opacity)
}

// svg.call(d3.drag().on('drag', () => {
//     const rotate = projection.rotate()
//     const k = sensitivity / projection.scale()
//     projection.rotate([
//         rotate[0] + d3.event.dx * k,
//         rotate[1] - d3.event.dy * k
//     ])
//     path = d3.geoPath().projection(projection)
//     svg.selectAll("path").attr("d", path)
// }))

svg.call(d3.zoom().on('zoom', () => {
    if (d3.event.transform.k > 0.3) {
        projection.scale(initialScale * d3.event.transform.k)
        path = d3.geoPath().projection(projection)
        svg.selectAll("path").attr("d", path)
        globe.attr("r", projection.scale())
    }
    else {
        d3.event.transform.k = 0.3
    }
}))

// let zoom = d3.zoom()
//     .on('zoom', handleZoom);

// function handleZoom() {
//     // log('e:',e)
//     d3.select('svg g')
//         // .attr('transform', d3.event.transform);
//     // log(d3.event.transform)
// // }
//     projection.scale(initialScale * d3.event.transform.k)
//         path = d3.geoPath().projection(projection)
//         svg.selectAll("path").attr("d", path)
//         globe.attr("r", projection.scale())

//     log(d3.event.transform)
//     // const rotate = projection.rotate()
//     // const k = sensitivity / projection.scale()
//     projection.rotate([
//          d3.event.transform.x-coords0[0] ,
//         - d3.event.transform.y-coords0[1],
//     ])
//     path = d3.geoPath().projection(projection)
//     svg.selectAll("path").attr("d", path)
// }
// function initZoom() {
//     svg
//         .call(zoom);
// }
// initZoom()



var spinner = document.getElementById("spinner")
spinner.style.visibility = "hidden"
var land = svg.append("g");
var bgtracks = svg.append("g");
var simtracks = svg.append("g");
var obstracks = svg.append("g");
var targetcirc = svg.append("g");
var obsReady = true;
var simReady = true;

var selRad = 1.0 // selection radius in degs
document.getElementById("sliderText").innerHTML = "Selection Radius: " + selRad.toFixed(1) + '°';

document.getElementById("radslider").onchange = function () {
    selRad = this.value;
    updateData();
    // console.log(this.value)
};

document.getElementById("radslider").oninput = function () {
    selRad = parseFloat(this.value);
    document.getElementById("sliderText").innerHTML = "Selection Radius: " + selRad.toFixed(1) + '°';
    targetcirc.selectAll('*').remove()
    plotCirc(coords, selRad)
    // updateData();
    // console.log(this.value)
};


d3.json("https://unpkg.com/world-atlas@1/world/50m.json").then(function (data) {
    land.selectAll(null)
        .data(topojson.feature(data, data.objects.land).features)
        .enter()
        .append("path")
        .attr("fill", "lightgreen")
        .attr("d", path);

    // d3.json("./tracks.geojson").then(function (data) {
    //     plotTracks(data,1,'black',bgtracks,0.5)

    // })

}

)

function circlePath(x0, y0, r) {
    let n = 20;
    let dth = 2 * 3.1415 / n
    let coords = []
    for (let i = 0; i <= n; i++) {
        coords.push([
            x0 + r * Math.cos(i * dth),
            y0 + r * Math.sin(i * dth)]
        )
    }
    return { "type": "LineString", "coordinates": coords }
}

var log = console.log





// set up line graph
// set the dimensions and margins of the graph
// var gwidth = d3.select("#map").node().getBoundingClientRect().width;
var gmargin = { top: 10, right: 30, bottom: 38, left: 60 }
var gwidth = d3.select("#graph").node().getBoundingClientRect().width - gmargin.left - gmargin.right
var gheight = 250 - gmargin.top - gmargin.bottom

// append the svg object to the body of the page
var svgg = d3.select("#graph")
    .append("svg")
    .attr("width", gwidth + gmargin.left + gmargin.right)
    .attr("height", gheight + gmargin.top + gmargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + gmargin.left + "," + gmargin.top + ")");

var simlines = svgg.append('g')
var obslines = svgg.append('g')

function plotgraphAxes() {
    // X label
    svgg.append('text')
        .attr('transform', 'translate(' + gwidth / 2 + ',' + (gheight + 35) + ')rotate(0)')
        .attr('text-anchor', 'middle')
        .style('fill', 'coral')
        .text('Return Period (y)');

    // Y label
    svgg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-30,' + gheight / 2 + ')rotate(-90)')
        .style('fill', 'coral')
        .text('Vmax (m/s)');

    //x-axis
    var xScale = d3.scaleLog()
        .domain([1, 45])
        .range([0, gwidth])
    let logFormat10alt = xScale.tickFormat(10, "")
    svgg.append("g")
        .attr("transform", "translate(0," + gheight + ")")
        .call(d3.axisBottom(xScale).ticks(10, logFormat10alt));
    //y-axis
    var yScale = d3.scaleLinear()
        .domain([18, 90])
        .range([gheight, 0]);
    svgg.append("g")
        .call(d3.axisLeft(yScale));



    return { 'xScale': xScale, 'yScale': yScale }

}
function plotgraph(data, lw, col, targel) {
    // log(data)
    targel
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", col)
        .attr("stroke-width", lw)
        .attr("d", d3.line()
            .x(function (d) { return rvplot['xScale'](d[0]) })
            .y(function (d) { return rvplot['yScale'](d[1]) })
        )
}
function eraseGraph() {
    obslines.selectAll("path").remove()
    simlines.selectAll("path").remove()
}
let rvplot = plotgraphAxes();

// let im
// d3.image('./bitmapRacer.png')
//     .then(function (image) {
//         console.log(image)
//         im=simtracks
//             .append("svg:image")
//             // .attr("d", path)
//             .attr("xlink:href", image.href)
//             // .attr("width", image.width)
//             // .attr("height", image.height)
//             .attr('preserveAspectRatio', 'none')
//             .attr("x", 0)
//             .attr("y", 0)
//             .attr("width", 20)
//             .attr("height", 20)
//         // log(im)
//     }
//     )
