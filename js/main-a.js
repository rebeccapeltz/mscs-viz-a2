// document.addEventListener("DOMContentLoaded", function (event) {
//     var cy = cytoscape({

//         container: document.getElementById('cy'), // container to render in

//         elements: [ // list of graph elements to start with
//             { // node a
//                 data: { id: 'a' }
//             },
//             { // node b
//                 data: { id: 'b' }
//             },
//             { // edge ab
//                 data: { id: 'ab', source: 'a', target: 'b' }
//             }
//         ],

//         style: [ // the stylesheet for the graph
//             {
//                 selector: 'node',
//                 style: {
//                     'background-color': '#666',
//                     'label': 'data(id)'
//                 }
//             },

//             {
//                 selector: 'edge',
//                 style: {
//                     'width': 3,
//                     'line-color': '#ccc',
//                     'target-arrow-color': '#ccc',
//                     'target-arrow-shape': 'triangle'
//                 }
//             }
//         ],

//         layout: {
//             name: 'grid',
//             rows: 1
//         }

//     });
// })



const yearIndex = {};
const nodes = [];
const edges = [];
const elements = [];
let selectedYear = 2011;
// const colors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)'];
const headers = ["SOURCE", "TARGET", "RATING", "TIME"];

document.addEventListener("DOMContentLoaded", () => {
    let btnGo = document.querySelector("#btn-go");
    btnGo.addEventListener("click", () => {
        let selectedMo = document.querySelector("#mo").Value();
        let selectedYr = docment.querySelector("#yr").value();
        if (selectedMo < 1 || selectedYr < 1) return;
        $.ajax({
            type: "GET",
            // url: "rating1250.txt",
            // url: "rating1new.txt",
            url: "soc-sign-bitcoinalpha.csv",
            dataType: "text",
            // success: function (data) { processData(data); }
            success: function (data) { processCyData(data); }
        });
    })
});

function getNode(id) {
    let obj = {};
    obj.data = {};
    obj.data.id = `${id}`;
    return obj;
}
function getEdge(source, target) {
    let obj = {};
    obj.data = {};
    obj.data.id = `s:${source}t:${target}`;
    obj.data.source = `${source}`;
    obj.data.target = `${target}`;
    return obj;
}



function processCyData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);

    let year;
    for (let line of allTextLines) {
        // for (let i = 0; i < allTextLines.length; i++) {
        let data = line.split(',');

        // if (data.length == headers.length) {
        year = new Date(data[3] * 1000).getFullYear();
        if (year === selectedYear) {

            let obj = {};
            obj[headers[0]] = data[0];
            obj[headers[1]] = data[1];
            obj[headers[2]] = data[2];
            obj[headers[3]] = year;
            // for (var j = 0; j < headers.length; j++) {

            //     if (j === 3) {
            //         obj[headers[j]] = year;
            //         // year = obj[headers[j]].getFullYear();
            //         // console.log(year);
            //     } else {
            //         obj[headers[j]] = data[j];
            //     }

            // }
            if (!yearIndex[year]) {
                yearIndex[year] = [];
            }

            yearIndex[year].push(obj);

        }
        // }
    }
    let nodeIndex = {};
    for (let yy of yearIndex[selectedYear]) {
        if (!nodeIndex[yy.SOURCE]) {
            let nodeObj = getNode(yy.SOURCE);
            console.log(JSON.stringify(nodeObj));
            elements.push(nodeObj);
            nodeIndex[yy.SOURCE] = true;
        }
        if (!nodeIndex[yy.TARGET]) {
            let nodeObj = getNode(yy.TARGET);
            console.log(JSON.stringify(nodeObj));
            elements.push(nodeObj);
            nodeIndex[yy.TARGET] = true;
        }

        let edgeObj = getEdge(yy.SOURCE, yy.TARGET, yy.RATING);
        // console.log(JSON.stringify(edgeObj));
        elements.push(edgeObj)
    }
    console.table(elements);
    let cy = cytoscape({

        container: document.getElementById('mynetwork'), // container to render in

        elements: elements,

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': 'blue',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 1,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],

        layout: {
            name: 'cose'
        }
    });
}
// /*
// class Node {
//     constructor(id, label) {
//         this.id = id;
//         this.label = "user:" + label;

//     }
// }

// class Edge {
//     constructor(from, to, rating) {
//         this.from = from;
//         this.to = to;
//         // this.value = rating + 10;
//         let color = {};
//         color.color = rating <= 0 ? "red" : "black";
//         this.color = color;
//         this.title = "rating: " + rating;
//     }
// }
/*
function processData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);

    let year;
    for (let i = 0; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(',');

        if (data.length == headers.length) {
            year = new Date(data[3] * 1000).getFullYear();
            if (year === selectedYear) {
                let obj = {};
                for (var j = 0; j < headers.length; j++) {
                    if (j === 3) {
                        obj[headers[j]] = year;
                        // year = obj[headers[j]].getFullYear();
                        console.log(year);
                    } else {
                        obj[headers[j]] = parseInt(data[j]);
                    }

                }
                if (!yearIndex[year]) {
                    yearIndex[year] = [];
                }

                yearIndex[year].push(obj);

            }
        }
    }

    console.log(yearIndex);
    let nodeIndex = {};
    for (let yy of yearIndex[selectedYear]) {
        if (!nodeIndex[yy.SOURCE]) {
            let nodeObj = new Node(yy.SOURCE, yy.SOURCE);
            nodes.push(nodeObj);
            nodeIndex[yy.SOURCE] = true;
        }
        if (!nodeIndex[yy.TARGET]) {
            let nodeObj = new Node(yy.TARGET, yy.TARGET);
            nodes.push(nodeObj);
            nodeIndex[yy.TARGET] = true;
        }

        let edgeObj = new Edge(yy.SOURCE, yy.TARGET, yy.RATING);
        edges.push(edgeObj);
    }
    //console.table(nodes);
    // console.table(edges);
    // create a network

    let container = document.getElementById('mynetwork');
    let vizData = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        // edges:{
        //     arrows: {
        //       to:     {enabled: true, scaleFactor:.5, type:'arrow'}
        //     }
        // },
        layout: {
            improvedLayout: false
        }
    };
    let network = new vis.Network(container, vizData, options);
}
*/