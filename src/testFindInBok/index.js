var d3 = require("d3");
  
//version array
var storedVersions = {};

var Relationtype = {
  SIMILAR: "similarTo",
  PREREQUISITE: "prerequisites",
  POSTREQUISITE: "postrequisites",
  BROADER: "broader",
  NARROWER: "narrower",
  DEMONSTRATES: "demonstrates",
  SUBCONCEPT: "is subconcept of",
  SIMILARTO: "is similar to",
  PREREQUISITEOF: "is prerequisite of"
};

// d3-compliant java object node with default values:
CostumD3Node = function () {
  this.name;
  //field required by D3
  this.nameShort = "";
  this.description = "";
  this.size = 100;
  //field required by D3, equals super-concept:
  this.parent = null;
  this.otherParents = [];
  this.additionalParents = [];
  //field required by D3, equals subconcepts
  this.children = [];
  //other relations equal to 'relationtype'
  this.prerequisites = [];
  this.postrequisites = [];
  this.similarConcepts = [];
  this.demonstrableSkills = [];
  //Source documents are not retrieved by the XML
  this.sourceDocuments = [];
  this.contributors = [];
  this.uri = "";

  //field required to discard the old one when notation is repeated
  this.timestamp = "";
};

CostumD3NodeCollection = function () {
  this.nodes = [];
};

var cD3NCollection = new CostumD3NodeCollection();

CostumD3NodeCollection.prototype.add = function (node) {
  this.nodes.push(node);
};

CostumD3NodeCollection.prototype.pop = function () {
  this.nodes.pop();
};

CostumD3NodeCollection.prototype.getNodeByURI = function (uri) {
  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i].id.split("_rev")[0] == uri) {
      return this.nodes[i];
    }
  }
  return null;
};

CostumD3NodeCollection.prototype.getNodeByNameShort = function (nameShort) {
  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i].nameShort == nameShort) {
      return this.nodes[i];
    }
  }
  return null;
};

/* FOR SEARCH FUNCTIONALITY */
CostumD3NodeCollection.prototype.getNodesByKeyword = function (keyword, searchCode = true, searchName = true, searchDes = true, searchSkills = true) {
  var result = []
  keyword = keyword.toUpperCase();
  if (searchCode) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].nameShort.toUpperCase().indexOf(keyword) > -1) {
        if (!result.includes(this.nodes[i])) {
          result.push(this.nodes[i]);
        }
      }
    }
  }
  if (searchName) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name && this.nodes[i].name.toUpperCase().indexOf(keyword) > -1) {
        if (!result.includes(this.nodes[i])) {
          result.push(this.nodes[i]);
        }
      }
    }
  }
  if (searchSkills) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].demonstrableSkills != null && this.nodes[i].demonstrableSkills != "" && this.nodes[i].demonstrableSkills.length > 0) {
        for (var j = 0; j < this.nodes[i].demonstrableSkills.length; j++) {
          if (this.nodes[i].demonstrableSkills[j].description.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
              result.push(this.nodes[i]);
            }
          }
        }
      }
    }
  }
  if (searchDes) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].description != null && this.nodes[i].description != "") {
        if (this.nodes[i].description.toUpperCase().indexOf(keyword) > -1) {
          if (!result.includes(this.nodes[i])) {
            result.push(this.nodes[i]);
          }
        }
      }
    }
  }
  return result;
};

/* FOR SEARCH FUNCTIONALITY */
CostumD3NodeCollection.prototype.getNodesIdByKeyword = function (keyword, searchCode = true, searchName = true, searchDes = true, searchSkills = true) {
  var result = [];
  keyword = keyword.toUpperCase();
  if (searchCode) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].nameShort.toUpperCase().indexOf(keyword) > -1) {
        if (!result.includes(this.nodes[i])) {
          result.push(this.nodes[i].id);
        }
      }
    }
  }
  if (searchName) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name && this.nodes[i].name.toUpperCase().indexOf(keyword) > -1) {
        if (!result.includes(this.nodes[i])) {
          result.push(this.nodes[i].id);
        }
      }
    }
  }
  if (searchSkills) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].demonstrableSkills != null && this.nodes[i].demonstrableSkills != "" && this.nodes[i].demonstrableSkills.length > 0) {
        for (var j = 0; j < this.nodes[i].demonstrableSkills.length; j++) {
          if (this.nodes[i].demonstrableSkills[j].description.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
              result.push(this.nodes[i].id);
            }
          }
        }
      }
    }
  }
  if (searchDes) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].description != null && this.nodes[i].description != "") {
        if (this.nodes[i].description.toUpperCase().indexOf(keyword) > -1) {
          if (!result.includes(this.nodes[i])) {
            result.push(this.nodes[i].id);
          }
        }
      }
    }
  }
  return result;
};

