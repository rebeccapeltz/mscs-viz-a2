
const yearIndex = {};
const userTargetIndex = {};
const nodes = [];
const edges = [];
const headers = ["SOURCE", "TARGET", "RATING", "TIME"];
document.addEventListener("DOMContentLoaded", () => {
    let btnGo = document.querySelector("#btn-go");

    $.ajax({
        type: "GET",
        url: "rating1250.txt",
        // url: "rating1new.txt",
        // url: "soc-sign-bitcoinalpha.csv",
        dataType: "text",
        // success: function (data) { processData(data); }
        success: function (data) {
            processData(data);
        }
    });

    document.addEventListener("userTargetFilter",(event)=>{
        console.log(event);
        nodes.splice(0,nodes.length)
        edges.splice(0,edges.length);
        processUserTargetFilter(event.detail.nodes);
        let graphTitle = document.querySelector("#graph-title");        
        graphTitle.innerHTML = `Bitcoin relationship rating filtered by user: ${event.detail.nodes}`;
        renderChart();
    });

    btnGo.addEventListener("click", () => {
        let selectedYr = document.querySelector("#yr option:checked").value;
        let graphTitle = document.querySelector("#graph-title");
        // let selectedYmo = '2011-9';
        let selectedYear = selectedYr;
        graphTitle.innerHTML = `Bitcoin relationship rating filtered by year: ${selectedYear}`;
        
        nodes.splice(0,nodes.length)
        edges.splice(0,edges.length);
        processYearFilter(selectedYear);
        renderChart();
    })

});



class Node {
    constructor(id, label) {
        this.id = id;
        this.label = "user:" + label;
        if (id === "1" || id === "11" || id === "250"){
            this.value = 1;
            this.color = "lime";
        } else {
            this.value = 2;
        }

    }
}

class Edge {
    constructor(from, to, rating) {
        if (rating <=0){
            console.log("neg",from,to,rating);
        }
        this.from = from;
        this.to = to;
        this.color = {};
        this.color.color = rating <= 0 ? "red" : "black";
        
        this.title = "rating: " + rating;
    }
}

// process csv and create ymo and userTarget index

function processData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);

    let year, month, ymo;
    for (let line of allTextLines) {
        // for (let i = 0; i < allTextLines.length; i++) {
        let data = line.split(',');

        // if (data.length == headers.length) {
        let date = new Date(data[3] * 1000);
        year = date.getFullYear();
        month = date.getMonth();
        ymo = `${year}-${month}`;
        // if (ymo === selectedYmo) {

        let obj = {};
        obj["SOURCE"] = data[0];
        obj["TARGET"] = data[1];
        obj["RATING"] = parseInt(data[2]);
        obj["TIME"] = year;

        if (!yearIndex[year]) {
            yearIndex[year] = [];
        }
        if (!userTargetIndex[obj["TARGET"]]) {
            userTargetIndex[obj["TARGET"]] = [];
        }

        yearIndex[year].push(obj);
        userTargetIndex[obj["TARGET"]].push(obj);
        // }
    }
    console.log(userTargetIndex);
    console.table(yearIndex["2014"]);
}

function processYearFilter(selectedYmo) {
    
    let nodeIndex = {};
    if (!yearIndex[selectedYmo]) {
        alert("no data for this time period");
        return;
    }
    for (let yy of yearIndex[selectedYmo]) {
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
    console.table(edges);
    // create a network
}
function processUserTargetFilter(selectedUser) {

    let nodeIndex = {};
    if (!userTargetIndex[selectedUser]) {
        alert("no data for this target user");
        return;
    }
    for (let user of userTargetIndex[selectedUser]) {
        if (!nodeIndex[user.SOURCE]) {
            let nodeObj = new Node(user.SOURCE, user.SOURCE);
            nodes.push(nodeObj);
            nodeIndex[user.SOURCE] = true;
        }
        if (!nodeIndex[user.TARGET]) {
            let nodeObj = new Node(user.TARGET, user.TARGET);
            nodes.push(nodeObj);
            nodeIndex[user.TARGET] = true;
        }

        let edgeObj = new Edge(user.SOURCE, user.TARGET, user.RATING);
        edges.push(edgeObj);
    }
    console.table(nodes);
    // console.table(edges);
    // create a network
}

function renderChart() {
    document.getElementById("mynetwork").innerHTML="";
    let container = document.getElementById('mynetwork');
    let vizData = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges: {
            arrows: {
                to: { enabled: true, scaleFactor: .5, type: 'arrow' }
            }
        },
        layout: {
            improvedLayout: false
        }
    };
    let network = new vis.Network(container, vizData, options);
    network.on("selectNode", function (params) {
        console.log('selectNode Event:', params);
        let event = new CustomEvent('userTargetFilter', { detail: params });
        document.dispatchEvent(event);
    });
}