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
    
    $("#vocabulary_lookup select").change(function(item){
        $("#search_result_classes").empty();
        $("#search_result_properties").empty();
        
        $.each(vocabularies[$(this).val()].classes,function(index, value){
            var div = $("<div />");
            div.addClass("search_result_class");
            div.draggable({ revert: true, stack: ".search_result_classes", scope: 'mapping' });
            div.text(value);
        
            $("#search_result_classes").append(div);
        });
        $.each(vocabularies[$(this).val()].properties,function(index, value){
            var div = $("<div />");
            div.addClass("search_result_property");
            div.draggable({ revert: true, stack: ".search_result_property", scope: 'mapping' });
            div.text(value);
            $("#search_result_properties").append(div);
        });
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