var editor = ace.edit("answer");
editor.setOptions({
  wrap: true,
  showGutter: false,
  highlightActiveLine: false,
  showPrintMargin: false,
  fontSize: 16
});
editor.session.setMode("ace/mode/rst");
editor.setTheme("ace/theme/solarized_light");

var init = function(sheet) {
  var index = 0;
  var question = document.querySelector(".question");
  var candidate = document.querySelector("#candidate");
  var button = document.querySelector("button.send");
  var setQuestion = function() {
    button.disabled = false;
    var row = sheet[index];
    if (!row) {
      editor.setValue("");
      editor.setOption("readOnly", true);
      question.innerHTML = "All done!";
    } else {
      editor.setValue(row.text);
      question.innerHTML = row.question;
    }
    var undo = editor.session.getUndoManager();
    // needs to be async for some reason
    setTimeout(function() { undo.reset() });
  };
  $(button).on("click", function() {
    if (!candidate.value) {
      return alert("Please fill in your name.");
    }
    button.disabled = true;
    var request = $.ajax({
      url: "https://script.google.com/macros/s/AKfycbxFiW6PfEnhUrbwI2d1_JGY5P6xgLczZw79VhWoIpkRX4PDVyOb/exec",
      jsonp: true,
      data: {
        index: index,
        candidate: candidate.value,
        question: sheet[index].question,
        answer: editor.getValue()
      }
    });
    question.innerHTML = "Loading, please wait..."
    request.then(function() {
      index++;
      setQuestion(index);
    });
  });
  setQuestion();
};

Tabletop({
  key: "1jJbW4dJUKb0sCDxogFLSPiRW-osmfn2Bm4ylu9m5HCE",
  wanted: ["questions"],
  simpleSheet: true,
  callback: init
});