import theaterJS from "theaterjs";

document.addEventListener("DOMContentLoaded", function(){
  var firstHow = document.getElementById('how-1');
  var secondHow = document.getElementById('how-2');
  var thirdHow = document.getElementById('how-3');
  var userChoice = document.getElementById('choice');
  var prepareSecondHow = function(choice){
    firstHow.style.display = 'none';
    secondHow.style.display = 'flex';
    var i = document.getElementById('how-amount');
    secondHow.querySelector('.how-section__content').classList.add(choice);
    var result = secondHow.querySelector('.how-section__content__lead-text.result');
    var timeTravel = document.getElementById('time-travel');
    var validateAmount = function(t){
      timeTravel.classList.remove('disabled');
      if (t.value > 9999) {
        t.value = 9999
      }else if (Number(t.value) === t.value || t.value % 1 !== 0) {
        t.value = Math.round(t.value);
      }else if (t.value == 0) {
        timeTravel.classList.add('disabled');
      }
    }
    if (choice == 'yes') {
      userChoice.value = "yes";
      secondHow.querySelector('.how-section__content__lead-text.choice').innerHTML = "Quero comprar";
      secondHow.querySelector('.how-section__content__lead-text.price').innerHTML = "R$0.40";
      timeTravel.classList.add('cyan');
      i.addEventListener('change', function(e){
        validateAmount(e.target);
        result.innerHTML = 'R$' + (e.target.value*0.4).toFixed(2);
      });
    }else {
      userChoice.value = "no";
      secondHow.querySelector('.how-section__content__lead-text.choice').innerHTML = "Quero vender";
      secondHow.querySelector('.how-section__content__lead-text.price').innerHTML = "R$(1.00 - 0.40)";
      timeTravel.classList.add('pink', 'accent-2');
      i.addEventListener('change', function(e){
        validateAmount(e.target);
        result.innerHTML = 'R$' + (e.target.value*(1-0.4)).toFixed(2);
      });
    }
  }
  var prepareThirdHow = function(t){
    if ((' ' + t.className + ' ').indexOf(' disabled ') == -1) {
      secondHow.style.display = 'none';
      thirdHow.style.display = 'flex';
      var i = document.getElementById('how-amount');
      thirdHow.querySelector('.how-section__content').classList.add(userChoice.value);
      if (userChoice.value == 'yes') {
        thirdHow.querySelector('.how-section__content__lead-text.position').innerHTML = "Como estou \"comprado\", meus contratos serão vendidos a";
        thirdHow.querySelector('.how-section__content__lead-text.calc').innerHTML = i.value + " x R$(1.00 - 0.40)";
        thirdHow.querySelector('.how-section__content__lead-text.result').innerHTML = "R$"+ i.value*0.6;
        thirdHow.querySelector('#how-faq-btn').classList.add('cyan');
      }else {
        thirdHow.querySelector('.how-section__content__lead-text.position').innerHTML = "Como estou \"vendido\", meus contratos serão recomprados a";
        thirdHow.querySelector('.how-section__content__lead-text.calc').innerHTML = i.value + " x R$(0.40 - 1.00)";
        thirdHow.querySelector('.how-section__content__lead-text.result').innerHTML = "-R$"+ i.value*0.6;
        thirdHow.querySelector('#how-faq-btn').classList.add('pink', 'accent-2');
      }
    }
  }
  var btns = document.querySelectorAll(".how-btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(e){
      if (e.target.id == "yes" || e.target.id == "no") {
        prepareSecondHow(e.target.id);
      }else if (e.target.id == "time-travel") {
        prepareThirdHow(e.target);
      }else if (e.target.id == "how-register-btn") {
        window.location = "/accounts/signup/";
      }
    });
  }

  // if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1){
  //   var logo = document.querySelector(".logo").getBoundingClientRect();
  //   var eyes = document.querySelectorAll(".logo_eye");
  //   var height = document.documentElement.offsetHeight;
  //   var width = document.documentElement.offsetWidth;
  //   document.onmousemove = function(e){
  //     if (e.pageY > logo.top && e.pageX > logo.left && e.pageY < logo.bottom && e.pageX < logo.right) {
  //       eyes[0].style.transform = "translate(0,0)";
  //       eyes[1].style.transform = "translate(0,0)";
  //     }else {
  //       var y = (e.pageY-((logo.top+logo.bottom)/2))/height;
  //       var x = (e.pageX-((logo.left+logo.right)/2))/width;
  //       var distY = e.pageY-((logo.top+logo.bottom)/2); //opposite
  //       var distX = e.pageX-((logo.left+logo.right)/2); //adjacent
  //       var dist = Math.sqrt((distY*distY)+(distX*distX)); //hypotenuse,
  //       var val = distY/dist;
  //       var aSine = Math.asin(val)*(180/Math.PI);
  //       if (distX < 0) {
  //         aSine = 180 - aSine;
  //       }
  //       aSine+=55;
  //       var delta = 10;
  //       eyes[0].style.transform = "translate("+x*delta+"px,"+y*delta+"px) rotate("+aSine+"deg)";
  //       eyes[0].style.transformOrigin = "50% 50%";
  //       eyes[1].style.transform = "translate("+x*delta+"px,"+y*delta+"px) rotate("+aSine+"deg)";
  //       eyes[1].style.transformOrigin = "50% 50%";
  //     }
  //   }
  // }

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
    .addScene('guroo:Prove o seu conhecimento.', 1200)
    .addScene('guroo:Ganhe com suas previsões.', 10000)
    .addScene(theater.replay)

  $('.scrollspy').scrollSpy({
    scrollOffset: 0
  });
});
