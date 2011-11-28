/*!
 * The Semantifier script for the handling the view.
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011: 
 * MMLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be/about> 
 * Miel Vander Sande <miel.vandersande@ugent.be>
 * 
 * Licensed under the AGPL 3.0 license.
 * http://www.gnu.org/licenses/agpl.txt
 *
 * Includes jquery.highlight-3
 * <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
 *
 * Copyright 2011, Johann Burkard <http://johannburkard.de> <mailto:jb@eaio.com>
 * Licensed under the MIT license(licenses/MIT-LICENSE.txt).
 * 
 * Includes antiscroll.js
 * 
 * Copyright (c) 2011 Guillermo Rauch <guillermo@learnboost.com>;
 * Licensed under the MIT license(licenses/MIT-LICENSE.txt).
 * 
 * Includes jquery.treeview.js
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 * http://docs.jquery.com/Plugins/Treeview
 *
 * Copyright (c) 2007 Jörn Zaefferer
 * Dual licensed under the MIT(licenses/MIT-LICENSE.txt) and GPL(licenses/GPL-LICENSE.txt) licenses.
 * 
 * Includes jquery-ui-1.8.16.custom.min.js
 * http://docs.jquery.com/UI
 * 
 * Copyright 2011, licenses/AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Includes jquery-1.7.1.min.js
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: Mon Dec 5 00:00:00 2011 +0100
 */

var tdt_resource = null;
var tdt_package = null;

var current_preview_format = '.html';

var last_arr = new Array();

$(document).ready(function() {
   
    $("#no_ontology").hide();
    $("#new_member").hide();
    $("#create_ontology_file").hide();
    
    $(".loading").hide();
        
    init_vocabulary_lookup();
    get_resources();
});


function fill_resources_tree(data){
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
                        resource_item_span.click(resource_clicked);
                        resource_item.appendTo(resource_list);
                        
                        var resource_preview = $("<div class='preview_buttons'/>").appendTo(resource_item);
                        resource_preview.append($("<span class='label'>Preview: </span>"));

                        var a = null;
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview_clicked);
                        a.data("ext",".html");
                        a.text("Model");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview_clicked);
                        a.data("ext",".xml");
                        a.text("XML");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview_clicked);
                        a.data("ext",".json");
                        a.text("JSON");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview_clicked);
                        a.data("ext",".rdf");
                        a.text("RDF/XML");
                        
                        resource_preview.append(" | ");
                        
                        a = $("<a/>").appendTo(resource_preview);
                        a.click(preview_clicked);
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


function resource_clicked(){
    tdt_resource = $(this).text();
    tdt_package = $(this).parents("li").children(".package_label").text();
    
    $("#center_pane .loading").show();
    
    get_ontology(); 
}

function ontology_non_existing(){
    $("#center_pane .loading").hide();
    $("#center_pane .title").text("The resource "+tdt_package+"/"+tdt_resource+" has no ontology");
    $("#no_ontology").show();
}

function create_empty_clicked(){
    create_ontology({});
}

function create_file_clicked(){
    $("#create_ontology_file").show("slow");
}

function create_file_send_clicked(){
    create_ontology({
        ontology_file:$("#create_ontology_file_text").val()
    });
}

function create_auto_clicked(){
    create_ontology({
        auto_generate:true
    });
}

function display_ontology(data){
    $("#create_ontology_file").hide();
    $("#no_ontology").hide();
    $('#ontology').empty();
    
    $("#center_pane .title").text("Ontology of "+tdt_package+"/"+tdt_resource);
    
    init_ontology(data);
    var path_arr = get_data_model_paths();
        
    if (path_arr.length == 0)
        ontology_non_existing();
    else
        process_data_model(path_arr);
}

function process_data_model(path_arr){
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
    $('#ontology').append(parse_nodes(output,"0"));
    $('#ontology').treeview({
        animated: "fast",
        collapsed: false
    });
}

function parse_nodes(nodes,uid) { // takes a nodes array and turns it into a <ol>
    var ul = $('<ul/>');
    for(var i=0; i<nodes.length; i++) {
        ul.append(parse_node(nodes[i],uid+1));
    }
    if (uid != "0")
        ul.prepend(create_button(uid));
    return ul;
}

function parse_node(node,uid) { // takes a node object and turns it into a <li>
    var li = $('<li/>');
    var lbl = $("<div/>");
    lbl.addClass('data_member');
    lbl.data("path",node.path);
    lbl.text(node.name);
    lbl.droppable({
        accept: '*',
        drop:function(event, ui)
        {
            add_mapping(node.path,ui.draggable);
        },
        over:function(event,ui)
        {
            $(this).css("background-color", "#FFFFFF");
            $(this).css("color", "#BBBBBB");
        },
        out:function(event,ui)
        {
            $(this).css("background-color", "#BBBBBB");
            $(this).css("color", "#FFFFFF");
        }
    });
    li.append(lbl);
    li.append(get_mapping_from_member(node.path));
    
    if(node.nodes) li.append(parse_nodes(node.nodes,uid));
    return li;
}

function create_button(uid){
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
            add_member(path+txt.val(),$("input[@name='new_member_type"+uid+"']:checked").val());
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

function display_error_message(message){
    alert("An error occurred: "+message);
}

function preview_clicked(){
    tdt_resource = $(this).parents("li").children(".resource_label").text();
    tdt_package = $(this).parents("li").children(".package_label").text();
    
    current_preview_format = $(this).data("ext");
    
    preview();
}

function preview(){
    $("#data_preview_content").hide();
    $("#data_preview .loading").show();
    
    get_preview();
}

function display_preview(data){
    $("#data_preview .loading").hide();
    $("#data_preview_content").show();
    $("#data_preview .title").text("Preview of "+tdt_package+"/"+tdt_resource+" ("+current_preview_format+")");
    if (current_preview_format == '.html')
        $("#data_preview_content").html(data);
    else
        $("#data_preview_content").text(data);
    
    $("#data_preview").antiscroll();
}