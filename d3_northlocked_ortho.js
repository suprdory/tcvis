

// draggable north-locked globe
// https://observablehq.com/@jnschrag/draggable-globe-in-d3

let apiurl = "https://tcvisapi.eu.pythonanywhere.com/";

//wake up server
fetch(apiurl)

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
    if (ready4click) {
        ready4click=false;
        let coords = projection.invert(d3.mouse(this))
        let getstr = apiurl + "get_tcs_lonlatr?lon=" + coords[0] + "&lat=" + coords[1] + "&r=0.5"
        // console.log(getstr)
        tracks.selectAll("path").remove()
        tracks.selectAll("circle").remove()

        // var projcoords = projection(coords);

        // tracks
        //     .append('path')
        //     // .datum(d3.path.arc(coords[0],coords[1],3,0,2*3.1415))
        //     .attr("d", path)
        //     .attr('r', 10)
        //     .style('fill', 'red');

        d3.json(getstr).then(function (data) {
            // console.log(data)
            tracks
                .append("path")
                .datum(data)
                .attr("d", path)
                .attr('fill-opacity', 0)
                .attr('stroke', 'coral')
                .attr("stroke-width", 2)
                .style("opacity", 1.0)

            let circPath = circlePath(coords[0], coords[1], 0.5)
            // console.log(circPath)
            tracks
                .append("path")
                .datum(circPath)
                .attr("d", path)
                .attr("fill", "none")
                .attr('fill-opacity', 1.0)
                .attr('stroke', 'yellow')
                .attr("stroke-width", 2.0)
                .style("opacity", 1.0)
            ready4click=true;

        })
    }
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
// .call(d3.zoom().on("zoom",()=>{

// }))


var land = svg.append("g");
var bgtracks = svg.append("g");
var tracks = svg.append("g");
var ready4click = true

d3.json("https://unpkg.com/world-atlas@1/world/110m.json").then(function (data) {
    land.selectAll(null)
        .data(topojson.feature(data, data.objects.land).features)
        .enter()
        .append("path")
        .attr("fill", "lightgreen")
        .attr("d", path);

    d3.json("./tracks.geojson").then(function (data) {
        bgtracks
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