

// draggable north-locked globe
// https://observablehq.com/@jnschrag/draggable-globe-in-d3

let apiurl = "https://tcvisapi.eu.pythonanywhere.com/";

//wake up server
fetch(apiurl)

let width = d3.select("#map").node().getBoundingClientRect().width;
let height = 500;
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
        ready4click = false;
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
            ready4click = true;

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
// .on('wheel.zoom',()=>{
//     if (d3.event.transform.k > 0.3) {
//         projection.scale(initialScale * d3.event.transform.k)
//         path = d3.geoPath().projection(projection)
//         svg.selectAll("path").attr("d", path)
//         globe.attr("r", projection.scale())
//     }
//     else {
//         d3.event.transform.k = 0.3
//     }
// })


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

    // d3.json("./tracks.geojson").then(function (data) {
    //     bgtracks
    //         // .selectAll(null)
    //         .append("path")
    //         .datum(data)
    //         .attr("d", path)
    //         .attr('fill-opacity', 0)
    //         .attr('stroke', 'black')
    //         .attr("stroke-width", 1)
    //         .style("opacity", 0.5)
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

// d3.image('./bitmapRacer.png')
//     .then(function (image) {
//         console.log(image)
//         tracks
//             .append("image")
//             .attr("d", path)
//             .attr("xlink:href", image.href)
//             .attr("width", image.width)
//             .attr("height", image.height)
//             .attr("x", 10)
//             .attr("y", 10)
//             .attr("width", 200)
//             .attr("height", 200)
//     })






var log=console.log
// set up line graph
// set the dimensions and margins of the graph
var gmargin = { top: 10, right: 30, bottom: 35, left: 60 }
var gwidth = 500 - gmargin.left - gmargin.right
var gheight = 400 - gmargin.top - gmargin.bottom

// append the svg object to the body of the page
var svgg = d3.select("#graph")
    .append("svg")
    .attr("width", gwidth + gmargin.left + gmargin.right)
    .attr("height", gheight + gmargin.top + gmargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + gmargin.left + "," + gmargin.top + ")");

//create test data
let dat = { 'x': [3.125, 6.25, 12.5, 25, 50], 'y': [30, 40, 50, 60, 70] }
function vec2pairs(vecs){
    let pairs=[]
    for (let i=0;i<vecs.x.length;i++){
        pairs.push([vecs.x[i],vecs.y[i]])
    }
    return pairs
}
let datPairs=vec2pairs(dat)


// Now I can use this dataset:
function plotgraph(data) {
    log(data)
    // log(data)
    // Add X axis --> it is a date format

    svgg.append('text')
        .attr('x', gwidth / 2 )
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .text('Line Chart');

    // X label
    svgg.append('text')
        .attr('transform', 'translate('+gwidth/2+',' + (gheight+35) + ')rotate(0)')
        .attr('text-anchor', 'middle')
        .style('fill', 'coral')
        .text('Return Period (y)');

    // Y label
    svgg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-30,' + gheight/2 + ')rotate(-90)')
        .style('fill','coral')
        .text('Vmax (m/s)');


//x-axis
    var xScale = d3.scaleLog()
        .domain([2,60])
        .range([0, gwidth])
    let logFormat10alt = xScale.tickFormat(10, "")
    svgg.append("g")
        .attr("transform", "translate(0," + gheight + ")")
        .call(d3.axisBottom(xScale).ticks(10, logFormat10alt));
//y-axis
    var yScale = d3.scaleLinear()
        .domain([0, 80])
        .range([gheight, 0]);
    svgg.append("g")
        .call(d3.axisLeft(yScale));


    // Add the line
    svgg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line") 
        .attr("stroke", "lightblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xScale(d[0]) })
            .y(function (d) { return yScale(d[1]) })
        )

}
plotgraph(datPairs)



function LineChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    defined, // for gaps in data
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleUtc, // the x-scale type
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // the y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // stroke color of line
    strokeLinecap = "round", // stroke line cap of the line
    strokeLinejoin = "round", // stroke line join of the line
    strokeWidth = 1.5, // stroke width of line, in pixels
    strokeOpacity = 1, // stroke opacity of line
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I));

    return svg.node();
}