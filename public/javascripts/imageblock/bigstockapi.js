/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: javascript for the image block bigstock api call
 * calls the api with the search query as described by the api docs
 * provides setImages() function to remotely set the image search on the student 
 * side
 */

var account_id = '274212'; // TODO keep secret
var selected_category, search_term, page, max_page, jsonp_happening;
var limit = 9; // limit number of search results, 3x3

$(function() {
  // show a loading message when the search button is clicked
  $("html").on("submit", ".form-search", function(e, val) {
    page = 1;
    
    var results = $("#results");
    results.html("")
    results.append("<span id=\"loading\" class=\"label\">Loading...</span>");
    var val = val || {};

    //check if the user selected a category or did a keyword search
    if (val.category) {
      search_term = "";
    } else {
      selected_category = "";
      search_term = $(".search-query").val();
    }

    //start the search
    $("html").trigger("bigstock_search", {
      q: search_term
    });
    // $("#categories").hide();
    $("#results-holder").show('medium');
    // $("#category-link").show();
    e.preventDefault();
  })
});

// populate the search results
$("html").on("bigstock_search", function(e, val) {
  if (!jsonp_happening) {
    jsonp_happening = true;
    var val = val || {};
    val.page = val.page || 1;
    var results = $("#results");

    //setup the paramaters for the JSONP request
    var params = {};
    if (val.category != "") params.category = val.category;
    params.q = val.q;
    params.page = val.page;

    $.getJSON("https://api.bigstockphoto.com/2/" + account_id + "/search/?callback=?&limit=" + limit, params, function (data) {
      results.find("#loading").remove();
      results.find("#oops").remove();
      
      if (data && data.data && data.data.images) {
        max_page = data.data.paging.total_pages;
        var template = $(".item-template");
        $.each(data.data.images, function(i, v) {
          template.find("img").attr("src", v.small_thumb.url);
          template.find("a").attr("href", "#" + v.id);
          results.append(template.html())
        });
      } else {
      	results.append("<li id=\"oops\"><div class=\"alert alert-error\">OOOPS! We found no results. Please try another search.</div></li>");
      }
      
      jsonp_happening = false;
    });
  }
})

// function to be called remotely by teacher side  
// no guarantee that student will recieve same search results
function setImages(search_term) {
    $('.search-query').val(search_term); // set the search query in the hidden search form field
    $('#image-search-submit').click(); // emulate click to initiate search functions and API call
}