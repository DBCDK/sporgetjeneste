require("xmodule").def("main",function(){
require("mui");

function main(mui) {
  var email = mui.storage.getItem('email');
  var mobile = mui.storage.getItem('mobile');
  var answer = mui.storage.getItem('answer');
  if (answer === "choose" || (answer === "email" && email === "") || (answer === "sms" && mobile === "")) {
    settings(mui);
    return;
  }
  mui.showPage(["page", {title: "Sp\xf8rg biblioteket"},
      ["section",
        ["input", {type: "textbox", name: "question", label: "Mit sp\xf8rgsm\xe5l"}],
        ["choice", {name: "deadline"},
          ["option", {value: "choose"}, "V\xe6lg tidsfrist..."],
          ["option", {value: "-1"}, "ingen"],
          ["option", {value: "2"}, "2 timer"],
          ["option", {value: "24"}, "24 timer"],
          ["option", {value: "48"}, "2 dage"],
          ["option", {value: "168"}, "1 uge"] ],
        ["choice", {name: "use"},
          ["option", {value: "choose"}, "Svaret skal bruges til..."],
          ["option", {value: "personal"}, "Almen interesse"],
          ["option", {value: "business"}, "Erhverv"],
          ["option", {value: "school1"}, "Folkeskole"],
          ["option", {value: "school2"}, "Gymnasium"],
          ["option", {value: "school3"}, "Videreg\xe5ende uddannelse"],
          ["option", {value: "school4"}, "Universitet/Forskning"] ]],
        ["button", {fn: ask}, "Sp\xf8rg"],
        ["button", {fn: settings}, "Indstillinger"] ]);
}

function settings(mui) {
  mui.loading();
  var email = mui.storage.getItem('email');
  var mobile = mui.storage.getItem('mobile');
  var answer = mui.storage.getItem('answer');
  mui.showPage(["page", {title: "Indstillinger"},
      ["section",
        ["input", {type: "email", name: "email", label: "Min emailadresse", value: email}],
        ["input", {type: "tel", name: "mobile", label: "Mit mobilnummer", value: mobile}],
        ["choice", {name: "answer", value: answer},
          ["option", {value: "choose"}, "Jeg vil have svar p\xe5..."],
          ["option", {value: "email"}, "Email"],
          ["option", {value: "sms"}, "SMS"], ] ],
        ["button", {fn: saveSettings}, "Gem indstillinger"] ]);
}

function saveSettings(mui) {
  mui.loading();
  mui.storage.setItem('email', mui.form.email);
  var email = mui.storage.getItem('email');
  mui.storage.setItem('mobile', mui.form.mobile);
  var mobile = mui.storage.getItem('mobile');
  mui.storage.setItem('answer', mui.form.answer);
  var answer = mui.storage.getItem('answer');
  mui.showPage(["page", {title: "Indstillinger"},
      ["section",
        ["input", {type: "email", name: "email", label: "Min mailadresse", value: email}],
        ["input", {type: "tel", name: "mobile", label: "Mit mobilnummer", value: mobile}],
        ["choice", {name: "answer", value: answer},
          ["option", {value: "choose"}, "Jeg vil have svar p\xe5..."],
          ["option", {value: "email"}, "Email"],
          ["option", {value: "sms"}, "SMS"], ] ],
        ["button", {fn: main}, "Skriv Sp\xf8rgsm�l"] ]);
}

function ask(mui) {     
  mui.loading();
  var deadline = "";
  if (mui.form.deadline !== "-1" && mui.form.deadline !== "choose" ) {
    deadline = " indenfor de n\xe6ste " + mui.form.deadline + " timer";
  }
  var answer = mui.storage.getItem('answer');
  var email = mui.storage.getItem('email');
  var mobile = mui.storage.getItem('mobile');
  var answerText = "";
  if (answer === "email" && email !== "") {
    answerText = " p\xe5 " + email; 
  } else if (answer === "sms" && mobile !== "") {
    answerText = " via sms til " + mobile;
  }
  mui.callJsonpWebservice("http://didicas.dbc.dk/openquestion.addi.dk/trunk/", "callback", 
    { action: "createQuestion",
      agencyId: "150024",
      qandaServiceName: "Biblioteksvagten",
      questionContent: mui.form.question,
      questionDeadline: mui.form.deadline,
      questionUsage: mui.form.use,
      userEmail: email,
      userMobilePhone: mobile,
      userAnswerPreference: answer,
      outputType: "json"
    }, function(result) {
      if (result.createQuestionResponse.questionReceipt.$ === "Ack") {
        mui.showPage( ["page", {title: "Sp\xf8rg biblioteket"}, 
          ["section", 
            ["text", "Sp\xf8rgsm\xe5let er afleveret. Du vil f\xe5 svar", deadline, answerText, "."], 
            ["button", {fn: main}, "Nyt sp\xf8rgsm\xe5l"]]]);
      } else {
        mui.showPage( ["page", {title: "Sp\xf8rg biblioteket"}, 
            ["text", "Noget gik desv\xe6rre galt, pr\xf8v igen"], 
            ["button", {fn: main}, "Nyt sp\xf8rgsm\xe5l"]]);
      }
    });
}

require("mui").setMain(main);
});