exports.parseBOKData = function (bokJSON) {

  var allNodes = [];
  var namehash = {};
  var colorhash = {
    GI: "#40e0d0",
    IP: "#1f77b4",
    CF: "#aec7e8",
    CV: "#ff7f0e",
    DA: "#ffbb78",
    DM: "#2ca02c",
    DN: "#98df8a",
    PS: "#d62728",
    GD: "#cc5b59",
    GS: "#9467bd",
    AM: "#8c564b",
    MD: "#8c564b",
    OI: "#c49c94",
    GC: "#e377c2",
    PP: "#f7b6d2",
    SD: "#7f7f7f",
    SH: "#c7c7c7",
    TA: "#bcbd22",
    WB: "#07561e",
    no: "#17becf"
  };

  // loop all nodes
  for (var n = 0; n < bokJSON.concepts.length; n++) {
    var newNode = new CostumD3Node();
    newNode.name = bokJSON.concepts[n].name;
    newNode.nameShort = bokJSON.concepts[n].code;
    newNode.description = bokJSON.concepts[n].description;
    newNode.selfAssesment = bokJSON.concepts[n].selfAssesment;
    newNode.uri = n;
    newNode.id = n;
    newNode.children = [];
    newNode.demonstrableSkills = [];
    newNode.sourceDocuments = [];
    newNode.contributors = [];
    newNode.parent = null;
    newNode.otherParents = [];
    newNode.similarConcepts = [];
    namehash[bokJSON.concepts[n].code] = newNode.name;
    allNodes.push(newNode);
  }

  for (var l = 0; l < bokJSON.relations.length; l++) {
    // children - parent relation
    if (bokJSON.relations[l].name == Relationtype.SUBCONCEPT) {
      if ( allNodes[bokJSON.relations[l].source].parent != null ) {
        allNodes[bokJSON.relations[l].source].otherParents.push(allNodes[bokJSON.relations[l].target]);
      } else {
        allNodes[bokJSON.relations[l].source].parent = allNodes[bokJSON.relations[l].target];
      }
      //push node into childre array
      allNodes[bokJSON.relations[l].target].children.push(allNodes[bokJSON.relations[l].source]);
      // add parent

    }
    if (bokJSON.relations[l].name == Relationtype.SIMILARTO) {
      //push node into childre array
      allNodes[bokJSON.relations[l].target].similarConcepts.push(allNodes[bokJSON.relations[l].source]);
      allNodes[bokJSON.relations[l].source].similarConcepts.push(allNodes[bokJSON.relations[l].target]);
    }
    if (bokJSON.relations[l].name == Relationtype.PREREQUISITEOF) {
      //push node into childre array
      allNodes[bokJSON.relations[l].target].prerequisites.push(allNodes[bokJSON.relations[l].source]);
      //allNodes[bokJSON.relations[l].source].prerequisites.push(allNodes[bokJSON.relations[l].target]);
    }
  }

  for (var o = 0; o < bokJSON.skills.length; o++) {
    for (var s = 0; s < bokJSON.skills[o].concepts.length; s++) {
      var node = bokJSON.skills[o].concepts[s];
      var skill = {};
      skill.description = bokJSON.skills[o].name;
      skill.nameShort = bokJSON.skills[o].name;
      skill.uri = bokJSON.skills[o].name;
      allNodes[node].demonstrableSkills.push(skill);
    }
  }

  for (var e = 0; e < bokJSON.references.length; e++) {
    for (var s = 0; s < bokJSON.references[e].concepts.length; s++) {
      var node = bokJSON.references[e].concepts[s];
      var sourceDoc = {};
      sourceDoc.description = bokJSON.references[e].description;
      sourceDoc.nameShort = bokJSON.references[e].name;
      sourceDoc.url = bokJSON.references[e].url;
      allNodes[node].sourceDocuments.push(sourceDoc);
    }
  }

  if ( typeof bokJSON.contributors != "undefined") {
    for (var e = 0; e < bokJSON.contributors.length; e++) {
      for (var s = 0; s < bokJSON.contributors[e].concepts.length; s++) {
        var node = bokJSON.contributors[e].concepts[s];
        var cont = {};
        cont.description = bokJSON.contributors[e].description;
        cont.nameShort = bokJSON.contributors[e].name;
        cont.url = bokJSON.contributors[e].url;
        allNodes[node].contributors.push(cont);
        allNodes[node].contributors.sort();
      }
    }
  }

  var cD3N = new CostumD3NodeCollection();
  for (var i in allNodes) {
    cD3N.add(allNodes[i]);
  }

  return {
    nodes: allNodes[0],
    relations: bokJSON.relations,
    namehash: namehash,
    conceptNodeCollection: cD3N,
    colors: colorhash
  };

};

