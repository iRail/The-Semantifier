/*!
 * The Semantifier script for querying ontology's
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011: 
 * MMLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be/about> 
 * Miel Vander Sande <miel.vandersande@ugent.be>
 * 
 * Licensed under the AGPL 3.0 license.
 * http://www.gnu.org/licenses/agpl.txt
 *
 * Includes jquery-1.7.1.min.js
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Includes jquery.rdfquery.core.min-1.0 
 * http://jquery.com/
 *
 * Copyright (c) 2008,2009 Jeni Tennison
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Date: Mon Dec 5 00:00:00 2011 +0100
 */

var current_namespaces = new Array();
var current_ontology = null;

function init_ontology(data){
    current_ontology = $.rdf().load(data, {});
    current_ontology.base(data.documentElement.baseURI);
    
    $.each($(data.documentElement).xmlns(),function(prefix,item){
        current_namespaces[item.toString()] = prefix;        
    });
}

function get_data_model_paths() {
    var path_arr = new Array();
    var cnt = 0;
    
    current_ontology
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
    
    return path_arr;
}

function get_mapping_from_member(path){
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

