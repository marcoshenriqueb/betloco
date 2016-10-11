import theaterJS from "theaterjs";

document.addEventListener("DOMContentLoaded", function(){
  var logo = document.querySelector(".logo").getBoundingClientRect();
  var eyes = document.querySelectorAll(".logo_eye");
  var height = document.documentElement.offsetHeight;
  var width = document.documentElement.offsetWidth;
  document.onmousemove = function(e){
    if (e.pageY > logo.top && e.pageX > logo.left && e.pageY < logo.bottom && e.pageX < logo.right) {
      eyes[0].style.transform = "translate(0,0)";
      eyes[1].style.transform = "translate(0,0)";
    }else {
      var y = (e.pageY-((logo.top+logo.bottom)/2))/height;
      var x = (e.pageX-((logo.left+logo.right)/2))/width;
      var distY = e.pageY-((logo.top+logo.bottom)/2); //opposite
      var distX = e.pageX-((logo.left+logo.right)/2); //adjacent
      var dist = Math.sqrt((distY*distY)+(distX*distX)); //hypotenuse,
      var val = distY/dist;
      var aSine = Math.asin(val)*(180/Math.PI);
      if (distX < 0) {
        aSine = 180 - aSine;
      }
      aSine+=55;
      var delta = 10;
      eyes[0].style.transform = "translate("+x*delta+"px,"+y*delta+"px) rotate("+aSine+"deg)";
      eyes[0].style.transformOrigin = "50% 50%";
      eyes[1].style.transform = "translate("+x*delta+"px,"+y*delta+"px) rotate("+aSine+"deg)";
      eyes[1].style.transformOrigin = "50% 50%";
    }
  }
  var theater = theaterJS({
    "minSpeed": {
      "erase": 30,
      "type": 80
    },
    "maxSpeed": {
      "erase": 30,
      "type": 80
    }
  })
  theater
    .on('type:start, erase:start', function () {
      // add a class to actor's dom element when he starts typing/erasing
      var actor = theater.getCurrentActor()
      actor.$element.classList.add('is-typing')
    })
    .on('type:end, erase:end', function () {
      // and then remove it when he's done
      var actor = theater.getCurrentActor()
      actor.$element.classList.remove('is-typing')
    })
  theater
    .addActor('guroo',{accuracy: 1})
  theater
    .addScene('guroo:Quem vai ser eleito prefeito do Rio?', 1200)
    .addScene('guroo:Qual vai ser o próximo presidente dos EUA?', 400)
    .addScene('guroo:Qual time vai ser campeão brasileiro?', 400)
    .addScene('guroo:Dê o seu palpite', 1200, ', e ganhe com ele!!', 1800)
    .addScene(theater.replay)
});
