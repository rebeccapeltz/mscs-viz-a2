
const yearIndex = {};
const userTargetIndex = {};
const nodes = [];
const edges = [];

// const colors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)'];
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
        processUserTargetFilter(event.detail.nodes);
        renderChart();
    });

    btnGo.addEventListener("click", () => {
        let selectedMo = document.querySelector('#mo option:checked').value;
        let selectedYr = document.querySelector("#yr option:checked").value;
        let selectedYmo = '2011-9';
        processYmoFilter(selectedYmo);
        renderChart();
    })

});



class Node {
    constructor(id, label) {
        this.id = id;
        this.label = "user:" + label;

    }
}

class Edge {
    constructor(from, to, rating) {
        this.from = from;
        this.to = to;
        // this.value = rating + 10;
        let color = {};
        color.color = rating <= 0 ? "red" : "black";
        this.color = color;
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
        obj["RATING"] = data[2];
        obj["TIME"] = ymo;

        if (!yearIndex[ymo]) {
            yearIndex[ymo] = [];
        }
        if (!userTargetIndex[obj["TARGET"]]) {
            userTargetIndex[obj["TARGET"]] = [];
        }

        yearIndex[ymo].push(obj);
        userTargetIndex[obj["TARGET"]].push(obj);
        // }
    }
    console.log(userTargetIndex);
}

function processYmoFilter(selectedYmo) {

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
    // console.table(edges);
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