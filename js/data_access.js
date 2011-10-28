/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var host = "http://localhost/TDT/";

var tdt_resource = null;
var tdt_package = null;

$(document).ready(function() {
    //    $("#left_pane").dialog({
    //        position:  ['left','top'],
    //        draggable: false,
    //        resizable:false
    //    });
    
    $("#no_ontology").hide();

    $("body").layout({
        applyDefaultStyles: true
    });

    $.getJSON(host+"TDTInfo/Resources.json",null,successHandler);
});

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
    
       
    var url = host+"TDTInfo/Ontology/"+tdt_package+"/"+tdt_resource+".rjson";
    $.ajax({
        url:url,
        success:ontologyLoaded,
        statusCode:{
            457:ontologyNonExisting
        }
    });
    
}

function ontologyNonExisting(){
    $("#no_ontology .title").text("The resource "+tdt_package+"/"+tdt_resource+" has no ontology");
    $("#no_ontology .content").text("Would you like to create one?");
    $("#no_ontology").show();
}

function ontologyLoaded(data){
    var ont = $.rdf().load(data, {});
    $.rdf()
    .where('?person a owl:Class')
    .each(function () {
        var person = this.person.value;
        $('#ontology').append('<li><a href="' + person + '"></a></li>');
    });
    
    
    

//    jOWL.parse(data,{});
//
//    //var tree = $('#ontology').owl_treeview({rootThing: true});
//
//    var ontology = jOWL(tdt_resource);
//    ontology.bind($("#ontology"));
//    alert(ontology.jnode);

//tree.propertyChange(ontology);
//tree.broadcast(ontology);
//    var last_ul = null;
//    var last_li = null;
//    var arr_temp = new Array();
//    $.each(data, 
//        function(i,item){
//            var li  = $("<li/>");
//            var li_span = $("<span/>");
//
//            
//            arr = i.split("/");
//            
//            var d = arr.length - arr_temp.length;
//            
//            if (d>0){
//                last_ul = $("<ul/>");
//                
//                if (last_li)
//                    last_ul.appendTo(last_li);
//                else
//                    last_ul.appendTo("#right_pane");
//                
//                li_span.text(arr[arr_temp.length]);
//                
//            } else if (d == 0){
//                li_span.text(arr[arr.length-1]);
//            } else if (d < 0){
//                li_span.text(arr[arr.length+d]);
//            }
//            arr_temp = arr;
//            li_span.appendTo(li);
//            li.appendTo(last_ul);
//            last_li = li;
//        }
//        );
      
}

