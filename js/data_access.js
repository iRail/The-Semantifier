/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var host = "http://localhost/TDT/";
var api_usr = "tdtusr";
var api_psw = "tdtusr";


var tdt_resource = null;
var tdt_package = null;

var current_preview_format = '.html';
var current_namespaces = new Array();
var current_ontology = null;

var last_arr = new Array();

$(document).ready(function() {
   
    $("#no_ontology").hide();
    $("#new_member").hide();
    $("#create_ontology_file").hide();
    
    $(".loading").hide();
    
    $("#data_preview").dialog({
        autoOpen:false,
        dialogClass: 'data_preview_dialog',
        position: ['left','bottom'],
        resizable: true,
        height: 300 
    });
    
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
            var package_span = $("<span class='package_label'/>");
            package_span.text(i);
            
            package_span.appendTo(package_item);
            package_item.appendTo("#list");
            
            var resource_list = $("<ul/>");
            resource_list.appendTo(package_item);
            
            $.each(item, 
                function(resource,doc){
                    if (resource != "creation_date"){
                        var resource_item = $("<li/>");
                        var resource_item_span = $("<span class='resource_label'/>");
                        resource_item_span.text(resource);
                        resource_item_span.appendTo(resource_item);
                        resource_item_span.click(resourceClicked);
                        resource_item.appendTo(resource_list);
                        
                        var resource_preview = $("<div class='preview_buttons'/>").appendTo(resource_item);
                        resource_preview.append($("<span class='label'>Preview: </span>"));

                        var a = null;
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview);
                        a.data("ext",".html");
                        a.text("Model");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview);
                        a.data("ext",".xml");
                        a.text("XML");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview);
                        a.data("ext",".json");
                        a.text("JSON");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview);
                        a.data("ext",".rdf");
                        a.text("RDF/XML");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview);
                        a.data("ext",".n3");
                        a.text("RDF/N3");
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
    tdt_resource = $(this).text();
    tdt_package = $(this).parents("li").children(".package_label").text();
    
    loadOntology();
}

function loadOntology(){
    $("#center_pane .loading").show();
    
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource+".rdf";
    $.ajax({
        url:url,
        success:ontologyLoaded,
        statusCode:{
            457:ontologyNonExisting
        },
        error:ontologyNonExisting
    });
    
    request_preview();
}

function ontologyNonExisting(){
    $("#center_pane .loading").hide();
    $("#center_pane .title").text("The resource "+tdt_package+"/"+tdt_resource+" has no ontology");
    $("#no_ontology").show();
}

function createEmptyClicked(){
    createOntology({});
}

function createFileClicked(){
    $("#create_ontology_file").show("slow");
}

function createFileSendClicked(){
    createOntology({
        ontology_file:$("#create_ontology_file_text").val()
    });
}

function createAutoClicked(){
    createOntology({});
}

function createOntology(data){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource;
    $.ajax({
        url:url,
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + $.base64.encode(api_usr + ":" + api_psw));
        },
        success:loadOntology,
        error:memberPutError,
        type:"PUT"
    });
}


