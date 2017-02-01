function makeSimonClickable() {
  console.log("clickable");
  $(".b").removeClass("unclickable");
  $(".b").addClass("clickable");
}

function makeSimonUnclickable() {
  console.log("unclickable");
  $(".b").removeClass("clickable");
  $(".b").addClass("unclickable");
}

function resetDisplay() { 
    $(".setting").show();
    $("#display-count").removeClass("error");
    $("#display-count").text("00");
}

function displayCount(sequenceLength) {
  var countPassed = sequenceLength; 
  countPassed = (countPassed < 10) ? "0" + countPassed.toString() : countPassed.toString();
  $("#display-count").removeClass("error");
  $("#display-count").text(countPassed);
}

function winningMessage() {
  var audio = new Audio("http://www.freespecialeffects.co.uk/soundfx/music/fanfare4.wav");
  audio.play();
  $(".setting").hide();
  $("#wonMsg").text("YOU WON!");
  setTimeout(function() {
    $("#wonMsg").text("");
    $(".setting").show();
  }, 4000);
}

function errorMessage() { // it can be called before retrying
  var audio = new Audio("http://www.freespecialeffects.co.uk/soundfx/various/twang.wav");
  audio.play();
  $("#display-count").addClass("error");
  $("#display-count").text("!!!!");
}

function animateButton(buttonSelector) {
  var sounds = {".red": "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
              ".blue": "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
              ".green": "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
              ".yellow": "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"};
  var audio = new Audio(sounds[buttonSelector]);
  audio.play();  
  $(buttonSelector).addClass("light");
  setTimeout(function() {  $(".b").removeClass("light"); }, 500);
}

function playedRightSequence(sequence, index, onSuccess, onFailure) {  
  $(".b").unbind('click').click(function(event) {
    var clicked = $(event.target);
    var rightButton = sequence[index];
    var isTheRightOne = clicked.hasClass(rightButton.substr(1));
    if (isTheRightOne) {   
      animateButton(rightButton);
      if (index === sequence.length -1) {
        onSuccess();
      } else {
        index++;
        playedRightSequence(sequence, index, onSuccess, onFailure);  
      }      
    } else {
      onFailure();
    }
  });
}

function strictModeOn() {
  var mode = $("#display-mode").text();
  return (mode === "ON") ? true : false;
}

function automatedPlayOfSequence(sequence) {
  makeSimonUnclickable();
  var index = 0;
  var interval = setInterval(function(){
    $(".b").removeClass("light"); // remove from all
    var buttonSelector = sequence[index];
    animateButton(buttonSelector);
    index++;
    if (index === sequence.length) {
      makeSimonClickable();
      clearInterval(interval);
    }
  }, 1500);
 }

function addNewItemToSequence(sequence) {
  var buttonOptions = {1: ".red", 2: ".blue", 3: ".green", 4: ".yellow"};
  var randomNum = Math.floor((Math.random() * 4) + 1);
  var addedButtonSelector = buttonOptions[randomNum];
  sequence.push(addedButtonSelector);
  return sequence;
}

function playerTurn(sequence) {
  var onSuccess = function() {
    playGame(sequence);
  };
  var onFailure = function() {
    errorMessage();
    setTimeout(function() {
      if (strictModeOn()) {
        setupGame();      
      } else {
          displayCount(sequence.length);
          automatedPlayOfSequence(sequence);
          playerTurn(sequence);
        };
    }, 4000);
  };
  playedRightSequence(sequence, 0, onSuccess, onFailure);
}


function playGame(sequence) { 
  makeSimonUnclickable();
  var newSequence = addNewItemToSequence(sequence); // return list
  var count = newSequence.length;
  displayCount(count);
  if (count <= 3) {
    automatedPlayOfSequence(newSequence);
    playerTurn(newSequence);
 
  } else {
    winningMessage();
    main();
  }  
}

function setupGame() {
  var sequence = [];
  resetDisplay();
  playGame(sequence);
}

function changeMode(event) {
  var currentMode = $(event.target).text();
  var newMode = (currentMode === "OFF") ? "ON" : "OFF";
  $(event.target).text(newMode);
}

function main() {
  $("#start").unbind('click').click(setupGame);
  $("#display-mode").click(changeMode);
}

$(document).ready(main);