var Relationtype = {
    SIMILAR: "similarTo",
    PREREQUISITE: "prerequisites",
    POSTREQUISITE: "postrequisites",
    BROADER: "broader",
    NARROWER: "narrower",
    DEMONSTRATES: "demonstrates"
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
    this.additionalParents = [];
    //field required by D3, equals subconcepts
    this.children = [];
    //other relations equal to 'relationtype'
    this.prerequisites = [];
    this.postrequisites = [];
    this.similarConcepts = [];

    this.demonstrableSkills = [];
    this.sourceDocuments = [];

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
CostumD3NodeCollection.prototype.getNodesByKeyword = function (keyword) {
    var result = []
    keyword = keyword.toUpperCase();
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].nameShort.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
                result.push(this.nodes[i]);
            }
        }
    }
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].name && this.nodes[i].name.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
                result.push(this.nodes[i]);
            }
        }
    }
    /* UNCOMMENT TO SEARCH IN PREREQUISITES, POSTREQUISITES AND DEMONSTRABLE SKILLS
    
    for (var j = 0; j < this.nodes[i].prerequisites.length; j++) {
            if (this.nodes[i].prerequisites[j].toUpperCase().indexOf(keyword) > -1) {
                result.push(this.nodes[i]);
                break;
            }
        }
        for (var k = 0; k < this.nodes[i].postrequisites.length; k++) {
            if (this.nodes[i].postrequisites[k].toUpperCase().indexOf(keyword) > -1) {
                result.push(this.nodes[i]);
                break;
            }
        } 
        for (var l = 0; l < this.nodes[i].demonstrableSkills.length; l++) {
            if (this.nodes[i].demonstrableSkills[l].description.toUpperCase().indexOf(keyword) > -1) {
                result.push(this.nodes[i]);
                break;
            }
        } */

    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].description != null && this.nodes[i].description != "") {
            if (this.nodes[i].description.toUpperCase().indexOf(keyword) > -1) {
                if (!result.includes(this.nodes[i])) {
                    result.push(this.nodes[i]);
                }
            }
        }
    }
    return result;
};

/* FOR SEARCH FUNCTIONALITY */
CostumD3NodeCollection.prototype.getNodesIdByKeyword = function (keyword) {
    var result = [];
    keyword = keyword.toUpperCase();
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].nameShort.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
                result.push(this.nodes[i].id);
            }
        }
    }
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].name && this.nodes[i].name.toUpperCase().indexOf(keyword) > -1) {
            if (!result.includes(this.nodes[i])) {
                result.push(this.nodes[i].id);
            }
        }
    }
    /* UNCOMMENT TO SEARCH IN PREREQUISITES, POSTREQUISITES AND DEMONSTRABLE SKILLS
     
     for (var j = 0; j < this.nodes[i].prerequisites.length; j++) {
           if (this.nodes[i].prerequisites[j].toUpperCase().indexOf(keyword) > -1) {
               result.push(this.nodes[i].id);
               break;
           }
       }
       for (var k = 0; k < this.nodes[i].postrequisites.length; k++) {
           if (this.nodes[i].postrequisites[k].toUpperCase().indexOf(keyword) > -1) {
               result.push(this.nodes[i].id);
               break;
           }
       }
       for (var l = 0; l < this.nodes[i].demonstrableSkills.length; l++) {
           if (this.nodes[i].demonstrableSkills[l].description.toUpperCase().indexOf(keyword) > -1) {
               result.push(this.nodes[i].id);
               break;
           }
       }*/
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].description != null && this.nodes[i].description != "") {
            if (this.nodes[i].description.toUpperCase().indexOf(keyword) > -1) {
                if (!result.includes(this.nodes[i])) {
                    result.push(this.nodes[i].id);
                }
            }
        }
    }

    return result;
};


SkillsCollection = function () {
    this.skills = [];
};

SkillsCollection.prototype.add = function (skill) {
    this.skills.push(skill);
};

