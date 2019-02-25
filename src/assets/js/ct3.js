var searchInputFieldDoc = document.getElementById("searchInputField");

var links;
var duration = d3.event && d3.event.altKey ? 5000 : 500;

var selectedNodes = [];

// Search functionality
function searchInBoK() {
    cleanSearchInBOK();

    if (searchInputFieldDoc.value != "" && searchInputFieldDoc.value != " ") {
        selectedNodes = dataAndFunctions.conceptNodeCollection.getNodesIdByKeyword(searchInputFieldDoc.value);
       // selectedNodes = selectedNodes.split(",");

        //highlight search
        for (var i = 0; i < selectedNodes.length; i++) {
            var circle = document.getElementById(selectedNodes[i]);
            if (circle != null) {
                circle.style.stroke = "red";
                circle.style.strokeWidth = "2px";
            } /* else {
                console.log("PROBLEM " + selectedNodes[i]);
            } */
        }
    }
    return dataAndFunctions.conceptNodeCollection.getNodesByKeyword(searchInputFieldDoc.value);
}

function cleanSearchInBOK() {
    console.log(selectedNodes);
    //clean search
    for (var i = 0; i < selectedNodes.length; i++) {
        var circle = document.getElementById(selectedNodes[i]);
        if (circle != null) {
            circle.style.stroke = "";
            circle.style.strokeWidth = "";
        } else {
            console.log("PROBLEM " + selectedNodes[i]);
        }
    }
    selectedNodes = [];
}

function searchValueChanged() {
    if (searchInputFieldDoc.value == "" || searchInputFieldDoc.value == " ") {
        cleanSearchInBOK();
    }
}