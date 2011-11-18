/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var host = "http://localhost/TDT/";
var api_usr = "tdtusr";
var api_psw = "tdtusr";


var tdt_resource = null;
var tdt_package = null;

var current_ontology = null;

var last_arr = new Array();

$(document).ready(function() {
   
    $("#no_ontology").hide();
    
    $("#new_member").hide();

    /*$("body").layout({
        applyDefaultStyles: true
    });*/

    $("#search_button").click(searchButtonHandler);
    
    init_vocabulary_lookup();

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
    
    loadOntology();
}

function loadOntology(){
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
    $("#no_ontology .title").text("The resource "+tdt_package+"/"+tdt_resource+" has no ontology");
    $("#no_ontology").show();
}

function createClicked(){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource;
    $.post(url, {
        
        
        }, function(){
        
        });
}

function ontologyLoaded(data){
    current_ontology = $.rdf().load(data, {});
    current_ontology.base(data.documentElement.baseURI);
    
   
    var path_arr = new Array();
    
    var cnt = 0;
    
    var result = current_ontology
    .prefix('owl','http://www.w3.org/2002/07/owl#')
    .prefix('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    .where('?dataclass a owl:Class')
    .each(function () {
        var path = this.dataclass.value.toString();
        path = path.substring(current_ontology.base().length);
        path_arr[cnt] = path;
        cnt++;
    })
    .end()
    .where('?dataproperty a rdf:Property')
    .each(function () {
        var path = this.dataproperty.value.toString();
        path = path.substring(current_ontology.base().length);
        path_arr[cnt] = path;
        cnt++;
    })
    
    
    //Sort array on path length
    path_arr.sort(function(a, b) {
        var compA = a.split("/").length;
        var compB = b.split("/").length;
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
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
                    path: path_arr[i],
                    nodes: []
                };
                currentNode = newNode.nodes;
            }
        }
        
    }
    
    $('#ontology').append(parseNodes(output,"0"));
    $('#ontology').treeview({
        animated: "fast",
        collapsed: false
    });
}

function parseNodes(nodes,uid) { // takes a nodes array and turns it into a <ol>
    var ul = $('<ul/>');
    for(var i=0; i<nodes.length; i++) {
        ul.append(parseNode(nodes[i],uid+1));
    }
    if (uid != "0")
        ul.append(getNewButton(uid));
    return ul;
}

function parseNode(node,uid) { // takes a node object and turns it into a <li>
    var li = $('<li/>');
    var lbl = $("<div/>");
    lbl.addClass('data_member');
    lbl.data("path",node.path);
    lbl.text(node.name);
    lbl.droppable({
        hoverClass: 'member_hover', 
        accept:'*', 
        drop:function(event, ui)
        {
            addMappingToOntology(node.path,ui.draggable);
        }
    }    
    );
    li.append(lbl);
    li.append(getMappingFromMember(node.path));
    
    if(node.nodes) li.append(parseNodes(node.nodes,uid));
    return li;
}

function getMappingFromMember(path){
    
    var mappings = $("<div/>");
    
    
    //START HERE
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////////
    var index = this.map_property.toString().search("/\*\S*");
    var test = this.map_property.toString().substring(index)
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    
    current_ontology
    //.where('<'+current_ontology.base()+path+'> owl:equivalentClass ?map_class')
    .where('<'+current_ontology.base()+path+'> owl:equivalentProperty ?map_property')
    .each(function () {

        var prefix = '';
        var map = this.map_property.value.fragment;
        var namespace = this.map_property.toString().substring(1,this.map_property.toString().length-map.length-1);
        
        mappings.append("<div class='mapping'>"+namespace+map+"</div>");
    })
    .end()
    .where('<'+current_ontology.base()+path+'> owl:equivalentClass ?map_class')
    .each(function () {

        var prefix = '';
        var map = this.map_class.value.fragment;
        var namespace = this.map_class.toString().substring(1,this.map_class.toString().length-map.length-1);
        
        mappings.append("<div class='mapping'>"+namespace+map+"</div>");
    })
    .end()
    
    return mappings;
}


function addMappingToOntology(path,map){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+path;
    alert(url);
    $.ajax({
        url:url,
        data:{
            update_type : 'ontology',
            method : 'map',
            value : map.text(),
            namespace : map.data('namespace'),
            prefix : map.data('prefix')
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + $.base64.encode(api_usr + ":" + api_psw));
        },
        success:memberPutSuccess,
        error:memberPutError,
        type:"POST"
    });
}

function getNewButton(uid){
    var a = $("<a/>");
    a.addClass("new_member_button");
    a.text("Add new member...");
    
    var li = $('<li/>').append(a);
        
    var new_member = $("<div id='new_member"+uid+"' class='new_member'/>");
    li.append(new_member);
    
    a.click(function(){
        $(this).hide();
        $("#new_member"+uid).show();
        $("#new_member_text"+uid).focus();
    });
    
    var txt = $("<input id='new_member_text"+uid+"' type='text'/>");
   
    txt.keydown(function(event){
        if ( event.which == 13 ) {
            var p = txt.parents("li");
            var path = "";
            p.each(function(){
                var span = $(this).children("span");
                if (span.length>0)
                    path = span.text()+"/"+path;
            });
            addToOntology(path+txt.val(),$("input[@name='new_member_type"+uid+"']:checked").val());
        }
    });
    
    new_member.keydown(function(event){
        if ( event.which == 27 ){
            txt.text('');
            new_member.hide();
            a.show();
        }     
    });

    
    new_member.append(txt);
    $("<label for='new_member_class"+uid+"'/>").text("Class: ").appendTo(new_member);
    $("<input type='radio' name='new_member_type"+uid+"' id='new_member_class"+uid+"' value='class' checked/>").appendTo(new_member);
    $("<label for='new_member_property"+uid+"'/>").text("Property: ").appendTo(new_member);
    $("<input type='radio' name='new_member_type"+uid+"' id='new_member_property"+uid+"' value='property'/>").appendTo(new_member);
    
    new_member.hide();
    
    return li;
}

function addToOntology(member_path,member_type){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+member_path;
    alert(member_type);       
    $.ajax({
        url:url,
        data:{
            type:member_type
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + $.base64.encode(api_usr + ":" + api_psw));
        },
        success:memberPutSuccess,
        error:memberPutError,
        type:"PUT"
    });
    
}

function memberPutSuccess(){
    loadOntology();
}
function memberPutError(data){
    alert("Something is wrong! "+data);
}