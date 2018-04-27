var sector = ["Energy","Consulting","Manufacturing","Technology","Services","Education","Finance","Health","Other"];
var regions = ["Global","Asia","Europe","Africa","North America","Middle East"];
var partners = ["United Nations High Commissioner for Refugees","International non-profits","Government agencies","Refugee-owned businesses","Multiple partners","Private-sector organizations","Local non-profits"]
var filters = {
  "sector":[],
  "regions":[],
  "partners":[  ]
};

var PassFilterSet = []


var numCards = [4,3,2,1];
var screenSize;
function detectSize(w) {
  var s;
  if (w >= 1100) {
    s = 0;
  } else if (w >= 769) {
    s = 1;
  } else if (w >= 500) {
    s = 2;
  } else {
    s = 3;
  }

  return s;
}

function cardSort(data) {
    var sortedArray = data.sort(function (a, b) {
          if (a.company < b.company) return -1;
          else if (a.company > b.company) return 1;
          return 0;
        });
    return sortedArray;
}

function AddRemoveItem(dis,filters) {

  // figure out which group was selected from
    var nowList;
    if ($(dis).hasClass("sector")) {nowList = filters.sector;}
    else if ($(dis).hasClass("regions")) {nowList = filters.regions;} 
    else if ($(dis).hasClass("partners")) {nowList = filters.partners}
    
    // if not active, activate this filter by adding it to the filters item
    if ($(dis).hasClass("active") == false) {      
      var q = 0;
      for (var i = 0; i < nowList.length; i++) {
        if (nowList[i] == $(dis)[0].innerHTML) {
          q++;
        }
      }
      if (q < 1) {
        nowList.push($(dis)[0].innerHTML)
      }      
    } 
    // if the clicked thing is already an active filter, remove the filter
    else {      
      var index = nowList.indexOf($(dis)[0].innerHTML);
      if (index > -1) {
        nowList.splice(index, 1);
      }
    }
}

function filterType(data,filtersInner,type) {    
  var newData = [];

  if (filtersInner.length == 0) {
    newData = JSON.parse(JSON.stringify(data))
  } else {
    for (var j = data.length - 1; j >= 0; j--) { 
      if (type == "sector") {
        for (var i = 0; i < filtersInner.length; i++) {
          if (data[j][type] == filtersInner[i]) {
            newData.push(data[j])
          }
        }
      } 
      else {
        dance:
        for (var k = 0; k < data[j][type].length; k++) {
          for (var i = 0; i < filtersInner.length; i++) {
            if (data[j][type][k] == filtersInner[i]) {
              newData.push(data[j])
              break dance;              
            }
          }  
        }
      }    
    }     
  }
  return newData;
}

function filterCards(data,filters) {
    // go into first fitler, go through all data
    // if qualifies for any of the filter objects, add to intersticial

    // go into second filter, go through intersticial, if qualifies for any of the filter objects, add to new data, return intersticial (2)
    //  go into third filter, go through intersticial, 

  var finalData = []
  
  for (var type in filters) {
    if (type == "sector") {
      finalData = filterType(data,filters[type],type)
    } else {
      finalData = filterType(finalData,filters[type],type)
    }
  }
  return finalData;

}


