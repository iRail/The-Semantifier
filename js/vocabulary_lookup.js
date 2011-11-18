/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function init_vocabulary_lookup(){
    
    $.each(vocabularies, function(key, value){
        var opt = $("<option/>").appendTo($("#vocabulary_lookup select"));
        opt.val(key);
        opt.text(value.name);
    });
    
    $("#vocabulary_lookup select").change(loadVocabulary);
    
    loadVocabulary();
}

function loadVocabulary(){
    $("#search_result_classes").empty();
    $("#search_result_properties").empty();
    
    var prefix = $("select[@name=vocabulary_select] option:selected").val();
    var selected_item = vocabularies[prefix];    
        
    $.each(selected_item.classes,function(index, value){
        var div = $("<div />");
        div.addClass("search_result_class");
        div.draggable({
            revert: true, 
            stack: ".search_result_classes"
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
            scope: 'mapping'
        });
        div.text(value);
        div.data("prefix", prefix);
        div.data("namespace",selected_item.namespace);
        $("#search_result_properties").append(div);
    });
}

function lookup(searchstring){
    $.get("http://sparql.cs.umbc.edu:80/swoogle31/q",{
        queryType:   "search_swd_ontology",
        searchString: searchstring,
        key:"demo"
    },handleResult);
   
}
function handleResult(data){
    var db = $.rdf().load(data, {});
    alert(data);
    $("#search_result").text(db.dump());
}