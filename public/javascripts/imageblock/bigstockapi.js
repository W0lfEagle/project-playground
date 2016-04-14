// change to your account id at bigstock.com/partners
var account_id = '274212';
var selected_category, search_term, page, max_page, jsonp_happening; //, infinite_scrol
var limit = "&limit=9";

$(function() {
    
    // console.log("doing image things");

  // open search modal on page load
//   $("#search-form").modal({
//     backdrop: 'static'
//   });

  // populate the categories
//   $.getJSON("https://api.bigstockphoto.com/2/" + account_id + "/categories/?callback=?", function(data) {
//     if (data && data.data) {
//       $.each(data.data, function(i, v) {
//         if (v.name == "Sexual") {
//           return;
//         }
//         $("#categories ul").append("<li><a href='#'>" + v.name + "</a></li>");
//       });
//     }
//   });

  // when the user clicks on a category
//   $("#categories").on("click", "a", function(e) {
//     selected_category = $(this).text();
//     $(".form-search").trigger("submit", {
//       category: true
//     });
//   });

  // show a loading message when the search button is clicked
  $("html").on("submit", ".form-search", function(e, val) {
    page = 1;
    
    var results = $("#results");
    results.html("")
    results.append("<li id=\"loading\"><span class=\"label\">Loading...</span></li>");
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
    $("#categories").hide();
    $("#results-holder").show('medium');
    $("#category-link").show();
    e.preventDefault();
  })

  // infinite scroll
//   infinite_scroll = setInterval(function() {
//     var offset = $("#results li:last").offset();

//     if (offset && offset.top < 1000 && !jsonp_happening && page < max_page && $("#results-holder").is(":visible")) {
//       page++;
//       $("html").trigger("bigstock_search", {
//         q: search_term,
//         category: selected_category,
//         page: page
//       })
//     }

//   }, 100);

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

    $.getJSON("https://api.bigstockphoto.com/2/" + account_id + "/search/?callback=?" + limit, params, function (data) {
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

// when a user clicks on a thumbnail
// $("#results").on("click", "a", function(e) {
//   $.getJSON("https://api.bigstockphoto.com/2/" + account_id + "/image/" + $(this).attr("href").substring(1) + "/?callback=?", function(data) {
//     if (data && data.data && data.data.image) {
//       var detail_template = $(".detail-template");
//       detail_template.find("img").attr("src", data.data.image.preview.url);
//       detail_template.find("h3").html(data.data.image.title);
//       $(".detail-template").modal({
//         backdrop: false
//       });
//       e.preventDefault();
//     }
//   });
// });

// when a user clicks on the "select this image" button
// $(".detail-template").on("click", ".btn-primary", function(e) {
//   alert('Here you will need server-side code to purchase and download the un-watermarked image. See the documentation at http://bigstock.com/partners/')
// });

// when a user clicks "browse by category"
// $("#category-link").click(function(e) {
//   $("#results-holder, #category-link").hide();
//   $("#categories").show('medium');
//   e.preventDefault();
// });

function setImages(search_term) {
    $('.search-query').val(search_term);
    $('#image-search-submit').click();
}