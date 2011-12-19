/*!
 * The Semantifier script for querying ontology's
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011, MultimediaLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
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
 * 
 * @copyright (C) 2011 by MMLab(Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
 * @license AGPLv3
 * @author Miel Vander Sande
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
    .prefix('tdtml','http://www.thedatatank.org/tdml/1.0#')
    .where('<'+current_ontology.base()+path+'> owl:equivalentProperty ?map_property')
    .each(function () {
        append_mapping(mappings, path, this.map_property.dump().value);
    })
    .end()
    .where('<'+current_ontology.base()+path+'> tdtml:preferredProperty ?preferred_property')
    .each(function () {
        var preferred_map = mappings.children('span[title="'+this.preferred_property.dump().value+'"]');
        preferred_map.addClass('mapping_preferred');
    })
    .end()
    .where('<'+current_ontology.base()+path+'> owl:equivalentClass ?map_class')
    .each(function () {
        append_mapping(mappings, path, this.map_class.dump().value);
    })
    .end()
    .where('<'+current_ontology.base()+path+'> tdtml:preferredClass ?preferred_class')
    .each(function () {
        var preferred_map = mappings.children('span[title="'+this.preferred_class.dump().value+'"]');
        preferred_map.addClass('mapping_preferred');
    })
    .end();

    return mappings;
}

function append_mapping(mappings, path, resource_uri){
       
    var index = resource_uri.lastIndexOf("#");
    if (index == -1)
        index = resource_uri.lastIndexOf("/");
        
    var namespace = resource_uri.substring(0,index+1);
    var map = resource_uri.substring(index+1);

        
    var prefix = current_namespaces[namespace];
    var map_span = $("<span class='mapping'/>").appendTo(mappings);
        
    map_span.attr("title", namespace+map);
    map_span.click(function(){
        prefer_mapping(path,map,namespace);
    });
    
    map_span.dblclick(function(){
        window.open(namespace+map);        
    });
    
    var map_label = $("<span class='mapping_label' />");
    

    map_label.mouseover(function(){
        $("#data_preview").highlight($(this).text());
    });
        
    map_label.mouseout(function(){
        $("#data_preview").removeHighlight($(this).text());
    });
        
    if (prefix != undefined){
        map_span.append(map_label.text(prefix+':'+map));
    } else {
        map_span.append(map_label.text(namespace+map));
    }
    
    var delete_span = $("<span class='delete'/>").appendTo(map_span);
    delete_span.text("x");
    delete_span.click(function(){
        delete_mapping(path,map,namespace);
    });
}


function fill_vocabulary(data,item){
    var vocabulary = $.rdf().load(data,{});
    
    item.classes = new Array();
    item.properties = new Array();
    
    vocabulary
    .prefix('owl','http://www.w3.org/2002/07/owl#')
    .prefix('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    .where('?dataclass a owl:Class')
    .each(function () {
        var member = this.dataclass.value.toString();
        if (member > item.namespace){
            member = member.substring(item.namespace.length);
            item.classes.push(member);
        }
    })
    .end()
    .where('?dataproperty a owl:DataProperty')
    .each(function () {
        var member = this.dataproperty.value.toString();
        member = member.substring(item.namespace.length);
        item.properties.push(member);
    })
    .end()
    .where('?dataproperty a owl:ObjectProperty')
    .each(function () {
        var member = this.dataproperty.value.toString();
        member = member.substring(item.namespace.length);
        item.properties.push(member);
    });
}