exports.visualizeBOKData = function (svgId, url, textId, numVersion, oldVersion, textToAlert, yearCurrentVersion, yearVersion) {
  var codSelected = "GIST";
  var currentVersion = numVersion;
  var isAnOldVersion = false;
  var isAnObsoleteId = false;
  var yearCurrentVersion = yearCurrentVersion;
  var yearVersion = yearVersion;
  if (oldVersion !== null && numVersion != oldVersion && textToAlert == 'red') {
    numVersion = oldVersion;
    isAnOldVersion = true;
  }
  if (textToAlert == 'orange') {
    numVersion = oldVersion;
    isAnObsoleteId = true;
  }
  var COLOR_STROKE_SELECTED = "black";
  var svg = d3.select("div" + svgId)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 300")
    .classed("svg-content", true);

  var margin = 5,
    diameter = svg.node().getAttribute('viewBox').split(" ")[2],
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);
  d3.json(url + 'v' + numVersion + '.json ').then((root, error) => {

    var bokData = exports.parseBOKData(root);
    if (error) throw error;

    dataAndFunctions = function () {
      this.conceptNodeCollection = null;
      this.zoom = null;
      this.namehash = null;
      this.colorhash = null;
      this.nodes = null;
    };

    dataAndFunctions.conceptNodeCollection = bokData.conceptNodeCollection;
    dataAndFunctions.namehash = bokData.namehash;
    dataAndFunctions.colorhash = bokData.colors;

    root = d3.hierarchy(bokData.nodes)
      .sum(function (d) {
        return d.size;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    var focus = root,
      nodes = pack(root).descendants(),
      view;

    dataAndFunctions.nodes = nodes;

    var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", function (d) {
        return d.r;
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .attr("id", function (d) {
        return d.data.id;
      })
      .attr("class", function (d) {
        return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
      })
      .style("fill", function (d) {
        if (d.depth == 1) {
          return dataAndFunctions.colorhash[d.data.nameShort.substring(0, 2)] ? dataAndFunctions.colorhash[d.data.nameShort.substring(0, 2)] : dataAndFunctions.colorhash['no'];
        } else if (d.depth == 2) {
          return dataAndFunctions.colorhash[d.parent.data.nameShort.substring(0, 2)] ? dataAndFunctions.colorhash[d.parent.data.nameShort.substring(0, 2)] : dataAndFunctions.colorhash['no'];
        } else if (d.depth == 3) {
          return dataAndFunctions.colorhash[d.parent.data.nameShort.substring(0, 2)] ? dataAndFunctions.colorhash[d.parent.data.nameShort.substring(0, 2)] : dataAndFunctions.colorhash['no'];
        } else if (d.depth >= 4) {
          return dataAndFunctions.colorhash[d.parent.parent.parent.data.nameShort.substring(0, 2)] ? dataAndFunctions.colorhash[d.parent.parent.parent.data.nameShort.substring(0, 2)] : dataAndFunctions.colorhash['no'];
        } else {
          return "turquoise";
        }
      }).style("fill-opacity", function (d) {
        if (d.depth >= 1) {
          return "0.5";
        } else {
          return "1";
        }
      }).attr("stroke", "black")
      .attr("stroke-width", "0.2px")
      .on("click", function (d) {
        if (focus !== d) {
          dataAndFunctions.zoom(d);
          codSelected = d.data.nameShort;
          exports.displayConcept(d);
        }
        d3.event.stopPropagation();
      })
      .on("mouseover", function (d) {
        if (this.style.stroke != COLOR_STROKE_SELECTED) this.style.strokeWidth = 1
      })
      .on("mouseleave", function (d) {
        if (this.style.stroke != COLOR_STROKE_SELECTED) this.style.strokeWidth = 0.2
      });

    var text = g.selectAll("text").data(nodes).enter().append("text").attr("class", "label").style("pointer-events", "none").style("fill-opacity", function (d) {
      return d.parent === root || (d === root && d.children == null) ? 1 : 0;
    })
      .style("display", function (d) {
        return d.parent === root || (d === root && d.children == null) ? "inline" : "none";
      })
      .style("font", '500 7px "Helvetica Neue", Helvetica, Arial, sans-serif')
      .each(function (d) { //This function inserts a label and adds linebreaks, avoiding lines > 13 characters
        var arr = d.data.name.split(" ");
        var arr2 = [];
        arr2[0] = arr[0];
        var maxLabelLength = 13;
        for (var i = 1, j = 0; i < arr.length; i++) {
          if (arr2[j].length + arr[i].length < maxLabelLength)
            arr2[j] += " " + arr[i];
          else {
            j++;
            arr2[j] = arr[i];
          }
        }
        for (var i = 0; i < arr2.length; i++) {
          d3.select(this).append("tspan").text(arr2[i]).attr("dy", i ? "1em" : (-0.5 * (j - 1)) + "em").attr("x", 0).attr("text-anchor", "middle").attr("class", "tspan" + i);
        }
      });


    var node = g.selectAll("circle,text");

    svg
      .style("background", "transparent")
      .on("click", function () {
        dataAndFunctions.zoom(root);
      });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    dataAndFunctions.zoom = function zoom(d) {
      var focus0 = focus;
      focus = d;

      var transition = d3.transition()
        .duration(d3.event && d3.event.altKey ? 7500 : 750)
        .tween("zoom", function (d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function (t) {
            zoomTo(i(t));
          };
        });

      transition.selectAll("text")
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline" || (d === focus && (d.children == null || d.children == []));
        })
        .style("fill-opacity", function (d) {
          return d.parent === focus || (d === focus && (d.children == null || d.children == [])) ? 1 : 0;
        })
        .on("start", function (d) {
          if (d.parent === focus || (d === focus && (d.children == null || d.children == [])))
            this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus && (d !== focus && (d.children == null || d.children == [])))
            this.style.display = "none";
        });
    }

    function zoomTo(v) {
      var k = diameter / v[2];
      view = v;
      node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function (d) {
        return d.r * k;
      });

    }

    var nodeData = dataAndFunctions.conceptNodeCollection.getNodeByNameShort("GIST");
    exports.displayConcept(nodeData);
  });

  //displays all available content for the currently focussed concept in the description box:
  exports.displayConcept = function (d) {
    if (textId != null) {

      if (textId[0] == "#")
        textId = textId.split("#")[1];

      var oldD = d;
      if (d && d.data)
        d = d.data;

      var mainNode = document.getElementById(textId)
      mainNode.innerHTML = "";

      var titleNode = document.createElement("h4");
      titleNode.id = "boktitle";
      titleNode.attributes = "#boktitle";
      titleNode.innerHTML = "[" + d.nameShort + "] " + d.name; //display Name and shortcode of concept:
      titleNode.style="margin-bottom: 0px;";
      window.history.pushState("object or string", "Find In Bok", "/" + d.nameShort);
      var pNode = document.createElement("p");
      pNode.innerHTML = "Permalink: <a href= 'https://bok.eo4geo.eu/" + d.nameShort + "'> https://bok.eo4geo.eu/" + d.nameShort + "</a>";
      mainNode.appendChild(pNode);
      mainNode.appendChild(titleNode);
      if ( d.selfAssesment ){
        var statusNode = document.createElement("div");
        statusNode.innerHTML=d.selfAssesment;
        let statusText = document.createElement("div");
        statusText.innerHTML= 'Status: ' + statusNode.innerText;
        statusText.style="margin-bottom: 10px;";
        mainNode.appendChild(statusText);
      }
      if (isAnOldVersion) {
        const obsNode = document.createElement('p');
        let textObs = '';
        let currentLink = "<a style='color: red; font-weight: normal; cursor: pointer; text-decoration: underline;' href='https://bok.eo4geo.eu/'> the current version of the BoK </a>"
        textObs += '<span style="color: red; font-weight: normal;">warning: this is an obsolete BoK concept - this concept is no longer present in ' + currentLink + '</span>';
        obsNode.innerHTML = textObs;
        mainNode.appendChild(obsNode);

      } else if (isAnObsoleteId) {
        const obsNode = document.createElement('p');
        let textObs = '';
        textObs += '<span style="color: orange; font-weight: normal;">warning: this is old version of this BoK concept; see “\Versioning”\ below for more recent version(s)</span>';
        obsNode.innerHTML = textObs;
        mainNode.appendChild(obsNode);
      }
      //display description of concept.
      var descriptionNode = document.createElement("div");
      if (d.description != null) {
        var timeFormat = "";
        if (d.timestamp != null && d.timestamp != "")
          timeFormat = "<small> Last Updated: " + new Date(d.timestamp).toUTCString() + " </small><br>";
        var headline = "<h5>Description:</h5>";
        var currentTxt = "<div id='currentDescription' class='hideContent'>" + d.description + "</div><br>";
        descriptionNode.innerHTML = timeFormat + headline + currentTxt;
      } else
        descriptionNode.innerHTML = "";

      mainNode.appendChild(descriptionNode);
      var infoNode = document.createElement("div");

      // Display hierarchy of parent concepts in a definition list:
      if (d.parent != null) {
        parents = [];
        let cont = 1;
        //trace all parents upwards from the hierarchy
        for (var p = d.parent; p != null; p = p.parent) {
          parents.push(p);
        }
        if ( d.otherParents.length > 0) cont = cont + d.otherParents.length;
        var tab = "";
        var text = "<h5>Superconcepts [" + cont + "] </h5><div><dl>";
        var parent = parents.pop();
        /* We attach the browseToConcept function in order to be able to browse to SuperConcepts
         from the concept's list browser of the right */
        text += "<a class='concept-name' style='color: #007bff; font-weight: 400; cursor: pointer;' onclick='browseToConcept(\"" + parent.nameShort + "\")'><b>-</b> " + parent.name + "</a>";
        tab += "";
        while (parents.length > 0) {
          parent = parents.pop();
          text += "<dd style='margin: 0 0 1.5em 0.8em'><dl><dt style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' onclick='browseToConcept(\"" + parent.nameShort + "\")'><b>-</b> " + "[" + parent.nameShort + "] " + parent.name + "</dt>";
          tab += "</dl></dd>";
        }
        text += tab + "</dl></div>";

        infoNode.innerHTML = text;
      } else
        infoNode.innerHTML = "";

      if ( d.otherParents.length > 0  ) {
        for ( let i = 0; i < d.otherParents.length ; i++ ){
          let otherPar = [];
          let op = d.otherParents[i];
          while ( op != null ) {
            otherPar.push(op);
            op = op.parent
          }
          var other = otherPar.pop();
          var text = "<div><dl>";
          /* We attach the browseToConcept function in order to be able to browse to SuperConcepts
           from the concept's list browser of the right */
          text += "<a class='concept-name' style='color: #007bff; font-weight: 400; cursor: pointer;' onclick='browseToConcept(" + other.nameShort + ")'><b>-</b> " + other.name + "</a>";
          tab += "";
          while (otherPar.length > 0) {
            other = otherPar.pop();
            text += "<dd style='margin: 0 0 1.5em 0.8em'><dl><dt style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' onclick='browseToConcept(\"" + other.nameShort + "\")'><b>-</b> " + "[" + other.nameShort + "] " + other.name + "</dt>";
            tab += "</dl></dd>";
          }
          text += tab + "</dl></div>";
          infoNode.innerHTML += text;
        }
      }

      window.history.pushState("object or string", "Find In Bok", "/" + d.nameShort);
      //display description of subconcepts (if any):
      displayOrderedList(d.children, "name", "Subconcepts", infoNode, "boksubconcepts");

      //display description of prerequisites (if any):
      displayOrderedList(d.prerequisites, null, "Prequisites", infoNode, "bokprequisites");

      //display description of postrequisites (if any):
      displayOrderedList(d.postrequisites, null, "Postrequisites", infoNode, "bokpostrequisites");

      //display description of similar concepts (if any):
      displayOrderedList(d.similarConcepts, null, "Similar concepts", infoNode, "boksimilar");

      //display description of demonstrable skills (if any):
      displayUnorderedList(d.demonstrableSkills, "description", "Skills", infoNode, "bokskills");

      //display contributors of concept (if any):
      displayUnorderedList(d.contributors, "url", "Contributors", infoNode, "boksource");

      //display source documents of concept (if any):
      displayUnorderedList(d.sourceDocuments, "url", "Source documents", infoNode, "boksource");



      displayVersions(d.nameShort, infoNode, numVersion, yearVersion);

      mainNode.appendChild(infoNode);

    }
  };

  //displays a list of textelements in HTML
  displayOrderedList = function (array, propertyname, headline, domElement, namehash, node) {
    if (array != null && array.length != 0) {
      // if children, sort them
      if (array[0].nameShort != null) {
        array.sort(function (a, b) {
          if (a.nameShort > b.nameShort) {
            return 1;
          }
          if (a.nameShort < b.nameShort) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      }
      var text = "";
      text += "";
      text += "<h5>" + headline + " [" + array.length + "] </h5><div><ul>";
      for (var i = 0, j = array.length; i < j; i++) {
        var nameShort;
        var value;
        if (propertyname != null) { //For Subconcepts and Demonstrable Skills
          value = array[i][propertyname];
          nameShort = array[i]['nameShort'];
        } else { //For Similar, Postrequisites and Prerequisites
          value = array[i];
          nameShort = array[i]['nameShort'];
        }
        if (namehash != null) {
          value = namehash[value];
        }

        /* We attach the browseToConcept function to each subconcept of the list */
        if (headline == "Subconcepts") {
          text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' id='sc-" + nameShort + "' onclick='browseToConcept(\"" + nameShort + "\")'>[" + nameShort + '] ' + array[i][propertyname] + "</a> <br>";
        } else if (headline == "Similar concepts" || headline == "Postrequisites" || headline == "Prequisites") {
          text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' id='sc-" + nameShort + "' onclick='browseToConcept(\"" + nameShort + "\")'>[" + nameShort + '] ' + array[i].name + "</a> <br>";
        } else {
          text += "<a>" + value + "</a> <br>";
        }
      };
      text += "</ul></div>";
      domElement.innerHTML += text;
    } //else
    //	domElement.innerHTML = "";
  };

  displayVersions = function (code, domElement, cVersion, year) {
    let textCurrent = "";
    let currentLink = "";
    let yearToshow = year;
    if (cVersion == currentVersion) {
      textCurrent = '(Current Bok Version)';
      yearToshow = yearCurrentVersion;
    } else if (isAnOldVersion) {searchOldVersions
      currentLink = '<a style="color: red; font-weight: normal; cursor: pointer; text-decoration: underline;" href="https://bok.eo4geo.eu/" > the current version of the BoK </a>'
      textCurrent = '- <span style="color: red; font-weight: normal;">warning: this is an obsolete BoK concept - this concept is no longer present in ' + currentLink + '</span>';
    } else {
      textCurrent = '- <span style="color: orange; font-weight: normal;">warning: this is old version of this BoK concept; more recent versions are listed above</span>';;
    }
    let currentCod = document.getElementById('boktitle').textContent.split(']')[0].replace('[', '');


    var text = "";
    text += "";
    text += '<h5>Versioning </h5><div id="oldVersions" style="text-indent: 2em;">';
    if (currentCod == 'GIST') currentCod = '';
    if (isAnObsoleteId) text += '- <a href="https://bok.eo4geo.eu/' + currentCod + '">version ' + currentVersion + '.0 (' + yearCurrentVersion + ') (Current Bok Version)</a>';
    text += '<p style="font-weight: bold;" >&rarr; You are viewing: version ' + cVersion + '.0 (' + yearToshow + ') ' + textCurrent + ' </p>';
    if (isAnObsoleteId) searchOldVersions(code, domElement, currentVersion - 1, cVersion);
    else {
      searchOldVersions(code, domElement, cVersion - 1, null);
    }
    text += '</div>';
    domElement.innerHTML += text;
  }

  visualizeOldBokData = function (version, year) {
    let mainNode = document.getElementById('bubbles');
    mainNode.innerHTML = "";
    exports.visualizeBOKData('#bubbles', 'https://findinbok.firebaseio.com/', '#textBoK', currentVersion, version, 'orange', yearCurrentVersion, year);
    setTimeout(() => {
      browseToConcept(codSelected);
    }, 1000);
    found = true;
  }

  //Aqui el codigo donde carga una a una
/*
  searchOldVersions = function (code, domElement, version, versionSelected) {
    let foundInOld = false;
    let text = "";
    console.log(code);
    console.log(version);
    const oldVersion = version > 1 ? version - 1 : version;
    // case when the old version selected is not the first in the list
    if (oldVersion > 0) {
      d3.json('https://findinbok.firebaseio.com/v' + version + '.json ').then((root, error) => {
        for (var n = 0; n < root.concepts.length; n++) {
          if (root.concepts[n].code == code && !foundInOld) {
            if (versionSelected !== null && versionSelected < version) {
              let lastChild = document.querySelector('#oldVersions p');
              let nodeToAdd = document.querySelector('#oldVersions');
              console.log(lastChild);
              console.log(nodeToAdd);
              let newNode = document.createElement("li");
              newNode.style = 'list-style-type:none; text-indent: 2em;';
              newNode.innerHTML = "<a style='color: #007bff; font-weight: 400; cursor: pointer; text-indent: 2em;' onclick=' visualizeOldBokData(" + version + ", " + root.creationYear + " )'> - version " + version + ".0 (" + root.creationYear + ")</a>";
              nodeToAdd.insertBefore(newNode, lastChild);
            } else if (versionSelected == null || versionSelected > version) {
              text += "<li style='list-style-type:none; text-indent: 2em;'><a style='color: #007bff; font-weight: 400; cursor: pointer; text-indent: 2em;' onclick=' visualizeOldBokData(" + version + ", " + root.creationYear + " )'> - version " + version + ".0 (" + root.creationYear + ")</a></li>";
              domElement.innerHTML += text;
            }
            foundInOld = true;
          }
        }
      });
      setTimeout(() => {
        searchOldVersions(code, domElement, version - 1, versionSelected);
      }, 1000);
    }
  }*/

  searchOldVersions = function (code, domElement, version, versionSelected) {
    console.trace();
    const url = `https://findinbok.firebaseio.com/.json?shallow=true`;
    var versionPerYear = {};
    const versionesOrdenadas = {};
    var text ="";
    d3.json(url)
    .then(keys => {
      var versionsArr = Object.keys(keys);
      const requests = versionsArr.map(key => {
        // Construye la URL para obtener los campos release_date y creation_date de cada versión
        const versionUrl = `https://findinbok.firebaseio.com/${key}/creationYear.json`;
    
        return d3.json(versionUrl)
          .then(data => {
            versionPerYear[key] = data;
          })
          .catch(error => {
            console.error(`Error al obtener datos de la versión ${key}:`, error);
          });
      });
    
      // Espera a que todas las solicitudes se completen antes de imprimir el objeto versionPerYear
      Promise.all(requests)
        .then(() => {
          storedVersions = versionPerYear;
          displayOldVersions(storedVersions, versionSelected, domElement);
        });
    })
    .catch(error => {
      console.error('Error al obtener las claves de primer nivel:', error);
    }); 
  }

  displayOldVersions = function (versionPerYear, versionSelected, domElement) {
     // Ordenar las claves
     let clavesOrdenadas = Object.keys(versionPerYear).sort((a, b) => {
      if (a === 'current') return -1;
      if (b === 'current') return 1; 
      return parseInt(b.slice(1)) - parseInt(a.slice(1)); 
    });
    //Quitamos current y su equivalente versión para omitir duplicados
    clavesOrdenadas = clavesOrdenadas.slice(2);
    // Crear un nuevo objeto ordenado
    clavesOrdenadas.forEach(clave => {
        var vers = parseInt(clave.charAt(clave.length - 1));
        if (versionSelected !== null && versionSelected < vers) {
          let lastChild = document.querySelector('#oldVersions p');
          let nodeToAdd = document.querySelector('#oldVersions');
          let newNode = document.createElement("li");
          newNode.style = 'list-style-type:none; text-indent: 2em;';
          newNode.innerHTML = "<a style='color: #007bff; font-weight: 400; cursor: pointer; text-indent: 2em;' onclick=' visualizeOldBokData(" + vers + ", " + versionPerYear[clave] + " )'> - version " + vers + ".0 (" + versionPerYear[clave] + ")</a>";
          nodeToAdd.insertBefore(newNode, lastChild);
        } else if (versionSelected == null || versionSelected > vers) {
          domElement.innerHTML += "<li style='list-style-type:none; text-indent: 2em;'><a style='color: #007bff; font-weight: 400; cursor: pointer; text-indent: 2em;' onclick=' visualizeOldBokData(" + vers + ", " + versionPerYear[clave] + " )'> - version " + vers + ".0 (" + versionPerYear[clave] + ")</a></li>";
        }
    });
  }

  //displays a list of textelements in HTML
  displayUnorderedList = function (array, propertyname, headline, domElement, idNode) {
    if (array != null && array.length != 0) {
      var text = "";
      text += "";
      text += "<h5>" + headline + " [" + array.length + "] </h5><div #" + idNode + " id=" + idNode + "><ul>";
      for (var i = 0, j = array.length; i < j; i++) {
        var nameShort;
        var value;
        if (propertyname != null) { //For Subconcepts and Demonstrable Skills and Source Documents
          value = array[i][propertyname];
          nameShort = array[i]['nameShort'];
        } else { //For Similar, Postrequisites and Prerequisites
          value = array[i];
          nameShort = array[i];
        }

        /* We attach the browseToConcept function to each subconcept of the list */
        if (headline == "Subconcepts") {
          text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' id='sc-" + nameShort + "' onclick='browseToConcept(\"" + nameShort + "\")'>" + "[" + nameShort + "] " + value + "</a> <br>";
        } else if (headline == "Similar concepts" || headline == "Postrequisites" || headline == "Prequisites") {
          text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' class='concept-name' onclick='browseToConcept(\"" + nameShort + "\")'>" + value + "</a> <br>";
        } else if (headline == "Source documents") {
          if (value.length > 1) {
            text += "<li><a style='color: #007bff; font-weight: 400; cursor: pointer;' target='_blank' href='" + value + "'>" + nameShort + "</a></li>";
          } else {
            text += "<li><a>" + nameShort + "</a></li>";
          }
        } else if (headline == "Contributors") {
          if ( i == j-1 ) {
            text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' target='_blank' href='" + value + "'>" + nameShort + "</a> ";
          } else if (value.length > 1) {
            text += "<a style='color: #007bff; font-weight: 400; cursor: pointer;' target='_blank' href='" + value + "'>" + nameShort + "</a>, ";
          }  else{
            text += "<p>" + nameShort + "</p>, ";
          }
        } else if (headline == "Skills") {
          text += "<li>" + value + "</li>";
        } else {
          text += "<a>" + value + "</a> <br> ";
        }
      };
      text += "</ul></div>";
      domElement.innerHTML += text;
    }
  },

    browseToConcept = function (nameShort) {
      var node = null;
      codSelected = nameShort;
      dataAndFunctions.nodes.forEach(n => {
        if (n.data.nameShort == nameShort) {
          node = n;
          return;
        }
      });
      if (node != null) {
        var nodeData = dataAndFunctions.conceptNodeCollection.getNodeByNameShort(nameShort);
        exports.displayConcept(nodeData);
        dataAndFunctions.zoom(node);
      }
      if (isAnOldVersion) {
        isAnObsoleteId = true;
        isAnOldVersion = false;
      }
    },
    exports.browseToConcept = function (nameShort) {
      browseToConcept(nameShort);
    }

  var selectedNodes = [];

  exports.searchInBoK = function (string, searchCode, searchName, searchDes, searchSkills) {
    exports.cleanSearchInBOK();

    searchInputFieldDoc = string.trim();

    if (searchInputFieldDoc != "" && searchInputFieldDoc != " ") {
      selectedNodes = dataAndFunctions.conceptNodeCollection.getNodesIdByKeyword(searchInputFieldDoc, searchCode, searchName, searchDes, searchSkills);
      //highlight search
      for (var i = 0; i < selectedNodes.length; i++) {
        var circle = document.getElementById(selectedNodes[i]);
        if (circle != null) {
          circle.style.stroke = COLOR_STROKE_SELECTED;
          circle.style.strokeWidth = "2px";
        }
      }
    }
    return dataAndFunctions.conceptNodeCollection.getNodesByKeyword(searchInputFieldDoc, searchCode, searchName, searchDes, searchSkills);
  }

  exports.cleanSearchInBOK = function (d) {
    //clean search
    for (var i = 0; i < selectedNodes.length; i++) {
      var circle = document.getElementById(selectedNodes[i]);
      if (circle != null) {
        circle.style.stroke = "";
        circle.style.strokeWidth = "";
      }
    }
    selectedNodes = [];
  }

  exports.searchInBoKAndWriteResults = function (string) {
    var results = exports.searchInBoK(string);

  }
}

