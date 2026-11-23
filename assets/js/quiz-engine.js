/**
 * Course quiz engine — shared across course sites (rsod2026, prba2026,
 * ...), each keeping its own copy of this file. Mounts a self-grading
 * quiz into a container and POSTs the result to the shared PHP backend
 * in _server/, tagged with which course and lecture page it's on.
 *
 * Usage (top of a lecture .qmd, as raw HTML):
 *   <div id="course-quiz"></div>
 *   <script src="../assets/js/quiz-engine.js"></script>
 *   <script>
 *     CourseQuiz.mount(document.getElementById('course-quiz'), {
 *       course: "rsod2026",
 *       lecture: "wyklad2",
 *       submitUrl: "https://sebastianzajac.pl/rsod-quiz/submit.php",
 *       questions: [ { id, points, diff, text, code, options:[{v,t}] }, ... ],
 *       openQuestion: { title, text } // Optional; stored as answers.code for manual review.
 *     });
 */
(function (global) {
  "use strict";

  var STYLE_ID = "rsod-quiz-style";
  var CSS = "#rsod-quiz{font-family:inherit;width:100%;max-width:820px;margin:1.5rem 0 2.5rem;padding:clamp(18px,3vw,32px);border:1px solid #d5dfe8;border-top:4px solid #285680;border-radius:10px;background:#fff;color:#203247;box-sizing:border-box}\n#rsod-quiz *,#rsod-quiz *::before,#rsod-quiz *::after{box-sizing:border-box}\n#rsod-quiz .rq-kicker{font-size:.75rem;font-weight:750;letter-spacing:.1em;text-transform:uppercase;color:#285680;margin:0 0 8px}\n#rsod-quiz h3{margin:0 0 14px;font-size:1.4rem;line-height:1.35;border:0;padding:0}\n#rsod-quiz .rq-summary{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}\n#rsod-quiz .rq-summary span{padding:5px 10px;background:#edf3f8;border-radius:5px;font-size:.82rem;font-weight:600;line-height:1.5}\n#rsod-quiz .rq-instructions{font-size:.95rem;line-height:1.65;margin:0 0 24px;color:#43556a}\n#rsod-quiz .rq-form{display:block;width:100%;min-width:0}\n#rsod-quiz .rq-field{display:flex;flex-direction:column;gap:8px;margin:0 0 32px;padding:0 0 24px;border-bottom:1px solid #d5dfe8}\n#rsod-quiz input[type=email]{width:100%;padding:11px 12px;border:1px solid #9aaec2;border-radius:6px;font:inherit;background:#fff;color:#203247}\n#rsod-quiz .rq-field small,#rsod-quiz .rq-editor-help{font-size:.82rem;line-height:1.5;color:#526477}\n#rsod-quiz .rq-questions{display:flex!important;flex-direction:column!important;gap:28px;width:100%;min-width:0}\n#rsod-quiz fieldset.rq-q{display:block;float:none;min-width:0;width:100%;margin:0;padding:0 0 28px;border:0;border-bottom:1px solid #d5dfe8;background:transparent}\n#rsod-quiz fieldset.rq-q:last-child{border-bottom:0;padding-bottom:0}\n#rsod-quiz .rq-q legend{float:none;display:flex;align-items:flex-start;gap:10px;width:100%;margin:0 0 12px;padding:0;font-size:1.05rem;font-weight:650;line-height:1.55;color:#203247}\n#rsod-quiz .rq-number{display:inline-flex;flex:0 0 30px;align-items:center;justify-content:center;height:30px;border-radius:6px;background:#285680;color:#fff;font-size:.9rem;line-height:1}\n#rsod-quiz .rq-question-title{flex:1;min-width:0}\n#rsod-quiz .rq-meta{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:.8rem;line-height:1.5;color:#56677a;margin:0 0 14px}\n#rsod-quiz .rq-code-block{min-width:0;margin:0 0 16px;border:1px solid #d5dfe8;border-radius:6px;overflow:hidden;background:#f5f7fa}\n#rsod-quiz .rq-code-label{padding:7px 14px;border-bottom:1px solid #dfe5ec;color:#526477;font:600 .75rem/1.4 system-ui,sans-serif;letter-spacing:.04em}\n#rsod-quiz pre{max-width:100%;margin:0;padding:14px 16px;background:transparent;color:#172b3a;overflow-x:auto;font:14px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre;tab-size:4}\n#rsod-quiz pre code{padding:0;background:transparent;color:inherit;font:inherit;white-space:inherit}\n#rsod-quiz .rq-opts{display:flex!important;flex-direction:column!important;gap:8px;width:100%;min-width:0}\n#rsod-quiz label.rq-opt{position:relative;display:flex!important;float:none;width:100%;gap:10px;align-items:flex-start;margin:0;padding:12px;border:1px solid #cbd6e2;border-radius:6px;background:#fff;cursor:pointer;line-height:1.55;font-size:.95rem;text-align:left}\n#rsod-quiz .rq-opt input[type=radio]{flex:0 0 auto;width:18px;height:18px;margin:4px 0 0;accent-color:#285680}\n#rsod-quiz .rq-option-letter{display:inline-flex;flex:0 0 26px;align-items:center;justify-content:center;height:26px;border-radius:4px;background:#edf2f7;color:#43556a;font-size:.82rem;font-weight:750;line-height:1}\n#rsod-quiz .rq-option-text{flex:1;min-width:0;overflow-wrap:anywhere;padding-top:1px}\n#rsod-quiz .rq-option-text code{font-size:.94em;color:#203247}\n#rsod-quiz .rq-opt:hover{background:#f5f8fc;border-color:#829eb9}\n#rsod-quiz .rq-opt:has(input:checked){background:#eaf2fc;border-color:#285680;box-shadow:inset 3px 0 #285680}\n#rsod-quiz .rq-opt:has(input:checked) .rq-option-letter{background:#285680;color:#fff}\n#rsod-quiz .rq-opt:focus-within{outline:2px solid #7badd4;outline-offset:2px}\n#rsod-quiz input[type=email]:focus-visible,#rsod-quiz button:focus-visible,#rsod-quiz textarea:focus-visible{outline:2px solid #7badd4;outline-offset:3px}\n#rsod-quiz .rq-open-question legend{color:#183e5b;font-size:1.12rem}\n#rsod-quiz .rq-open-question .rq-meta{display:block;padding:9px 12px;background:#edf3f8;border-left:3px solid #7096b6;color:#36546d}\n#rsod-quiz .rq-code-prompt{font-size:.95rem;line-height:1.7;margin:0 0 18px}\n#rsod-quiz .rq-editor-label{display:block;margin-bottom:6px;font-weight:650}\n#rsod-quiz .rq-editor-help{margin:0 0 10px}\n#rsod-quiz .rq-code-input{display:block;width:100%;min-width:0;min-height:18rem;padding:14px;border:1px solid #9aaec2;border-radius:6px;background:#f8fafc;color:#172b3a;font:14px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;tab-size:4;white-space:pre;overflow:auto;resize:vertical}\n#rsod-quiz .rq-footer{margin-top:28px;padding-top:24px;border-top:1px solid #ccd8e4}\n#rsod-quiz .rq-footer p{font-size:.85rem;line-height:1.55;color:#526477;margin:12px 0 0}\n#rsod-quiz button.rq-submit{min-height:46px;padding:12px 20px;background:#285680;color:#fff;border:0;border-radius:6px;font:inherit;font-weight:650;cursor:pointer;white-space:normal}\n#rsod-quiz button.rq-submit:hover{background:#1e4365}\n#rsod-quiz button.rq-submit:disabled{opacity:.65;cursor:not-allowed}\n#rsod-quiz .rq-result,#rsod-quiz .rq-error{margin-top:20px;padding:18px;border-radius:6px;line-height:1.6}\n#rsod-quiz .rq-result{background:#e7f4eb;border:1px solid #8bb69a;color:#20472d}\n#rsod-quiz .rq-error{background:#fff0ed;border:1px solid #d59889;color:#812d1b}\n#rsod-quiz .rq-score{font-size:1.8rem;font-weight:750}\n@media(max-width:540px){#rsod-quiz{padding:18px 14px}#rsod-quiz .rq-q legend{font-size:1rem}#rsod-quiz label.rq-opt{padding:11px 9px;gap:8px}#rsod-quiz pre{padding:12px;font-size:13px}#rsod-quiz input[type=email],#rsod-quiz .rq-code-input{font-size:16px}#rsod-quiz button.rq-submit{width:100%}}\n";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  var DISPLAY_LETTERS = ["A", "B", "C", "D"];

  // Fisher-Yates. Grading uses each option's own `v` (submitted as the
  // radio's value), never the on-screen position — shuffling display
  // order only stops "always pick the Nth option" guessing, it can't
  // desync grading.
  function shuffled(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function counted(value, forms) {
    var ending = value % 10;
    var lastTwo = value % 100;
    var form = value === 1 ? forms[0] :
      (ending >= 2 && ending <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? forms[1] : forms[2]);
    return value + " " + form;
  }

  function mount(container, config) {
    injectStyle();
    var questions = config.questions;
    var openQuestion = config.openQuestion;
    var maxScore = questions.reduce(function (s, q) { return s + q.points; }, 0);

    container.innerHTML =
      '<p class="rq-kicker">Karta testowa · powtórka</p>' +
      "<h3>" + (config.title || config.lecture) + "</h3>" +
      '<div class="rq-summary"><span>' + counted(questions.length, ['pytanie', 'pytania', 'pytań']) + '</span><span>' +
      counted(maxScore, ['punkt', 'punkty', 'punktów']) + '</span><span>Jedna odpowiedź na pytanie</span></div>' +
      '<p class="rq-instructions">Pracuj samodzielnie. Wpisz e-mail i zaznacz po jednej odpowiedzi we wszystkich pytaniach.' +
      (openQuestion ? ' Napisz również program w polu poniżej. Po wysłaniu zobaczysz wynik testu wyboru; kod oceni prowadzący osobno.' : ' Następnie wyślij test, aby otrzymać wynik.') + '</p>' +
      '<form class="rq-form">' +
      '<div class="rq-field"><label for="rq-email"><strong>E-mail</strong></label>' +
      '<input type="email" id="rq-email" required autocomplete="email" aria-describedby="rq-email-help" placeholder="imie.nazwisko@wat.edu.pl"><small id="rq-email-help">Adres pozwoli prowadzącemu przypisać wynik do Ciebie.</small></div>' +
      '<div class="rq-questions"></div>' +
      '<div class="rq-footer"><button type="submit" class="rq-submit">Wyślij test i pokaż wynik</button>' +
      '<p>Po wysłaniu poczekaj na potwierdzenie zapisu i liczbę zdobytych punktów.</p></div>' +
      "</form>" +
      '<div class="rq-output" role="status" aria-live="polite" aria-atomic="true"></div>';

    var qHost = container.querySelector(".rq-questions");
    questions.forEach(function (q, i) {
      var opts = shuffled(q.options)
        .map(function (o, idx) {
          return (
            '<label class="rq-opt"><input type="radio" name="' +
            q.id +
            '" value="' +
            o.v +
            '" required><span class="rq-option-letter" aria-hidden="true">' +
            DISPLAY_LETTERS[idx] +
            '</span><span class="rq-option-text">' +
            o.t +
            "</span></label>"
          );
        })
        .join("");
      var block = el(
        '<fieldset class="rq-q">' +
          '<legend><span class="rq-number">' + (i + 1) + '</span><span class="rq-question-title">' + q.text + '</span></legend>' +
          '<div class="rq-meta"><span>Pytanie ' + (i + 1) + ' z ' + questions.length +
          '</span><span>' + q.points + ' pkt · ' + (q.diff || '') + '</span></div>' +
          (q.code ? '<div class="rq-code-block"><div class="rq-code-label">C++</div><pre><code>' + q.code.replace(/</g, "&lt;") + "</code></pre></div>" : "") +
          '<div class="rq-opts">' + opts + '</div>' +
          '</fieldset>'
      );
      qHost.appendChild(block);
    });

    if (openQuestion) {
      var codeBlock = el('<fieldset class="rq-q rq-open-question"><legend></legend>' +
        '<p class="rq-meta">Osobna odpowiedź do ręcznego sprawdzenia; poza wynikiem testu 0–' + maxScore + '.</p>' +
        '<p class="rq-code-prompt" id="rq-code-help"></p>' +
        '<label class="rq-editor-label" for="rq-code">Twój kompletny program C++</label>' +
        '<p class="rq-editor-help" id="rq-editor-help">Wpisz cały program. Wcięcia i nowe linie zostaną zachowane.</p>' +
        '<textarea id="rq-code" name="code" rows="14" maxlength="6000" required spellcheck="false" class="rq-code-input" ' +
        'autocapitalize="off" autocomplete="off" aria-describedby="rq-code-help rq-editor-help"></textarea></fieldset>');
      codeBlock.querySelector("legend").textContent = openQuestion.title;
      codeBlock.querySelector(".rq-code-prompt").textContent = openQuestion.text;
      qHost.appendChild(codeBlock);
      container.querySelector(".rq-summary").appendChild(el('<span>+ program do ręcznego sprawdzenia</span>'));
    }

    var form = container.querySelector(".rq-form");
    var output = container.querySelector(".rq-output");
    var submitBtn = container.querySelector(".rq-submit");

    if (openQuestion) {
      container.querySelector("#rq-code").addEventListener("input", function () {
        this.setCustomValidity("");
      });
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = container.querySelector("#rq-email").value.trim();
      var answers = {};
      questions.forEach(function (q) {
        var picked = form.querySelector('input[name="' + q.id + '"]:checked');
        answers[q.id] = picked ? picked.value : null;
      });

      if (openQuestion) {
        var codeField = container.querySelector("#rq-code");
        if (!codeField.value.trim()) {
          codeField.setCustomValidity("Wpisz swój program przed wysłaniem.");
          codeField.reportValidity();
          return;
        }
        answers.code = codeField.value;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Wysyłanie…";

      fetch(config.submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, course: config.course, lecture: config.lecture, answers: answers }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("http_" + r.status);
          return r.json();
        })
        .then(function (data) {
          if (!data.ok) throw new Error(data.error || "unknown_error");
          output.innerHTML =
            '<div class="rq-result"><div class="rq-score">' +
            data.score +
            " / " +
            data.maxScore +
            "</div><p>Wynik zapisany dla " +
            email +
            ".</p>" + (openQuestion ? "<p>Kod programu zapisano do ręcznego sprawdzenia. Powyższy wynik dotyczy tylko pytań wyboru.</p>" : "") + "</div>";
          submitBtn.textContent = "Wynik zapisany";
        })
        .catch(function (err) {
          output.innerHTML =
            '<div class="rq-error">Nie udało się zapisać wyniku (' +
            err.message +
            "). Spróbuj ponownie za chwilę lub napisz do prowadzącego.</div>";
          submitBtn.disabled = false;
          submitBtn.textContent = "Wyślij test i pokaż wynik";
        });
    });
  }

  global.CourseQuiz = { mount: mount };
})(window);
