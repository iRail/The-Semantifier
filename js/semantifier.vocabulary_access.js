/*!
 * The Semantifier script for vocabulary lookup
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011, MMLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be>
 * 
 * Licensed under the AGPL 3.0 license.
 * http://www.gnu.org/licenses/agpl.txt
 *
 * Includes jquery-1.6.4.js
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: Mon Dec 5 00:00:00 2011 +0100
 * 
 * @copyright (C) 2011 by MMLab(Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
 * @license AGPLv3
 * @author Miel Vander Sande
 */

function init_vocabulary_lookup(){
    $.each(vocabularies, function(key, value){
        var opt = $("<option/>").appendTo($("#vocabulary_lookup select"));
        opt.val(key);
        opt.text(value.name);
    });
    
    $("#vocabulary_lookup select").change(load_vocabulary);
    
    load_vocabulary();
}

function load_vocabulary(){
    $("#search_result_classes").empty();
    $("#search_result_properties").empty();
    
    var prefix = $("select[@name=vocabulary_select] option:selected").val();
    
    
    var selected_item = vocabularies[prefix]; 
    
    if (selected_item.hasOwnProperty('url'))
        get_vocabulary(selected_item,prefix);
    else
        showVocabulary(selected_item,prefix);
}


function showVocabulary(selected_item,prefix){
    $.each(selected_item.classes,function(index, value){
        var div = $("<div />");
        div.addClass("search_result_class");
        div.draggable({
            revert: true, 
            stack: ".search_result_classes",
            helper:"clone",
            appendTo:"#content"
        });
        div.text(value);
        div.data("prefix", prefix);
        div.data("namespace",selected_item.namespace);
        $("#search_result_classes").append(div);
    });
    $.each(selected_item.properties,function(index, value){
        var div = $("<div />");
        div.addClass("search_result_property");
        div.draggable({
            revert: true, 
            stack: ".search_result_property",
            helper:"clone",
            appendTo:"#content"
        });
        div.text(value);
        div.data("prefix", prefix);
        div.data("namespace",selected_item.namespace);
        $("#search_result_properties").append(div);
    });
    
    $("#search_result .antiscroll-wrap").antiscroll();
}