SkillsCollection.prototype.getSkillByURI = function (uri) {
    for (var i = 0; i < this.skills.length; i++) {
        if (this.skills[i].uri == uri) {
            return this.skills[i];
        }
    }
    return null;
};

// data structure that represent a relation between to concpets of a given type, e.g. similar concept, prerequisite concept...
Relation = function (sourceID, targetID, type) {
    this.source = sourceID;
    this.target = targetID;
    this.type = type;
    this.id = Math.random();
};
/**
 * Indicates if two relations are identical (have the same id)
 * Note that detecting dublicates would require comparism of each attribute rather than the id
 */
Relation.prototype.equals = function (relation) {
    return this.id == relation.id;
};

Relation.prototype.similar = function (relation) {
    return (this.source == relation.source && this.target == relation.target && this.type == relation.type) ||
        //for reflexive relationships:
        (this.type == Relationtype.SIMILAR && this.type == relation.type && this.target == relation.source && this.source == relation.target);

};

RelationCollection = function () {
    this.relations = [];
};

RelationCollection.prototype.add = function (relation) {
    //if a similar relationship exists, don't add
    for (var i = 0; i < this.relations.length; i++) {
        if (this.relations[i].similar(relation))
            return;
    }
    ;
    this.relations.push(relation);
};

RelationCollection.prototype.getRelations = function (nameShort) {
    var res = [];
    for (var i = 0; i < this.relations.length; i++) {
        if (this.relations[i].source == nameShort) {
            res.push(this.relations[i]);
        }
    }
    return res;
};


parseBOKData = function (bokXML) {
    //Parent node: gin2k:BodyOfKnowledge
    var d3output = new CostumD3Node();
    //Current XML parent node doest not have id attr
    //	d3output.id = "BoKGISandT";
    //	//d3output.id = XMLParentNode.getAttribute("Notation")
    //	d3output.nameShort = "BoKGISandT";
    //
    //	//Current XML parent node doest not have name attr
    //	d3output.name = "Geographic Information Science and Technology Body of Knowledge";
    //	//d3output.name = XMLParentNode.getAttribute("PrefLabel")

    //First we gather all the concepts in a CostumD3Collection
    var concepts = bokXML.documentElement.getElementsByTagName("Concept");
    var nhashAndcd3Collection = parseConcepts(concepts);
    var costumD3Collection = nhashAndcd3Collection.collection;
    var namehash = nhashAndcd3Collection.hash;
    var relationCollection = nhashAndcd3Collection.relations;
    var colorhash = nhashAndcd3Collection.colors;

    //We also gather all the skills in a SkillsCollection
    var skills = bokXML.documentElement.getElementsByTagName("Skill");
    var skillsCollection = parseSkills(skills);

    //Here we make the relations between every concept and skill
    var relations = bokXML.documentElement.getElementsByTagName("Relationship");
    parseRelations(relations, costumD3Collection, skillsCollection);

    //Once we have the relations made (inside the CostumD3Collection),
    //we must get the concepts with no parent (the most abstract concepts)
    var higherCostumD3Nodes = getHigherCostumD3Nodes(costumD3Collection);

    printWrongConcepts(costumD3Collection);

    removeNodesWithNoParent(costumD3Collection);

    //Our main Concept (or node) is the d3output node (created before),
    //so we must add to it the more abstract concepts
    d3output = higherCostumD3Nodes;

    //costumD3Collection.add(d3output);

    return {
        nodes: d3output,
        relations: relationCollection,
        namehash: namehash,
        conceptNodeCollection: costumD3Collection,
        colors: colorhash
    };

};