///////////document is ready ////////////////
$(document).ready(function(){
  // Add options to DOM
 for (var i = 0; i < sector.length; i++) {
    var bar = "<div class='bar'></div>"
    var option = "<div class='option sector'>"+ sector[i] +"</div>"
    $('#myDropdown1').append(bar)
    $('#myDropdown1').append(option)
  } 

 for (var i = 0; i < regions.length; i++) {
    var bar = "<div class='bar'></div>"
    var option = "<div class='option regions'>"+ regions[i] +"</div>"
    $('#myDropdown2').append(bar)
    $('#myDropdown2').append(option)
  }

  for (var i = 0; i < partners.length; i++) {
    var bar = "<div class='bar'></div>"
    var option = "<div class='option partners'>"+ partners[i] +"</div>"
    $('#myDropdown3').append(bar)
    $('#myDropdown3').append(option)
  }

  // should we sort by alphabetical?
  // draw this mini cards
  for (var i = 0; i < tracker.length; i++) {
    // add all minis to the DOM
    var mini = '<div class="card-mini"><div class="card-inner mini"><div class="card-inner-mini-text"><h1>' + tracker[i].company +'</h1><h3>' + tracker[i].sector + '</h3></div></div></div>';
    $("#main-container-inner-inner").append(mini);

    // add all minis to the PassFilterSet=yes to begin with
    // console.log(PassFilterSet)
    // PassFilterSet["yes"].push(tracker[i])
   
  }


  // console.log(tracker[4])


  /////////// Jquery interaction functions ////////////

    // filter dropdown actions
  $(".dropbtn").mouseover(function(){
    $(this).children().addClass("hover")
  })
  $(".dropbtn").mouseout(function(){  
    $(this).children().removeClass("hover")
  })

  $(document).click(function(){
    $('.dropbtn').children().removeClass("active")
  })

  $(".dropbtn").click(function(e){  
    e.stopPropagation();
    $(this).siblings().children().removeClass("active")
    $(this).siblings().children().removeClass("active")
    $(this).children().toggleClass("active")  
  })


/////////////  // on click of options from the dropdown/ ////////////

  $(".option").click(function(e){
    e.stopPropagation();

    var t0 = performance.now();

    // Add/remove items from filter array
    AddRemoveItem(this,filters)

    var finalData;
    finalData =filterCards(tracker,filters)
    console.log(finalData)

    finalData = cardSort(finalData)


    // visibility classes
    $(this).toggleClass("active")
    $(this).prev().toggleClass("active")

    $("#main-container-inner-inner").empty();
    for (var i = 0; i < finalData.length; i++) {
      // add all minis to the DOM
      var mini = '<div class="card-mini"><div class="card-inner mini"><div class="card-inner-mini-text"><h1>' + finalData[i].company +'</h1><h3>' + finalData[i].sector + '</h3></div></div></div>';
      $("#main-container-inner-inner").append(mini);     
    }


    // timer
    var t1 = performance.now();
    console.log("Filtering took " + (t1 - t0) + " milliseconds.")
  })




  $(".exex").click(function(e){
    e.stopPropagation();
    $(this).parent().parent().hide();
    $('.card-mini').removeClass('active');

    // remove active from the mini card
  })

  $(".card-mini").click(function(e){
    e.stopPropagation();

    // some reason this isn't working for newly createed itemss

    // if active already do nothing
    // else 
      // remove all active
      $('.card-mini').removeClass('active')
      // add "active" class to selected mini
      $(this).addClass('active')      

      // find index of "this" relative to .card-mini's
      var cardIndex = $('.card-mini').index(this);
      var width = $( document ).width();
      screenSize = detectSize(width);
      var row = Math.floor(cardIndex / numCards[screenSize]) + 1;
      var cardspRow = numCards[screenSize];
      var Largeposition = row*cardspRow-1;
        
      // create large card 
      $(".card-large").remove()
      // get the data from this mini card  that was selected... add it to the large card. 
      console.log(this)
      // console.log(finalData)
      var largey = '<div class="card-large"><div class="card-inner"><div class="exex"></div><div class="card-inner-large-text"><div class="map"><img src="/images/world.png"><div class="map-text"><p>Works with refugees in areas in Africa, Asia, and the Middle East. </p></div></div><div class="large-text-container"><div class="large-text-inner"><h1>Encel Core Onlus</h1><h3>Consulting</h3><p>Nunc et placerat eros, eget vestibulum nisi. Pellentesque habitant morbi tristique senectus et netus et malesuadafames ac turpis egestas. Vivamus id accumsan urna, vitae pharetra mi. Nulla ut placerat magna. Aenean euismod turpisfelis, vel scelerisque est blandit ut. Nullam in lectus mi. Curabitur porta placerat mauris, sed posuere mi aliquam et</p><p><strong>Pellentesque:</strong> in orci vitae ex scelerisque suscipit.</p><p><strong>Started:</strong> 2005</p></div></div></div></div></div>';
      $("#main-container-inner-inner").append(largey);

      // change large card location
      $(".card-large").insertAfter('.card-mini:eq(' + Largeposition +')');

      // TO DO
      // update large card information
        //change large card data/text
        //change large card map
      
      // "show" the large card
      $(".card-large").show();

  })

  $( window ).resize(function() {
      var width = $( document ).width();
      var newScreen = detectSize(width);

      // console.log(screenSize)

      if (screenSize != newScreen) {      
        // move the large item to new spot
        // if ($("card-large").is(":visible")) {
          screenSize = newScreen;
          var cardIndex = $('.card-mini').index($('.card-mini.active'));
          // console.log(cardIndex)

          // console.log($('.card-mini.active'))

          var row = Math.floor(cardIndex / numCards[screenSize]) + 1;
          var cardspRow = numCards[screenSize];
          var Largeposition = row*cardspRow-1;
          
          // change large card location
          $(".card-large").insertAfter('.card-mini:eq(' + Largeposition +')');
        // }

      }

      // var screenSize = detectSize(width);
  })

})