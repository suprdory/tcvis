

// draggable north-locked globe
// https://observablehq.com/@jnschrag/draggable-globe-in-d3

let apiurl = "https://tcvisapi.eu.pythonanywhere.com/";


let width = d3.select("#map").node().getBoundingClientRect().width;
let height = 800;
const sensitivity = 75;

let projection = d3.geoOrthographic()
    .scale(450)
    .center([0, 0])
    .rotate([-120, -10])
    .translate([width / 2, height / 2]);


const initialScale = projection.scale()
let path = d3.geoPath().projection(projection)

let svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// var g = svg.append("g");

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


svg.on("mousedown", function () {
    let clickcoords = projection.invert(d3.mouse(this))
    let getstr = apiurl + "get_tcs_lonlatr?lon=" + clickcoords[0] + "&lat=" + clickcoords[1] + "&r=0.5"
    // console.log(getstr)

    svg.selectAll("d.path").remove()
    d3.json(getstr).then(function (data) {
        svg
            .append("path")
            .datum(data)
            .attr("d", path)
            .attr('fill-opacity', 0)
            .attr('stroke', 'coral')
            .attr("stroke-width", 2)
    })
})

svg.call(d3.drag().on('drag', () => {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
        rotate[0] + d3.event.dx * k,
        rotate[1] - d3.event.dy * k
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
}))
    .call(d3.zoom().on('zoom', () => {
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

d3.json("https://unpkg.com/world-atlas@1/world/110m.json").then(function (data) {
    svg.selectAll(null)
        .data(topojson.feature(data, data.objects.land).features)
        .enter()
        .append("path")
        .attr("fill", "lightgreen")
        .attr("d", path);

    d3.json("./tracks.geojson").then(function (data) {
        svg
            // .selectAll(null)
            .append("path")
            .datum(data)
            .attr("d", path)
            .attr('fill-opacity', 0)
            .attr('stroke', 'black')
            .attr("stroke-width", 1)
            .style("opacity", 0.5)
    })
}
)


// d3.image('./bitmapRacer.png')
//     .then(function (image) {
//         console.log(image)
//         d3.select("#map")
//             .append("image")
//             .attr("xlink:href", image.href)
//             .attr("width", image.width)
//             .attr("height", image.height);
//         d3.select("image")
//             .attr("x", 100)
//             .attr("y", 100)
//             .attr("width", 200)
//             .attr("height", 200)
//     })


//    var point;
//    if (mousePoint) point = svg.insert("path", ".foreground")
//              .datum({type: "Point", coordinates: projection.invert(d3.mouse(this))})
//              .attr("class", "point")
//              .attr("d", path); // add back the point
// })