var margin = 0,
  diameter = 600;

var color = d3.scale.linear().domain([-1, 5]).range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"]).interpolate(d3.interpolateHcl);

var pack = d3.layout.pack().padding(2).size([diameter - margin, diameter - margin]).value(function (d) {
  return d.size;
});

var svg = d3.select("#bubble").append("svg").attr("width", diameter).attr("height", diameter).append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

// change to get data directly from rest service, (not doing it now because hosting in firebase free version does not allow to access outside services)

// d3.xml("http://gin2k.bigknowledge.net/bokonto/services/complete?format=customxml", "application/xml", function (bokXML) {
/* 
d3.xml("assets/xml/saved-bok.xml", "application/xml", function (bokXML) {
    // change below bokXML == null to get the bok from web service
    if (bokXML != null) {//if service is not available either use cached version or just display error:
        var bokData = parseBOKData(bokXML);  //--> refer to bok_datamodel.js
        return displayBOK(bokData); //--> refer to bok_visualization.js
    }
    ;
});
*/

// load the external data
d3.json("assets/json/eo4geoBOKv6.json", function (error, treeData) {
  if (!error) {
    var bokData = parseBOKDataJSON(treeData); //--> refer to bok_datamodel.js
    displayBOK(bokData);
  } else {
    console.log("Error: " + error)
  }
});

d3.select(self.frameElement).style("height", diameter + "px");