removeNodesWithNoParent = function (costumD3Collection) {
    var newNodes = [];
    removed = 0;
    added = 0;
    for (var i = 0; i < costumD3Collection.nodes.length; i++) {
        if (costumD3Collection.nodes[i].parent == null && costumD3Collection.nodes[i].nameShort != "GIST") {
            removed++;
            // console.log("Node incorrect: %s", costumD3Collection.nodes[i].nameShort);
        } else {
            newNodes.push(costumD3Collection.nodes[i]);
            added++;
        }
    }
    console.log("Total nodes with no parent: %i", removed);
    console.log("Total nodes with parent: %i", added);

    //change array of nodes to remove the null parents
    costumD3Collection.nodes = newNodes;

};

getHigherCostumD3Nodes = function (costumD3Collection) {

    var res;
    for (var i = 0; i < costumD3Collection.nodes.length; i++) {
        if ((costumD3Collection.nodes[i].parent == null && costumD3Collection.nodes[i].nameShort == "GIST") || (costumD3Collection.nodes[i].parent == null && costumD3Collection.nodes[i].name == "Geographic Information Science and Technology")) {
            res = costumD3Collection.nodes[i];
        }
    }
    return res;

};

parseConcepts = function (concepts) {

    var listOfConceptNames = [];

    //Fake relations
    var relationCollection = new RelationCollection();
    //            var rel = new Relation("GC4", "GD11-3", Relationtype.PREREQUISITE);
    //            relationCollection.add(rel);
    //            rel = new Relation("GC7", "GC2-7", Relationtype.SIMILAR);
    //            relationCollection.add(rel);

    //It is created the CostumD3NodeCollection in order to have all the nodes created
    //and work with them
    cD3NCollection = new CostumD3NodeCollection();
    var namehash = {};
    var colorhash = {};
    var cD3N;
    for (var i = 0; i < concepts.length; i++) {
        var description = concepts[i].getAttribute("Definition");
        var name = concepts[i].getAttribute("PrefLabel");
        var nameShort = concepts[i].getAttribute("Notation");
        var uri = concepts[i].getAttribute("URI");
        var timestamp = concepts[i].getAttribute("TimeStamp");
        cD3N = new CostumD3Node();
        cD3N.description = description;
        cD3N.name = name;
        cD3N.nameShort = nameShort;
        cD3N.timestamp = timestamp;
        cD3N.id = uri;
        cD3N.uri = uri;
        
        if (namehash[cD3N.id] == null) {
            cD3NCollection.add(cD3N);
        }
        namehash[cD3N.id] = cD3N.name;
        colorhash[cD3N.nameShort.substring(0, 2)] = 0;

        if (!listOfConceptNames.includes(nameShort)) {
            listOfConceptNames.push(nameShort)
        } else {
            console.log("REPEATED NOTATION: " + nameShort);

            var alreadyConcept = cD3NCollection.getNodeByNameShort(nameShort);
            var alreadyTimestamp = new Date(alreadyConcept.timestamp)
            var currentTimestamp = new Date(timestamp)

            // If current node timestamp is newer, replace the old node
            if (currentTimestamp > alreadyTimestamp ) {
                console.log("**** REPLACED OLD CONCEPT " + alreadyConcept.nameShort + " " + alreadyConcept.name + " BY " +  nameShort + " " + name);
                cD3NCollection.pop(); // Pop old one
                cD3NCollection.pop(); // Pop old one
                cD3NCollection.add(cD3N);  //Push new one
            }
        }
    }
    var i = 0;
    for (var key in colorhash) {
        colorhash[key] = i;
        i++;
    }

    return { collection: cD3NCollection, hash: namehash, relations: relationCollection, colors: colorhash };

};

