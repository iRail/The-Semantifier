/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

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