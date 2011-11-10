/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var host = "http://localhost/TDT/";

var tdt_resource = null;
var tdt_package = null;

var last_arr = new Array();

$(document).ready(function() {
    //    $("#left_pane").dialog({
    //        position:  ['left','top'],
    //        draggable: false,
    //        resizable:false
    //    });
    
    $("#no_ontology").hide();

    $("body").layout({
        applyDefaultStyles: true
    });

    $("#search_button").click(searchButtonHandler);

    $.getJSON(host+"TDTInfo/Resources.json",null,successHandler);
    
    
});

function searchButtonHandler(event){
    lookup($("input[name=search_field]").text());
}

function successHandler(data){
    
       
    $.each(data.Resources, 
        function(i,item){
            var package_item = $("<li/>");
            var package_span = $("<span/>");
            package_span.text(i);
            package_span.addClass("folder");
            
            package_span.appendTo(package_item);
            package_item.appendTo("#list");
            
            var resource_list = $("<ul/>");
            resource_list.appendTo(package_item);
            
            $.each(item, 
                function(resource,doc){
                    if (resource != "creation_date"){
                        var resource_item = $("<li/>");
                        var resource_item_span = $("<span/>");
                        resource_item_span.addClass("file");
                        resource_item_span.text(resource);
                        resource_item_span.appendTo(resource_item);
                        resource_item.click(resourceClicked);
                        resource_item.appendTo(resource_list);
                    }
                }
                );
            
            
        }
        );
        
    $("#list").treeview({
        animated: "fast",
        collapsed: true
    });
    
    
}


function resourceClicked(event){
    $("#no_ontology").hide();
    tdt_resource = $(this).text();
    tdt_package = $(this).parents("li").children(".folder").text();
    
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource+".rdf";
    $.ajax({
        url:url,
        success:ontologyLoaded,
        statusCode:{
            457:ontologyNonExisting
        },
        error:ontologyNonExisting
    });
    
}

function ontologyNonExisting(){
    alert('here');
    $("#no_ontology .title").text("The resource "+tdt_package+"/"+tdt_resource+" has no ontology");
    $("#no_ontology .content").html("Would you like to <a href='javascript:createClicked()'>create</a> one?");
    $("#no_ontology").show();
}

function createClicked(){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource;
    $.post(url, {
        
        
    }, function(){
        
    });
}

function ontologyLoaded(data){
    var db = $.rdf().load(data, {});
    db.base(data.documentElement.baseURI);
    
    var path_arr = new Array();
    
    var cnt = 0;
    
    var result = db
    .prefix('owl','http://www.w3.org/2002/07/owl#')
    .prefix('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    .where('?dataclass a owl:Class')
    .each(function () {
        var path = this.dataclass.value.toString();
        path = path.substring(db.base().length);
        path_arr[cnt] = path;
        cnt++;
    })
    .end()
    .where('?dataproperty a rdf:Property')
    .each(function () {
        var path = this.dataproperty.value.toString();
        path = path.substring(db.base().length);
        path_arr[cnt] = path;
        cnt++;
    })
    
    $('#ontology').empty();
    
    if (path_arr.length == 0)
        ontologyNonExisting();
    else
        processDataModel(path_arr);
}

function processDataModel(path_arr){
    var input = path_arr;
    var output = [];
    for (var i = 0; i < input.length; i++) {
        var chain = input[i].split("/");
        var currentNode = output;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];
            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {
                if (currentNode[k].name == wantedNode) {
                    currentNode = currentNode[k].nodes;
                    break;
                }
            }
            // If we couldn't find an item in this list of children
            // that has the right name, create one:
            if (lastNode == currentNode) {
                var newNode = currentNode[k] = {
                    name: wantedNode, 
                    nodes: []
                };
                currentNode = newNode.nodes;
            }
        }
    }
    
    $('#ontology').append(parseNodes(output));
    $('#ontology').treeview({
        animated: "fast",
        collapsed: false
    });
}

function parseNodes(nodes) { // takes a nodes array and turns it into a <ol>
    var ul = $('<ul/>');
    for(var i=0; i<nodes.length; i++) {
        ul.append(parseNode(nodes[i]));
    }
    return ul;
}

function parseNode(node) { // takes a node object and turns it into a <li>
    var li = $('<li/>');
    li.text(node.name);
    if(node.nodes) li.append(parseNodes(node.nodes));
    return li;
}


