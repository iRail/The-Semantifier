/*!
 * The Semantifier script for communicating with The-DataTank instance.
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011, MultimediaLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
 * 
 * Licensed under the AGPL 3.0 license.
 * http://www.gnu.org/licenses/agpl.txt
 *
 * Includes jquery.base64.min.js
 * 
 * Copyright 2011, Hpyer <hpyer@yahoo.cn>
 * http://www.hpyer.cn/jquery-plugin-base64-encode-and-decode.html
 * 
 * Licensed under free license
 *
 * Includes jquery-1.7.1.min.js
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
 * 
 */



/**
 * Gets ontology's matching searchterm from swoogle.
 * Not yet implemented
 */
function search_vocabularies(searchstring){
    $.ajax({
        url: "http://sparql.cs.umbc.edu:80/swoogle31/q",
        data: {
            queryType:   "search_swd_ontology",
            searchString: searchstring,
            key:"demo"
        },
        success: search_vocabularies_success,
        dataType: 'xml'
    });
}

function search_vocabularies_success(){
    
}

function search_vocabularies_error(){
    display_error_message("Vocabulary could not be obtained");
}

function get_vocabulary(item,prefix){
    $.ajax({
        url: item.url,
        data: {},
        success: function(data){get_vocabulary_success(data,item,prefix)},
        dataType: 'xml'
    });
}

function get_vocabulary_success(data,item,prefix){
    fill_vocabulary(data,item);
    showVocabulary(item,prefix);
}

function get_vocabulary_error(){
    display_error_message("Vocabulary could not be obtained");
}

/**
 * Gets all the resources that are available in the The DataTank instance of the host.
 */
function get_resources(){
    $.ajax({
        url: host+"TDTInfo/Resources.json",
        dataType: 'json',
        data: {},
        success: get_resources_success,
        error: get_resources_error
    });
}

function get_resources_success(data){
    fill_resources_tree(data);
}

function get_resources_error(data){
    display_error_message("Resources could not be obtained");
}

/**
 * Gets the ontology of current resource.
 */
function get_ontology(){
    $.ajax({
        url:host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource+".rdf",
        success:get_ontology_success,
        error:get_ontology_error
    });
    preview();
}

function get_ontology_success(data){
    display_ontology(data);
}

function get_ontology_error(data){
    display_error_message("Mapping was not added to ontology");
}

/*
 * <p>Creates a new ontology for current resource</p>
 * <p>Use the PUT variable ontology_file to supply a file url of an OWL ontology file written in turtle syntax</p>
 * <p>Set the PUT variable auto_generate to true if you want the data model to be auto-generated</p>
 *
 * @param {object} data Object containing the PUT variables as properties
 * @param {String} data.ontology_file An URL to an OWL ontology file written in turtle syntax.
 * @param {boolean} data.auto_generate If true, the data model will be auto-generated.
 */
function create_ontology(data){
    $.ajax({
        url:auth_host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource,
        data:data,
        success:create_ontology_success,
        error:create_ontology_error,
        type:"PUT"
    });
}

function create_ontology_success(data){
    get_ontology();
}

function create_ontology_error(data){
    display_error_message("Ontology was not created");
}

/*
 * Adds a new mapping to a data member.
 *
 * @param {String} member_path Unique path of the member in the ontology
 * @param {String} map_name The name of the vocabulary member
 * @param {String} map_nmsp The namespace of the vocabulary
 * @param {String} map_prefix The prefix of the vocabulary
 */
function add_mapping(member_path,map_name,map_nmsp,map_prefix){
    $.ajax({
        url:auth_host+"TDTInfo/Ontology/"+tdt_package+"/"+member_path,
        data:{
            update_type : 'ontology',
            method : 'map',
            value : map_name,
            namespace : map_nmsp,
            prefix : map_prefix
        },
        success:add_mapping_success,
        error:add_mapping_error,
        type:"POST"
    });
}

function add_mapping_success(data){
    get_ontology();
}

function add_mapping_error(data){
    display_error_message("Mapping was not added to ontology");
}



/*
 * Adds a new member to the ontology.
 *
 * @param {String} member_path Unique path of the new member in the ontology
 * @param {String} member_type String defining the new member as 'property' or 'class'
 */
function add_member(member_path,member_type){
    $.ajax({
        url:auth_host+"TDTInfo/Ontology/"+tdt_package+"/"+member_path,
        data:{
            type:member_type
        },
        success:add_member_success,
        error:add_member_error,
        type:"PUT"
    });
    
}

function add_member_success(data){
    get_ontology();
}

function add_member_error(data){
    display_error_message("Member was not added to ontology");
}

/*
 * Deletes a member from the ontology.
 *
 * @param {String} member_path Unique path of the member in the ontology
 */
function delete_member(member_path){
    $.ajax({
        url:auth_host+"TDTInfo/Ontology/"+tdt_package+"/"+member_path,
        success:delete_member_success,
        error:delete_member_error,
        type:"DELETE"
    });
    
}

function delete_member_success(data){
    get_ontology();
}

function delete_member_error(data){
    display_error_message("Member was not deleted from ontology");
}

/*
 * Gets the data from the resource in the requested format.
 *
 */
function get_preview(){
    $.ajax({
        url: host+tdt_package+"/"+tdt_resource+current_preview_format,
        data: {},
        success: get_preview_success,
        error:get_preview_error,
        dataType: "text"
    });
}
function get_preview_success(data){
    display_preview(data);
}

function get_preview_error(data){
    //display_error_message("Data for preview could not be retrieved");
}