function ontologyLoaded(data){
    $("#create_ontology_file").hide();
    $("#no_ontology").hide();
    $('#ontology').empty();
    
    $("#center_pane .title").text("Ontology of "+tdt_package+"/"+tdt_resource);
    
    current_ontology = $.rdf().load(data, {});
    current_ontology.base(data.documentElement.baseURI);
    
    $.each($(data.documentElement).xmlns(),function(prefix,item){
        current_namespaces[item.toString()] = prefix;        
    });
       
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
    
    $("#center_pane .loading").hide();
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
        ul.prepend(getNewButton(uid));
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
        accept: '*',
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
    
    current_ontology
    .where('<'+current_ontology.base()+path+'> owl:equivalentProperty ?map_property')
    .each(function () {
        var resource_uri = this.map_property.dump().value;
        
        var index = resource_uri.lastIndexOf("#");
        if (index == -1)
            index = resource_uri.lastIndexOf("/");
        
        var namespace = resource_uri.substring(0,index+1);
        var map = resource_uri.substring(index+1);

        var prefix = current_namespaces[namespace];
        
        if (prefix != undefined){
            mappings.append("<span class='mapping'><a href='"+namespace+map+"'>"+prefix+':'+map+"</a></span>");
        } else {
            mappings.append("<span class='mapping'><a href='"+namespace+map+"'>"+namespace+map+"</a></span>");
        }
    })
    .end()
    .where('<'+current_ontology.base()+path+'> owl:equivalentClass ?map_class')
    .each(function () {
        var resource_uri = this.map_class.dump().value;
        
        var index = resource_uri.lastIndexOf("#");
        if (index == -1)
            index = resource_uri.lastIndexOf("/");
        
        var namespace = resource_uri.substring(0,index+1);
        var map = resource_uri.substring(index+1);

        
        var prefix = current_namespaces[namespace];
        var map_span = $("<span class='mapping'/>").appendTo(mappings);
        var map_a = $("<a href='"+namespace+map+"'/>").appendTo(map_span);
        
        map_a.mouseover(function(){
            $("#data_preview").highlight($(this).text());
        });
        
        map_a.mouseout(function(){
            $("#data_preview").removeHighlight($(this).text());
        });
        
        if (prefix != undefined){
            map_a.text(prefix+':'+map);
        } else {
            mappings.append(namespace+map);
        }
    })
    .end()

    return mappings;
}


function addMappingToOntology(path,map){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+path;

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
        success:loadOntology,
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
                var span = $(this).children("div .data_member");
                if (span.length>0)
                    path = span.text()+"/"+path;
            });
            addMemberToOntology(path+txt.val(),$("input[@name='new_member_type"+uid+"']:checked").val());
        }
    });
    
    new_member.keydown(function(event){
        if ( event.which == 27 ){
            txt.text('');
            new_member.hide();
            a.show();
        }     
    });

    $("<label for='new_member_text"+uid+"'/>").text("Member name: ").appendTo(new_member);
    txt.appendTo(new_member);
    $("<label for='new_member_class"+uid+"'/>").text("Class: ").appendTo(new_member);
    $("<input type='radio' name='new_member_type"+uid+"' id='new_member_class"+uid+"' value='class' checked/>").appendTo(new_member);
    $("<label for='new_member_property"+uid+"'/>").text("Property: ").appendTo(new_member);
    $("<input type='radio' name='new_member_type"+uid+"' id='new_member_property"+uid+"' value='property'/>").appendTo(new_member);
    
    new_member.hide();
    
    return li;
}

function addMemberToOntology(member_path,member_type){
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+member_path;

    $.ajax({
        url:url,
        data:{
            type:member_type
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + $.base64.encode(api_usr + ":" + api_psw));
        },
        success:loadOntology,
        error:memberPutError,
        type:"PUT"
    });
    
}

function memberPutError(data){
    alert("Something is wrong! "+data);
}

function preview(){
    tdt_resource = $(this).parents("li").children(".resource_label").text();
    tdt_package = $(this).parents("li").children(".package_label").text();
    
    current_preview_format = $(this).data("ext");
    
    request_preview();
}

function request_preview(){
    $("#data_preview_content").hide();
    $("#data_preview").dialog("open");
    $("#data_preview .loading").show();
    
    var url = host+tdt_package+"/"+tdt_resource+current_preview_format;
    $.get(url, {}, function(data){
        $("#data_preview .loading").hide();
        $("#data_preview_content").show();
        $("#data_preview").dialog("option", "title", "Preview of "+tdt_package+"/"+tdt_resource+" ("+current_preview_format+")");
        if (current_preview_format == '.html')
            $("#data_preview_content").html(data);
        else
            $("#data_preview_content").text(data);
    },"text");
}