printWrongConcepts = function (costumD3Collection) {
    var KADes = 0;
    var UnDes = 0;
    var ToDes = 0;
    var To = 0;
    var KA = 0;
    var Un = 0;

    var KASk = 0;
    var UnSk = 0;
    var ToSk = 0;
    var KABib = 0;
    var UnBib = 0;
    var ToBib = 0;

    var res;
    for (var i = 0; i < costumD3Collection.nodes.length; i++) {
        if (costumD3Collection.nodes[i].parent != null && costumD3Collection.nodes[i].parent.nameShort == "GIST") {
            KA++;
            //KA
            if (costumD3Collection.nodes[i].description == null || costumD3Collection.nodes[i].description.length < 100)
                KADes++;
            if (costumD3Collection.nodes[i].demonstrableSkills == null || costumD3Collection.nodes[i].demonstrableSkills.length < 1)
                KASk++;
            if (costumD3Collection.nodes[i].sourceDocuments == null || costumD3Collection.nodes[i].sourceDocuments.length < 1)
                KABib++;
        } else if (costumD3Collection.nodes[i].parent != null && costumD3Collection.nodes[i].parent.nameShort != "GIST" && costumD3Collection.nodes[i].children.length > 0) {
            Un++;
            // Units
            if (costumD3Collection.nodes[i].description == null || costumD3Collection.nodes[i].description.length < 100)
                UnDes++;
            if (costumD3Collection.nodes[i].demonstrableSkills == null || costumD3Collection.nodes[i].demonstrableSkills.length < 1)
                UnSk++;
            if (costumD3Collection.nodes[i].sourceDocuments == null || costumD3Collection.nodes[i].sourceDocuments.length < 1)
                UnBib++;
        } else if (costumD3Collection.nodes[i].parent != null && costumD3Collection.nodes[i].parent.nameShort != "GIST" && costumD3Collection.nodes[i].children.length == 0) {
            //Topic
            To++;
            if (costumD3Collection.nodes[i].description == null || costumD3Collection.nodes[i].description.length < 100)
                ToDes++;
            if (costumD3Collection.nodes[i].demonstrableSkills == null || costumD3Collection.nodes[i].demonstrableSkills.length < 1)
                ToSk++;
            if (costumD3Collection.nodes[i].sourceDocuments == null || costumD3Collection.nodes[i].sourceDocuments.length < 1)
                ToBib++;
        }

    }

    console.log("KA Total : " + KA);
    console.log("Un Total : " + Un);
    console.log("Top Total : " + To);

    console.log("KA Wrong or short desc : " + KADes);
    console.log("KA Wrong Skills : " + KASk);
    console.log("KA Wrong Bib : " + KABib);
    console.log("Unit Wrong or short desc : " + UnDes);
    console.log("Unit Wrong Skills : " + UnSk);
    console.log("Unit Wrong Bib : " + UnBib);
    console.log("Topic Wrong or short desc : " + ToDes);
    console.log("Topic Wrong Skills : " + ToSk);
    console.log("Topic Wrong Bib : " + ToBib);


},

    parseRelations = function (relations, costumD3Collection, skillsCollection) {

        //We work with the CostumD3Collection and add the childrens and the parents
        //to the appropiate nodes
        for (var i = 0; i < relations.length; i++) {
            var objectUri = relations[i].getAttribute("Object").split("_rev")[0];
            var subjectUri = relations[i].getAttribute("Subject").split("_rev")[0];
            var predicateUri = relations[i].getAttribute("Predicate");
            var relation = getRelationFromPredicate(predicateUri);
            var object = costumD3Collection.getNodeByURI(objectUri);
            //XML ERROR: Some RelationShip Object's URIs don't match with any concept
            if (object != null) {
                //If relation is BROADER, it is a hierarchy relation, so we add the corresponding
                //children and the corresponding parent to the node
                if (relation == Relationtype.BROADER) {
                    var subject = costumD3Collection.getNodeByURI(subjectUri);
                    if (subject != null) {
                        var alreadyChild = false;
                        //Here we check that the relation was not previously added to prevent duplicating concepts
                        for (var j = 0; j < object.children.length; j++) {
                            if (object.children[j].uri.split("_rev")[0] == subjectUri) {
                                alreadyChild = true;
                            }
                        }
                        if (!alreadyChild) {

                            if (subject.parent == null) {
                                object.children.push(subject);
                                subject.parent = object;
                            } else if (subject.parent.nameShort != object.nameShort && subject.nameShort != object.nameShort) { // Because narrower relations we have to see if the parent is already there. And there are relations pointing to same concept with different revision
                                //we will use the additional Parent to save other parents when more than one
                                subject.additionalParents.push(object);
                                //in case there are more than one parent, duplicate node

                                var newCD3N = duplicateNode(subject);
                                object.children.push(newCD3N);
                                newCD3N.parent = object;
                                newCD3N.additionalParents.push(subject.parent);

                                cD3NCollection.add(newCD3N);

                            }
                        }
                    }

                }//If relation is NARROWER, it is a hierarchy relation, so we add the corresponding
                //children and the corresponding parent to the node
                else if (relation == Relationtype.NARROWER) {
                    var subject = costumD3Collection.getNodeByURI(subjectUri);
                    if (subject != null) {
                        var alreadyChild = false;
                        //Here we check that the relation was not previously added to prevent duplicating concepts
                        for (var j = 0; j < subject.children.length; j++) {
                            if (subject.children[j].uri.split("_rev")[0] == objectUri) {
                                alreadyChild = true;
                            }
                        }
                        if (!alreadyChild) {
                            if (object.parent == null) {
                                subject.children.push(object);
                                object.parent = subject;
                            } else if (object.parent.nameShort != subject.nameShort && subject.nameShort != object.nameShort) { // Because narrower relations we have to see if the parent is already there. And there are relations pointing to same concept with different revision
                                //we will use the additional Parent to save other parents when more than one
                                object.additionalParents.push(subject);
                                //in case there are more than one parent, duplicate node

                                var newCD3N = duplicateNode(object);
                                subject.children.push(newCD3N);
                                newCD3N.parent = subject;
                                newCD3N.additionalParents.push(object.parent);

                                cD3NCollection.add(newCD3N);

                            }
                        }
                    }
                }
                //If relation is DEMONSTRATES, it is a leaf node (a Skill)
                //and we add that skill to the correspoding concept
                else if (relation == Relationtype.DEMONSTRATES) {
                    var skill = skillsCollection.getSkillByURI(subjectUri);
                    if (object.objectives == null) {
                        object.objectives = [];
                    }
                    object.objectives.push(skill);
                    object.demonstrableSkills.push(skill);
                }
                //This should add the SIMILAR relations
                //However, there is an error in the XML file
                //and the "subject" concepts of the "similarTo"
                //relations dont exist
                else if (relation == Relationtype.SIMILAR) {
                    //var subject = costumD3Collection.getNodeByURI( subjectUri );
                    //subject.similarConcepts.push( object );
                    //object.similarConcepts.push( subject );
                }
            } else {
                // console.log("Relationship with incorrect URI: " + objectUri);
            }
        }
    };

parseSkills = function (skills) {
    var skillsCollection = new SkillsCollection();
    for (var i = 0; i < skills.length; i++) {
        var description = skills[i].getAttribute("Definition");
        var nameShort = skills[i].getAttribute("Notation");
        var uri = skills[i].getAttribute("URI").split("_rev")[0];
        var skill = {};
        skill.description = description;
        skill.nameShort = nameShort;
        skill.uri = uri;
        skillsCollection.add(skill);
    }
    return skillsCollection;
};

getRelationFromPredicate = function (predicate) {
    if (predicate != null) {
        var relation = predicate.split('#').pop(-1);
        return relation;
    }
};

duplicateNode = function (subject) {
    var newCD3N = new CostumD3Node();
    newCD3N.description = subject.description;
    newCD3N.name = subject.name;
    var rand = randomString(5);
    newCD3N.nameShort = subject.nameShort + rand;
    newCD3N.id = subject.id + rand;
    newCD3N.uri = subject.uri;
    newCD3N.children = [];
    for (var i = 0; i < subject.children.length; i++) {
        var child = duplicateNode(subject.children[i]);
        newCD3N.children.push(child);
    }
    return newCD3N;
};

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
