var searchInputFieldDoc = document.getElementById("searchInputField").value.trim();

var searchWhatFieldSn = true;
var searchWhatFieldNa = true;
var searchWhatFieldDe = true;
var searchWhatFieldSk = false;

var links;
var duration = d3.event && d3.event.altKey ? 5000 : 500;

var selectedNodes = [];

// Search functionality
function searchInBoK() {
    cleanSearchInBOK();

    searchInputFieldDoc = document.getElementById("searchInputField").value.trim();

    searchWhatFieldSn = document.getElementById("searchWhatFieldSn").checked;
    searchWhatFieldNa = document.getElementById("searchWhatFieldNa").checked;
    searchWhatFieldDe = document.getElementById("searchWhatFieldDe").checked;
    searchWhatFieldSk = document.getElementById("searchWhatFieldSk").checked;

    if (searchInputFieldDoc != "" && searchInputFieldDoc != " ") {
        selectedNodes = dataAndFunctions.conceptNodeCollection.getNodesIdByKeyword(searchInputFieldDoc);
        //highlight search
        for (var i = 0; i < selectedNodes.length; i++) {
            var circle = document.getElementById(selectedNodes[i]);
            if (circle != null) {
                circle.style.stroke = "red";
                circle.style.strokeWidth = "2px";
            }
        }
    }
    return dataAndFunctions.conceptNodeCollection.getNodesByKeyword(searchInputFieldDoc);
}

function cleanSearchInBOK() {
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

function searchValueChanged() {
    if (searchInputFieldDoc == "" || searchInputFieldDoc == " ") {
        cleanSearchInBOK();
    }
}