/* Student laboratory progress. The server owns all teacher approvals. */
(function () {
  "use strict";
  var root = document.getElementById("lab-progress");
  if (!root) return;
  var endpoint = root.dataset.endpoint;
  var key = "wdp-cpp01-registration";
  var registration = null;
  var busy = false;
  var state = null;
  var storage;
  try {
    storage = window.sessionStorage;
    registration = JSON.parse(storage.getItem(key) || "null");
  } catch (_) {
    root.textContent = "Włącz pamięć sesji przeglądarki, aby rozpocząć zajęcia i zachować dostęp po odświeżeniu strony.";
    return;
  }
  var style = document.createElement("style");
  style.textContent = ".lp-inline{padding:10px;margin-top:16px;border-top:1px solid #ccd8e4}.lp-inline button{font:inherit;padding:8px;margin:4px}.lp-approved{color:#176334;font-weight:bold}#lab-progress{padding:20px;border:1px solid #ccd8e4;border-radius:10px;background:#f3f6fa;margin:20px 0}#lab-progress button,#lab-progress input{font:inherit;padding:8px;margin:4px}#lab-progress ol{padding-left:24px}#lab-progress li{padding:6px}#lab-progress .lp-error{color:#9b2222}#lab-progress .lp-message{min-height:1.5em}#lab-progress .lp-approved{color:#176334;font-weight:bold}";
  document.head.appendChild(style);
  root.innerHTML = '<form><label>E-mail: <input type="email" autocomplete="email" required maxlength="254"></label><button>Rozpocznij zajęcia</button></form><div class="lp-body"></div><p class="lp-message" role="status" aria-live="polite"></p>';
  var form = root.querySelector("form");
  var email = form.querySelector("input");
  var body = root.querySelector(".lp-body");
  var message = root.querySelector(".lp-message");
  var errors = {
    already_registered: "Ten e-mail jest już zapisany na dzisiejsze zajęcia. Wróć do karty, w której rozpoczęto pracę, lub zgłoś prowadzącemu utratę dostępu.",
    invalid_access: "Nie można odtworzyć dostępu. Sprawdź, czy to właściwa karta, lub skontaktuj się z prowadzącym.",
    invalid_email: "Wpisz poprawny adres e-mail.",
    save_unavailable: "Serwer jest chwilowo niedostępny. Spróbuj ponownie."
  };
  function notify(text, failed) {
    message.textContent = text;
    message.className = "lp-message" + (failed ? " lp-error" : "");
  }
  function render(data) {
    state = data;
    form.hidden = true;
    body.replaceChildren();
    var heading = document.createElement("p");
    heading.textContent = data.email + " · dzień zajęć: " + data.class_date;
    body.appendChild(heading);
    var count = data.tasks.filter(function (t) { return t.status === "approved"; }).length;
    var summary = document.createElement("p");
    summary.textContent = "Zatwierdzone: " + count + "/15. " + (data.finished_at ? "Zapisano zakończenie laboratorium." : "Postępy zapisują się na bieżąco.");
    body.appendChild(summary);
    document.querySelectorAll(".lp-inline").forEach(function (node) { node.remove(); });
    var sections = document.querySelectorAll(".lab-task");
    var list = document.createElement("ol");
    for (var n = 1; n <= 15; n++) {
      var item = document.createElement("li");
      var task = data.tasks.find(function (t) { return Number(t.task) === n; });
      var status = task ? task.status : "new";
      var label = document.createElement("span");
      label.textContent = "Zadanie " + n + ": " + ({new:"Do wykonania",pending:"Do sprawdzenia",approved:"Zatwierdzone",revision:"Do poprawy"})[status] + " ";
      if (status === "approved") label.className = "lp-approved";
      item.appendChild(label);
      if (status === "new" || status === "revision") {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = status === "new" ? "Zgłoś do sprawdzenia" : "Zgłoś ponownie";
        button.dataset.task = String(n);
        item.appendChild(button);
      }
      list.appendChild(item);
      if (sections[n - 1]) {
        var inline = document.createElement("div");
        inline.className = "lp-inline";
        inline.appendChild(item.firstChild.cloneNode(true));
        if (item.querySelector("button")) inline.appendChild(item.querySelector("button").cloneNode(true));
        sections[n - 1].appendChild(inline);
      }
    }
    var details = document.createElement("details");
    var detailsTitle = document.createElement("summary");
    detailsTitle.textContent = "Lista statusów wszystkich zadań";
    details.appendChild(detailsTitle);
    details.appendChild(list);
    body.appendChild(details);
    var refresh = document.createElement("button");
    refresh.type = "button";
    refresh.dataset.action = "status";
    refresh.textContent = "Odśwież statusy";
    body.appendChild(refresh);
    if (!data.finished_at) {
      var finish = document.createElement("button");
      finish.type = "button";
      finish.dataset.action = "finish";
      finish.textContent = "Zakończ laboratorium";
      body.appendChild(finish);
    }
  }
  async function request(action, task, quiet) {
    if (busy) return;
    busy = true;
    document.querySelectorAll("#lab-progress button,.lp-inline button").forEach(function (b) { b.disabled = true; });
    try {
      var response = await fetch(endpoint, {
        method: "POST", credentials: "omit", cache: "no-store",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action: action, token: registration.token, email: registration.email, task: task}),
        signal: AbortSignal.timeout(15000)
      });
      var data = await response.json();
      if (!response.ok || !data.ok) throw new Error(errors[data.error] || "Nie udało się zapisać lub odczytać postępów. Spróbuj ponownie.");
      render(data);
      if (!quiet || message.classList.contains("lp-error")) notify(action === "start" ? "Zapisano rozpoczęcie zajęć. Prowadzący widzi Cię na liście." : "Postępy są zapisane na serwerze.", false);
    } catch (error) {
      notify(error.message === "Failed to fetch" ? "Brak połączenia z serwerem. Spróbuj ponownie; nie zamykaj tej karty." : error.message, true);
    } finally {
      busy = false;
      document.querySelectorAll("#lab-progress button,.lp-inline button").forEach(function (b) { b.disabled = false; });
    }
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var normalized = email.value.trim().toLowerCase();
    if (!registration || registration.email !== normalized) {
      var bytes = crypto.getRandomValues(new Uint8Array(32));
      registration = {email: normalized, token: Array.from(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("")};
      try { storage.setItem(key, JSON.stringify(registration)); }
      catch (_) { notify("Nie można zapamiętać dostępu w tej karcie. Włącz pamięć sesji i spróbuj ponownie.", true); return; }
    }
    request("start");
  });
  body.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || busy) return;
    if (button.dataset.task) request("submit", Number(button.dataset.task));
    else request(button.dataset.action);
  });
  document.addEventListener("click", function (event) {
    var button = event.target.closest(".lp-inline button");
    if (button && !busy) request("submit", Number(button.dataset.task));
  });
  if (registration && typeof registration.token === "string" && typeof registration.email === "string") {
    email.value = registration.email;
    // Retrying start also recovers a registration whose response was lost.
    request("start");
  }
  setInterval(function () {
    if (state && !document.hidden) request("status", undefined, true);
  }, 30000);
}());
