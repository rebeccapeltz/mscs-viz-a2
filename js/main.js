const data = [];
const headers = ["SOURCE", "TARGET", "RATING", "TIME"];
document.addEventListener("DOMContentLoaded", (event) => {
    $.ajax({
        type: "GET",
        url: "rating1.csv",
        dataType: "text",
        success: function (data) { processData(data); }
    });
})

function processData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);
   
    var lines = [];

    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            let obj = {};
            for (var j = 0; j < headers.length; j++) {
                
                if (j === 3) {
                    obj[headers[j]] = new Date(data[j] * 1000);
            
                } else {
                    obj[headers[j]] = parseInt(data[j]);
                }
         
            }
            lines.push(obj);
        }
    }
    console.table(lines);
}