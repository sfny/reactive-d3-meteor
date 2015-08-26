var Circles = new Meteor.Collection('circles');

if (Meteor.isServer) { 
  Meteor.startup(function () {
    if (Circles.find().count() === 0) {
      Circles.insert({data: [5, 8, 11, 14, 17, 20]});
    }
  });

// If meteor is the server, on startup look for Circle objects
// if none can be found, inster these 6 values into the Collection (mongo)

  Meteor.setInterval(function () {
    var newData = _.shuffle(Circles.findOne().data);
    Circles.update({}, {data: newData});
  }, 2000);
}
/* Set interval of 2000ms. Each interval, use Underscore's shuffle method to return a rearangeed COPY of the list of values.
findOne looks for the first data in a collection that meets the criteria, in this case the value array. 
Maybe findOne is used to stop the function from looking for more values? Research that later...

The collection.update method takes a min of 2 arguments. The Selector is empty, becasue we're selecting the entire collection (maybe?). 
The second update argument is 'how to modify the collection'. We want to take the existing 'data' and replace it with 'new Data'.  

*/

if (Meteor.isClient) {                            // OKAY getting to the good stuff.
  Template.vis.rendered = function () {              // Template.vis.rendered is what we want. But it's only avalible after the funciton is complete.
    var svg, width = $(window).width(), height = $(window).height()/6, x;

    svg = d3.select('#circles').append('svg')
      .attr('width', width)
      .attr('height', height);

    var drawCircles = function (update) {
      var data = Circles.findOne().data;
      var circles = svg.selectAll('circle').data(data);
      var color = d3.scale.category10();

      if (!update) {
        circles = circles.enter().append('circle')
          .attr('cx', function (d, i) { return x(i); })
          .attr('cy', height / 2);
      } else {
        circles = circles.transition().duration(2000); // animatate transition 
      }
      circles.attr('r', function (d) { return d*2; });
      circles.attr("fill", function() { return "hsl(" + Math.random() * 360 + ", 100%, 75%)" });

    };


    Circles.find().observe({
      added: function () {
        x = d3.scale.ordinal()
          .domain(d3.range(Circles.findOne().data.length))
          .rangePoints([0, width], 1);
        drawCircles(false);
      },
      changed: _.partial(drawCircles, true)
    });
  };
}
