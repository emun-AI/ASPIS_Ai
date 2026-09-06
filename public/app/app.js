/* =========================================================
   ASPIS Ai — patient web app (vanilla HTML/CSS/JS)
   Hash routing + localStorage state + screen flows
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- state ---------------- */
  var KEY = "aspis-ai-state-v1";
  var defaults = {
    accountType: "patient",
    fullName: "",
    phone: "",
    email: "",
    dob: "1990-06-15",
    gender: "Female",
    location: "Kampala, Uganda",
    conditions: [],
    height: "165",
    weight: "65",
    bloodGroup: "O+",
    smokes: "No",
    drinks: "No",
    connected: [],
    signedUp: false,
    readings: [
      { id: "r1", type: "Blood Pressure", value: "120/80 mmHg", when: "Today, 8:00 AM" },
      { id: "r2", type: "Blood Sugar", value: "6.2 mmol/L", when: "Today, 7:30 AM" },
      { id: "r3", type: "Weight", value: "65 kg", when: "Today, 7:00 AM" },
      { id: "r4", type: "CD4 Count (HIV)", value: "450 cells/µl", when: "May 10, 2026" }
    ],
    reminders: {
      "Medication Reminders": true,
      "Appointment Reminders": true,
      "Health Check-ins": true,
      "Hydration Reminders": false,
      "Motivation & Tips": true
    },
    reminderTime: "08:00",
    checkins: [],
    aiStatus: "idle", // idle | pending | review | approved
    plan: "monthly",
    paymentMethod: "Mobile Money (MTN)",
    subscribed: false
  };

  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return Object.assign(JSON.parse(JSON.stringify(defaults)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(defaults));
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable */
    }
  }
  function set(patch) {
    Object.assign(state, patch);
    save();
  }

  /* ---------------- helpers ---------------- */
  var root = document.getElementById("root");
  var toastEl = document.getElementById("toast");
  var toastTimer;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }
  function go(hash) {
    location.hash = hash;
  }
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function on(sel, ev, fn, ctx) {
    $$(sel, ctx).forEach(function (el) {
      el.addEventListener(ev, fn);
    });
  }
  function logo(dark) {
    return (
      '<span class="logo' +
      (dark ? " on-dark" : "") +
      '"><span class="mark">◎</span>ASPIS <span class="green">Ai</span></span>'
    );
  }
  function firstName() {
    return (state.fullName || "Jane Namburio").split(" ")[0];
  }
  function priceLabel() {
    return state.plan === "monthly" ? "UGX 10,000" : "UGX 100,000";
  }

  /* ---------------- step shell ---------------- */
  function stepShell(step, total, title, subtitle, body, footer) {
    return (
      '<div class="wrap">' +
      '<div class="between">' +
      logo() +
      '<span class="tiny">Step ' +
      step +
      " of " +
      total +
      "</span></div>" +
      '<div class="progress"><i style="width:' +
      (step / total) * 100 +
      '%"></i></div>' +
      '<div class="card"><h1>' +
      esc(title) +
      "</h1>" +
      (subtitle ? '<p class="muted">' + esc(subtitle) + "</p>" : "") +
      '<div class="stack mt">' +
      body +
      "</div>" +
      (footer ? '<div class="stack mt">' + footer + "</div>" : "") +
      "</div></div>"
    );
  }

  /* =========================================================
     1. LANDING
     ========================================================= */
  function landing() {
    var features = [
      ["🫀", "AI health predictions", "Spot trends in your vitals before they become problems."],
      ["🩺", "Doctor review & approval", "Every recommendation is checked by a real clinician."],
      ["🔔", "Smart reminders", "Medication, check-ins and appointments, right on time."],
      ["🔒", "Private by design", "Your health data stays yours, always encrypted."]
    ];
    return (
      '<div class="wrap-wide">' +
      '<header class="between" style="padding:8px 0 0">' +
      logo() +
      '<a class="btn ghost auto" data-go="#/onboarding">Login</a>' +
      "</header>" +
      '<section class="landing-hero">' +
      "<div>" +
      '<span class="pill">UGX 10,000 / month</span>' +
      "<h1 style=\"margin-top:14px\">Your AI Health Companion</h1>" +
      '<p class="muted" style="margin-top:14px;max-width:430px">Personalised predictions, smart reminders and doctor-approved recommendations for better health outcomes.</p>' +
      '<div class="row" style="margin-top:26px">' +
      '<button class="btn auto" data-go="#/onboarding">Get Started</button>' +
      '<button class="btn ghost auto" data-go="#/dashboard">View dashboard</button>' +
      "</div></div>" +
      '<div class="dark-card">' +
      logo(true) +
      '<p class="tiny" style="color:rgba(255,255,255,.6);margin-top:20px">Health Score</p>' +
      '<p style="font-size:2.2rem;font-weight:800;color:#6ee7a0;line-height:1.1">Good</p>' +
      '<p class="tiny" style="color:rgba(255,255,255,.6)">72 / 100</p>' +
      '<div class="line">2 medications due today</div>' +
      '<div class="line">3 upcoming reminders</div>' +
      '<div class="line">Check-ins pending</div>' +
      "</div></section>" +
      '<section class="features">' +
      features
        .map(function (f) {
          return (
            '<div class="card"><div style="font-size:1.3rem">' +
            f[0] +
            "</div><h3 style=\"margin-top:8px\">" +
            f[1] +
            '</h3><p class="muted" style="margin-top:4px">' +
            f[2] +
            "</p></div>"
          );
        })
        .join("") +
      "</section></div>"
    );
  }

  /* =========================================================
     2-7. ONBOARDING
     ========================================================= */
  var onbStep = 1;
  var ONB_TOTAL = 6;
  var CONDITIONS = ["HIV", "Sickle Cell", "Diabetes", "Hypertension"];
  var SOURCES = [
    ["Google Fit", "Sync activity, steps, heart rate", "🏃"],
    ["Apple Health", "Sync activity, steps, heart rate", "❤️"],
    ["Smart Devices", "Connect BP monitor, glucometer, etc.", "⌚"]
  ];

  function onboarding() {
    if (onbStep === 1) {
      var opts = [
        ["patient", "Patient", "Manage my health with ASPIS Ai", "🙂"],
        ["doctor", "Doctor", "Review and approve AI recommendations", "🩺"]
      ];
      return stepShell(
        1,
        ONB_TOTAL,
        "I am a...",
        "Choose your account type",
        opts
          .map(function (o) {
            return (
              '<button class="option' +
              (state.accountType === o[0] ? " selected" : "") +
              '" data-account="' +
              o[0] +
              '"><span class="ico">' +
              o[3] +
              '</span><span><span class="ttl">' +
              o[1] +
              '</span><span class="sub">' +
              o[2] +
              '</span></span><span class="tick">✓</span></button>'
            );
          })
          .join(""),
        '<button class="btn" data-next>Next</button>'
      );
    }

    if (onbStep === 2) {
      return stepShell(
        2,
        ONB_TOTAL,
        "Create your account",
        "It only takes a minute",
        '<div class="grid2">' +
          '<label class="field"><span>Full Name</span><input id="f-name" value="' +
          esc(state.fullName) +
          '" placeholder="Jane Namburio" /></label>' +
          '<label class="field"><span>Phone Number</span><input id="f-phone" value="' +
          esc(state.phone) +
          '" placeholder="+256 700 123456" /></label>' +
          '<label class="field"><span>Email (optional)</span><input id="f-email" type="email" value="' +
          esc(state.email) +
          '" placeholder="jane@example.com" /></label>' +
          '<label class="field"><span>Password</span><input id="f-pass" type="password" placeholder="••••••••" /></label>' +
          "</div>" +
          '<label class="field"><span>Confirm Password</span><input id="f-pass2" type="password" placeholder="••••••••" /></label>' +
          '<p class="err" id="f-err"></p>' +
          '<label class="checkline"><input type="checkbox" id="f-terms" /><span>I agree to the <b class="green">Terms &amp; Conditions</b> and <b class="green">Privacy Policy</b></span></label>',
        '<button class="btn" id="do-signup">Sign Up</button>' +
          '<p class="tiny center">Already have an account? <b class="green">Login</b></p>'
      );
    }

    if (onbStep === 3) {
      return stepShell(
        3,
        ONB_TOTAL,
        "Verify your phone number",
        "We have sent a 6-digit code to " + (state.phone || "+256 700 123456"),
        '<div class="otp">' +
          [0, 1, 2, 3, 4, 5]
            .map(function (i) {
              return '<input class="otp-box" inputmode="numeric" maxlength="1" data-i="' + i + '" />';
            })
            .join("") +
          "</div>" +
          '<p class="tiny center">Resend code in <b id="otp-timer">00:30</b></p>' +
          '<p class="tiny center">Demo tip: any 6 digits will work.</p>',
        '<button class="btn" id="do-verify" disabled>Verify</button>'
      );
    }

    if (onbStep === 4) {
      return stepShell(
        4,
        ONB_TOTAL,
        "Tell us about yourself",
        "Help us personalise your experience",
        '<div class="grid2">' +
          '<label class="field"><span>Date of Birth</span><input id="f-dob" type="date" value="' +
          esc(state.dob) +
          '" /></label>' +
          '<label class="field"><span>Gender</span>' +
          selectHtml("f-gender", ["Female", "Male", "Prefer not to say"], state.gender) +
          "</label></div>" +
          '<label class="field"><span>Location</span>' +
          selectHtml(
            "f-location",
            ["Kampala, Uganda", "Gulu, Uganda", "Mbarara, Uganda", "Jinja, Uganda"],
            state.location
          ) +
          "</label>" +
          '<div><p class="tiny" style="font-weight:600;margin-bottom:8px">Primary Condition (Select all that apply)</p>' +
          '<div class="row" style="flex-wrap:wrap">' +
          CONDITIONS.map(function (c) {
            return (
              '<button class="chip' +
              (state.conditions.indexOf(c) > -1 ? " selected" : "") +
              '" data-cond="' +
              c +
              '">' +
              c +
              "</button>"
            );
          }).join("") +
          "</div></div>",
        '<button class="btn" id="save-profile">Next</button>'
      );
    }

    if (onbStep === 5) {
      return stepShell(
        5,
        ONB_TOTAL,
        "Your Health Summary",
        "Help us personalise your experience",
        '<div class="grid2">' +
          '<label class="field"><span>Height (cm)</span><input id="f-height" value="' +
          esc(state.height) +
          '" /></label>' +
          '<label class="field"><span>Weight (kg)</span><input id="f-weight" value="' +
          esc(state.weight) +
          '" /></label></div>' +
          '<label class="field"><span>Blood Group</span>' +
          selectHtml("f-blood", ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], state.bloodGroup) +
          "</label>" +
          '<div class="grid2">' +
          '<label class="field"><span>Do you smoke?</span>' +
          selectHtml("f-smoke", ["No", "Yes"], state.smokes) +
          "</label>" +
          '<label class="field"><span>Do you drink alcohol?</span>' +
          selectHtml("f-drink", ["No", "Occasionally", "Yes"], state.drinks) +
          "</label></div>",
        '<button class="btn" id="save-health">Next</button>'
      );
    }

    return stepShell(
      6,
      ONB_TOTAL,
      "Connect your health data",
      "Sync devices and apps to get better insights",
      SOURCES.map(function (s) {
        var connected = state.connected.indexOf(s[0]) > -1;
        return (
          '<div class="option"><span class="ico">' +
          s[2] +
          '</span><span style="flex:1"><span class="ttl">' +
          s[0] +
          '</span><span class="sub">' +
          s[1] +
          '</span></span><button class="btn auto ' +
          (connected ? "" : "outline") +
          '" style="padding:6px 14px" data-connect="' +
          s[0] +
          '">' +
          (connected ? "Connected" : "Connect") +
          "</button></div>"
        );
      }).join(""),
      '<button class="btn" data-go="#/dashboard">Finish setup</button>' +
        '<button class="btn ghost" data-go="#/dashboard">I will do this later</button>'
    );
  }

  function selectHtml(id, options, value) {
    return (
      '<select id="' +
      id +
      '">' +
      options
        .map(function (o) {
          return '<option' + (o === value ? " selected" : "") + ">" + esc(o) + "</option>";
        })
        .join("") +
      "</select>"
    );
  }

  /* =========================================================
     APP SHELL (dashboard area)
     ========================================================= */
  var NAV = [
    ["#/dashboard", "Home"],
    ["#/history", "History"],
    ["#/analysis", "AI Analysis"],
    ["#/reminders", "Reminders"],
    ["#/profile", "Profile"]
  ];

  function shell(hash, inner) {
    var links = NAV.map(function (n) {
      return '<a data-go="' + n[0] + '"' + (hash === n[0] ? ' class="active"' : "") + ">" + n[1] + "</a>";
    }).join("");
    return (
      '<div class="shell">' +
      '<aside class="sidebar">' +
      '<div style="margin-bottom:18px">' +
      logo(true) +
      "</div>" +
      links +
      '<div class="plan" data-go="#/subscription"><b>' +
      (state.subscribed ? (state.plan === "monthly" ? "Monthly Plan" : "Yearly Plan") : "No active plan") +
      "</b>" +
      (state.subscribed ? priceLabel() + (state.plan === "monthly" ? " / month" : " / year") : "Subscribe now") +
      "</div></aside>" +
      '<main><nav class="mobile-nav">' +
      links +
      '</nav><div class="wrap-wide" style="max-width:760px">' +
      inner +
      "</div></main></div>"
    );
  }

  /* ---------------- dashboard home ---------------- */
  function dashboard() {
    var tiles = [
      ["💊", "Medications", "2 due", "#/reminders"],
      ["🔔", "Reminders", "3 upcoming", "#/reminders"],
      ["📝", "Check-ins", "Pending", "#/reminders"],
      ["📄", "Reports", "View latest", "#/history"]
    ];
    var inner =
      "<h1>Hello, " +
      esc(firstName()) +
      ' 👋</h1><p class="muted">Here\'s your health overview</p>' +
      '<div class="card mt"><div class="between">' +
      '<div><p class="tiny">Health Score</p><p style="font-size:1.9rem;font-weight:800" class="green">Good</p><p class="tiny">72 / 100</p></div>' +
      '<div class="score-ring"><svg viewBox="0 0 36 36" width="88" height="88">' +
      '<circle cx="18" cy="18" r="16" fill="none" stroke="#e6ece8" stroke-width="4"></circle>' +
      '<circle cx="18" cy="18" r="16" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="72 100"></circle>' +
      "</svg><span>72</span></div></div></div>" +
      '<div class="tiles mt">' +
      tiles
        .map(function (t) {
          return (
            '<div class="tile" data-go="' +
            t[3] +
            '"><span style="font-size:1.2rem">' +
            t[0] +
            "</span><span style=\"flex:1\"><b style='display:block;font-size:.9rem'>" +
            t[1] +
            '</b><span class="tiny">' +
            t[2] +
            "</span></span><span class=\"muted\">›</span></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="card mt"><h2>Log Your Health Data</h2><p class="muted">Keep your data updated for better predictions</p>' +
      '<div class="mt">' +
      state.readings
        .slice(0, 6)
        .map(function (r) {
          return (
            '<div class="reading"><span><b style="display:block;font-size:.875rem">' +
            esc(r.type) +
            '</b><span class="tiny">' +
            esc(r.value) +
            '</span></span><span class="tiny">' +
            esc(r.when) +
            "</span></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="row mt" style="flex-wrap:wrap">' +
      selectHtml("add-type", ["Blood Pressure", "Blood Sugar", "Weight", "CD4 Count (HIV)", "Symptom"], "Blood Pressure").replace(
        "<select",
        '<select style="max-width:190px"'
      ) +
      '<input id="add-value" placeholder="e.g. 120/80 mmHg" style="flex:1;min-width:140px" />' +
      '<button class="btn auto" id="add-reading">+ Add New</button></div></div>';
    return shell("#/dashboard", inner);
  }

  /* ---------------- reminders + check-in ---------------- */
  var checkinAnswer = "";
  function reminders() {
    var rows = Object.keys(state.reminders)
      .map(function (name) {
        return (
          '<div class="between" style="padding:7px 0"><span style="font-size:.9rem">' +
          esc(name) +
          '</span><button class="toggle' +
          (state.reminders[name] ? " on" : "") +
          '" data-toggle="' +
          esc(name) +
          '" aria-label="' +
          esc(name) +
          '"><i></i></button></div>'
        );
      })
      .join("");

    var options = ["Yes, I took it", "No, I missed it", "I'll take it later"];

    var inner =
      "<h1>Reminders</h1>" +
      '<div class="card mt"><h2>Customise Reminders</h2><p class="muted">Set reminders that work for you</p>' +
      '<div class="mt">' +
      rows +
      "</div>" +
      '<label class="field mt" style="max-width:170px"><span>Reminder time</span><input id="rem-time" type="time" value="' +
      esc(state.reminderTime) +
      '" /></label>' +
      '<button class="btn mt" id="save-reminders">Save</button></div>' +
      '<div class="card mt push"><div class="between tiny" style="color:rgba(255,255,255,.6)"><span>🔔 ASPIS Ai</span><span>now</span></div>' +
      '<p style="font-weight:700;margin-top:8px">Time to take your medication</p>' +
      '<p style="color:rgba(255,255,255,.7);font-size:.875rem">Don\'t forget your ARV medication.</p>' +
      '<div class="row mt"><button class="btn outline" data-push="Taken">Taken</button><button class="btn outline" data-push="Snoozed 30 min">Snooze (30 min)</button></div></div>' +
      '<div class="card mt"><h2>Did you take your medication?</h2><p class="tiny">ARV · 8:00 AM</p><div class="stack mt">' +
      options
        .map(function (o) {
          return (
            '<button class="option' +
            (checkinAnswer === o ? " selected" : "") +
            '" data-answer="' +
            esc(o) +
            '"><span class="ttl">' +
            esc(o) +
            '</span><span class="tick">✓</span></button>'
          );
        })
        .join("") +
      "</div>" +
      '<label class="field mt"><span>Add a note (optional)</span><input id="checkin-note" placeholder="How do you feel today?" /></label>' +
      '<button class="btn mt" id="submit-checkin"' +
      (checkinAnswer ? "" : " disabled") +
      ">Submit</button>" +
      (state.checkins.length
        ? '<p class="tiny mt">Last check-in: ' + esc(state.checkins[state.checkins.length - 1].answer) + "</p>"
        : "") +
      "</div>";
    return shell("#/reminders", inner);
  }

  /* ---------------- AI analysis + doctor review ---------------- */
  var RECS = [
    ["Medication Adjustment", "Take your ARV medication at the same time daily."],
    ["Lifestyle Advice", "Increase physical activity to 30 minutes daily."],
    ["Monitoring", "Check your blood pressure twice this week."]
  ];
  var STAGES = ["Analysing your health trends", "Checking for potential risks", "Preparing recommendations"];
  var analysing = false;
  var stageIdx = 0;
  var stageTimer = null;

  function analysis() {
    var inner = "<h1>AI Analysis</h1>";

    if (analysing) {
      inner +=
        '<div class="card mt center"><div class="spinner"></div>' +
        '<p style="font-weight:700;margin-top:16px">ASPIS Ai is analysing your data</p><p class="tiny">This may take a few seconds</p>' +
        '<div style="max-width:290px;margin:16px auto 0;text-align:left">' +
        STAGES.map(function (s, i) {
          return (
            '<p style="font-size:.85rem;margin:6px 0;color:' +
            (i < stageIdx ? "#16241c" : "#6b7c73") +
            '">' +
            (i < stageIdx ? "✅" : "⚪") +
            " " +
            s +
            "</p>"
          );
        }).join("") +
        '</div><p class="tiny mt">Please wait...</p></div>';
      return shell("#/analysis", inner);
    }

    if (state.aiStatus === "idle") {
      inner +=
        '<div class="card mt center"><div style="font-size:1.8rem">🧠</div>' +
        '<p style="font-weight:700;margin-top:8px">Run an analysis on your latest data</p>' +
        '<p class="tiny">ASPIS Ai reviews your readings and prepares recommendations for a doctor to approve.</p>' +
        '<button class="btn mt" id="start-analysis">Start analysis</button></div>';
      return shell("#/analysis", inner);
    }

    var badge =
      state.aiStatus === "approved"
        ? '<span class="badge ok">Approved</span>'
        : state.aiStatus === "review"
          ? '<span class="badge">In review</span>'
          : '<span class="badge">Pending doctor review</span>';

    inner +=
      '<div class="card mt"><div class="between"><h2>Recommendations</h2>' +
      badge +
      '</div><p class="tiny">ASPIS Ai has generated recommendations for you. A doctor reviews and approves them.</p><div class="mt">' +
      RECS.map(function (r) {
        return (
          '<div style="border:1px solid var(--border);border-radius:9px;padding:12px;margin-top:8px"><b style="font-size:.875rem">' +
          r[0] +
          '</b><p class="tiny">' +
          r[1] +
          "</p></div>"
        );
      }).join("") +
      "</div>" +
      (state.aiStatus === "pending"
        ? '<button class="btn mt" id="send-doctor">Send to doctor</button><p class="tiny center mt-sm">These recommendations are not final until approved by a doctor.</p>'
        : "") +
      "</div>";

    if (state.aiStatus === "review") {
      inner +=
        '<div class="card mt center"><div style="font-size:1.6rem">⏳</div><p style="font-weight:700">In Review</p>' +
        '<p class="tiny">A doctor is reviewing your recommendations.</p>' +
        '<p style="font-weight:600;margin-top:8px">Estimated time: 2 – 6 hours</p>' +
        '<button class="btn mt" id="approve">Simulate doctor approval</button></div>';
    }

    if (state.aiStatus === "approved") {
      inner +=
        '<div class="card mt"><div class="row"><span style="font-size:1.4rem">🩺</span><span><b style="display:block;font-size:.9rem">Notes from Dr. A. Muwanga</b><span class="tiny">General Practitioner</span></span></div>' +
        '<p style="font-size:.9rem;margin-top:14px">Great job staying consistent! Keep monitoring your health and reach out if you notice any changes. Stay healthy!</p>' +
        '<p class="tiny mt-sm">Approved · 10:30 AM</p>' +
        '<button class="btn mt" id="understand">I Understand</button></div>';
    }

    return shell("#/analysis", inner);
  }

  /* ---------------- history & trends ---------------- */
  var SERIES = {
    "7D": [118, 124, 121, 130, 119, 126, 120],
    "30D": [122, 128, 119, 133, 125, 118, 129, 121, 124, 120],
    "90D": [130, 127, 124, 126, 122, 121, 119, 123, 120, 118, 122, 120],
    "1Y": [136, 133, 130, 128, 127, 125, 124, 123, 122, 121, 120, 120]
  };
  var range = "7D";

  function history() {
    var data = SERIES[range];
    var min = Math.min.apply(null, data) - 6;
    var max = Math.max.apply(null, data) + 6;
    var pts = data
      .map(function (v, i) {
        return ((i / (data.length - 1)) * 100).toFixed(2) + "," + (100 - ((v - min) / (max - min)) * 100).toFixed(2);
      })
      .join(" ");

    var inner =
      '<h1>Your Trends</h1><p class="muted">Track your health over time</p>' +
      '<div class="card mt"><div class="between"><h2>Blood Pressure</h2><div class="ranges">' +
      Object.keys(SERIES)
        .map(function (r) {
          return (
            '<button class="chip' + (range === r ? " selected" : "") + '" data-range="' + r + '">' + r + "</button>"
          );
        })
        .join("") +
      "</div></div>" +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="height:180px;width:100%;margin-top:18px">' +
      '<polyline points="' +
      pts +
      '" fill="none" stroke="#16a34a" stroke-width="1.5" vector-effect="non-scaling-stroke"></polyline></svg>' +
      '<p class="tiny" style="text-align:right">Latest <b>120/80</b></p></div>' +
      '<div class="card mt"><h2>All history</h2><div class="mt">' +
      state.readings
        .map(function (r) {
          return (
            '<div class="list-row"><span>' +
            esc(r.type) +
            '</span><span class="muted">' +
            esc(r.value) +
            '</span><span class="tiny">' +
            esc(r.when) +
            "</span></div>"
          );
        })
        .join("") +
      "</div></div>";
    return shell("#/history", inner);
  }

  /* ---------------- profile ---------------- */
  function profile() {
    var rows = [
      ["Full name", state.fullName || "Jane Namburio"],
      ["Phone", state.phone || "+256 700 123456"],
      ["Email", state.email || "jane@example.com"],
      ["Date of birth", state.dob],
      ["Gender", state.gender],
      ["Location", state.location],
      ["Conditions", state.conditions.join(", ") || "None selected"],
      ["Height / Weight", state.height + " cm · " + state.weight + " kg"],
      ["Blood group", state.bloodGroup],
      ["Smokes / Drinks", state.smokes + " · " + state.drinks],
      ["Connected apps", state.connected.join(", ") || "None"]
    ];
    var inner =
      "<h1>Profile</h1><div class=\"card mt\">" +
      rows
        .map(function (r) {
          return '<div class="list-row"><span class="muted">' + r[0] + "</span><b>" + esc(r[1]) + "</b></div>";
        })
        .join("") +
      "</div>" +
      '<div class="card mt"><h2>Subscription</h2><p class="tiny">' +
      (state.subscribed
        ? (state.plan === "monthly" ? "Monthly Plan · UGX 10,000 / month" : "Yearly Plan · UGX 100,000 / year") +
          " · Active"
        : "No active plan") +
      '</p><button class="btn outline mt" data-go="#/subscription">' +
      (state.subscribed ? "Manage subscription" : "Choose a plan") +
      "</button></div>" +
      '<button class="btn ghost mt" id="reset-demo">Reset demo data</button>';
    return shell("#/profile", inner);
  }

  /* =========================================================
     SUBSCRIPTION / PAYMENT
     ========================================================= */
  var payStep = 1;
  var PAY_TOTAL = 5;
  var countdown = 60;
  var countdownTimer = null;
  var METHODS = [
    ["Mobile Money (MTN)", "📱"],
    ["Airtel Money", "📶"],
    ["Card Payment", "💳"],
    ["Bank Transfer", "🏦"]
  ];

  function subscription() {
    if (state.subscribed && payStep === 1) payStep = 6;

    if (payStep === 1) {
      var plans = [
        ["monthly", "Monthly Plan", "UGX 10,000 / month", ""],
        ["yearly", "Yearly Plan", "UGX 100,000 / year", "Save 2 months"]
      ];
      var perks = [
        "AI health predictions",
        "Doctor review & approval",
        "Smart reminders",
        "Health insights & trends",
        "Priority support"
      ];
      return stepShell(
        1,
        PAY_TOTAL,
        "Choose Your Plan",
        "Get the best out of ASPIS Ai",
        plans
          .map(function (p) {
            return (
              '<button class="option' +
              (state.plan === p[0] ? " selected" : "") +
              '" data-plan="' +
              p[0] +
              '" style="display:block"><span class="between"><span class="ttl">' +
              p[1] +
              '</span><span class="tick">✓</span></span><span style="display:block;font-size:1.15rem;font-weight:800;color:var(--green)">' +
              p[2] +
              '</span><span class="sub">' +
              p[3] +
              "</span></button>"
            );
          })
          .join("") +
          '<div class="tiny">' +
          perks
            .map(function (f) {
              return "<div>✅ " + f + "</div>";
            })
            .join("") +
          "</div>",
        '<button class="btn" data-paystep="2">Continue</button>'
      );
    }

    if (payStep === 2) {
      return stepShell(
        2,
        PAY_TOTAL,
        "Select Payment Method",
        "",
        METHODS.map(function (m) {
          return (
            '<button class="option' +
            (state.paymentMethod === m[0] ? " selected" : "") +
            '" data-method="' +
            esc(m[0]) +
            '"><span class="ico">' +
            m[1] +
            '</span><span class="ttl">' +
            m[0] +
            '</span><span class="tick">✓</span></button>'
          );
        }).join(""),
        '<button class="btn" data-paystep="3">Continue</button>' +
          '<button class="btn ghost" data-paystep="1">Back</button>'
      );
    }

    if (payStep === 3) {
      return stepShell(
        3,
        PAY_TOTAL,
        "Pay with " + state.paymentMethod,
        "Enter the details to complete payment",
        '<label class="field"><span>Phone Number</span><input id="pay-phone" value="' +
          esc(state.phone || "+256 700 123456") +
          '" /></label>' +
          '<label class="field"><span>Amount</span><input value="' +
          priceLabel() +
          '" readonly /></label>' +
          '<p class="tiny">You will receive a prompt on your phone to complete the payment.</p>',
        '<button class="btn" id="pay-now">Pay Now</button>' + '<button class="btn ghost" data-paystep="2">Back</button>'
      );
    }

    if (payStep === 4) {
      return stepShell(
        4,
        PAY_TOTAL,
        "Complete Payment",
        "Check your phone and enter your PIN to authorise payment",
        '<p class="center" style="font-size:1.9rem;font-weight:800">' +
          priceLabel() +
          '</p><div class="countdown" id="pay-countdown">' +
          countdown +
          '</div><p class="tiny center">seconds remaining</p>',
        '<button class="btn" id="confirm-pay">I have authorised the payment</button>' +
          '<button class="btn outline" id="resend-prompt">Didn\'t receive a prompt? Resend</button>'
      );
    }

    if (payStep === 5) {
      return stepShell(
        5,
        PAY_TOTAL,
        "Payment Successful!",
        "Thank you for choosing ASPIS Ai",
        '<div class="check-big">✓</div><p class="center" style="font-size:.9rem">You are now subscribed to the <b>' +
          (state.plan === "monthly" ? "Monthly" : "Yearly") +
          " Plan</b> — " +
          priceLabel() +
          "</p>",
        '<button class="btn" data-go="#/dashboard">Go to Dashboard</button>' +
          '<button class="btn outline" data-paystep="6">View subscription</button>'
      );
    }

    return (
      '<div class="wrap"><div class="between">' +
      logo() +
      '<button class="btn ghost auto" data-go="#/dashboard">Dashboard</button></div>' +
      '<div class="card mt"><h1>Subscription Active</h1><p class="muted">Your plan is active and you\'re all set</p>' +
      '<div style="border:1px solid var(--border);border-radius:10px;padding:16px;margin-top:14px">' +
      "<b>" +
      (state.plan === "monthly" ? "Monthly Plan" : "Yearly Plan") +
      '</b><p style="font-size:1.2rem;font-weight:800;color:var(--green)">' +
      priceLabel() +
      '</p><p class="tiny">Next payment date: 11 June 2026</p></div>' +
      '<div class="stack mt"><button class="btn outline" data-paystep="2">Update payment method</button>' +
      '<button class="btn ghost" id="cancel-sub">Cancel subscription</button>' +
      '<button class="btn" data-go="#/dashboard">Done</button></div></div></div>'
    );
  }

  /* =========================================================
     ROUTER
     ========================================================= */
  var ROUTES = {
    "#/": landing,
    "#/onboarding": onboarding,
    "#/dashboard": dashboard,
    "#/history": history,
    "#/analysis": analysis,
    "#/reminders": reminders,
    "#/profile": profile,
    "#/subscription": subscription
  };

  function render() {
    var hash = location.hash || "#/";
    var view = ROUTES[hash] || landing;
    root.innerHTML = view();
    window.scrollTo(0, 0);
    bind();
  }

  /* =========================================================
     EVENT BINDING (re-run after each render)
     ========================================================= */
  function bind() {
    on("[data-go]", "click", function (e) {
      go(e.currentTarget.getAttribute("data-go"));
    });

    /* --- onboarding --- */
    on("[data-account]", "click", function (e) {
      set({ accountType: e.currentTarget.getAttribute("data-account") });
      render();
    });
    on("[data-next]", "click", function () {
      onbStep++;
      render();
    });
    var signup = $("#do-signup");
    if (signup)
      signup.addEventListener("click", function () {
        var name = $("#f-name").value.trim();
        var phone = $("#f-phone").value.trim();
        var pass = $("#f-pass").value;
        var pass2 = $("#f-pass2").value;
        var err = $("#f-err");
        var msg = "";
        if (!name) msg = "Please enter your full name.";
        else if (!/^\+?[0-9\s]{9,15}$/.test(phone)) msg = "Enter a valid phone number, e.g. +256 700 123456.";
        else if (pass.length < 6) msg = "Password must be at least 6 characters.";
        else if (pass !== pass2) msg = "Passwords do not match.";
        else if (!$("#f-terms").checked) msg = "Please accept the Terms & Conditions.";
        if (msg) {
          err.textContent = msg;
          err.classList.add("show");
          return;
        }
        set({ fullName: name, phone: phone, email: $("#f-email").value.trim(), signedUp: true });
        onbStep = 3;
        render();
      });

    if ($(".otp-box")) {
      var boxes = $$(".otp-box");
      boxes[0].focus();
      boxes.forEach(function (box, i) {
        box.addEventListener("input", function () {
          box.value = box.value.replace(/\D/g, "");
          if (box.value && boxes[i + 1]) boxes[i + 1].focus();
          $("#do-verify").disabled = boxes.some(function (b) {
            return !b.value;
          });
        });
        box.addEventListener("keydown", function (ev) {
          if (ev.key === "Backspace" && !box.value && boxes[i - 1]) boxes[i - 1].focus();
        });
      });
      var left = 30;
      var t = setInterval(function () {
        left--;
        var el = $("#otp-timer");
        if (!el) return clearInterval(t);
        el.textContent = "00:" + (left < 10 ? "0" : "") + Math.max(left, 0);
        if (left <= 0) {
          el.textContent = "now";
          clearInterval(t);
        }
      }, 1000);
    }
    var verify = $("#do-verify");
    if (verify)
      verify.addEventListener("click", function () {
        onbStep = 4;
        toast("Phone verified");
        render();
      });

    on("[data-cond]", "click", function (e) {
      var c = e.currentTarget.getAttribute("data-cond");
      var list = state.conditions.slice();
      var i = list.indexOf(c);
      if (i > -1) list.splice(i, 1);
      else list.push(c);
      set({ conditions: list });
      render();
    });
    var sp = $("#save-profile");
    if (sp)
      sp.addEventListener("click", function () {
        set({
          dob: $("#f-dob").value,
          gender: $("#f-gender").value,
          location: $("#f-location").value
        });
        onbStep = 5;
        render();
      });
    var sh = $("#save-health");
    if (sh)
      sh.addEventListener("click", function () {
        set({
          height: $("#f-height").value,
          weight: $("#f-weight").value,
          bloodGroup: $("#f-blood").value,
          smokes: $("#f-smoke").value,
          drinks: $("#f-drink").value
        });
        onbStep = 6;
        render();
      });
    on("[data-connect]", "click", function (e) {
      var name = e.currentTarget.getAttribute("data-connect");
      var list = state.connected.slice();
      var i = list.indexOf(name);
      if (i > -1) list.splice(i, 1);
      else list.push(name);
      set({ connected: list });
      toast(i > -1 ? name + " disconnected" : name + " connected");
      render();
    });

    /* --- dashboard --- */
    var add = $("#add-reading");
    if (add)
      add.addEventListener("click", function () {
        var value = $("#add-value").value.trim();
        if (!value) return toast("Enter a value first");
        var list = state.readings.slice();
        list.unshift({
          id: String(Date.now()),
          type: $("#add-type").value,
          value: value,
          when: "Just now"
        });
        set({ readings: list });
        toast("Reading saved");
        render();
      });

    /* --- reminders --- */
    on("[data-toggle]", "click", function (e) {
      var name = e.currentTarget.getAttribute("data-toggle");
      var r = Object.assign({}, state.reminders);
      r[name] = !r[name];
      set({ reminders: r });
      render();
    });
    var sr = $("#save-reminders");
    if (sr)
      sr.addEventListener("click", function () {
        set({ reminderTime: $("#rem-time").value });
        toast("Reminder settings saved");
      });
    on("[data-push]", "click", function (e) {
      toast(e.currentTarget.getAttribute("data-push"));
    });
    on("[data-answer]", "click", function (e) {
      checkinAnswer = e.currentTarget.getAttribute("data-answer");
      render();
    });
    var sc = $("#submit-checkin");
    if (sc)
      sc.addEventListener("click", function () {
        var list = state.checkins.slice();
        list.push({ answer: checkinAnswer, note: $("#checkin-note").value, at: new Date().toISOString() });
        set({ checkins: list });
        checkinAnswer = "";
        toast("Check-in recorded");
        render();
      });

    /* --- analysis --- */
    var start = $("#start-analysis");
    if (start)
      start.addEventListener("click", function () {
        analysing = true;
        stageIdx = 0;
        render();
        clearInterval(stageTimer);
        stageTimer = setInterval(function () {
          stageIdx++;
          if (stageIdx > STAGES.length) {
            clearInterval(stageTimer);
            analysing = false;
            set({ aiStatus: "pending" });
          }
          if (location.hash === "#/analysis") render();
        }, 1100);
      });
    var send = $("#send-doctor");
    if (send)
      send.addEventListener("click", function () {
        set({ aiStatus: "review" });
        toast("Sent to a doctor for review");
        render();
      });
    var appr = $("#approve");
    if (appr)
      appr.addEventListener("click", function () {
        set({ aiStatus: "approved" });
        toast("Doctor approved your recommendations");
        render();
      });
    var und = $("#understand");
    if (und) und.addEventListener("click", function () { go("#/dashboard"); });

    /* --- history --- */
    on("[data-range]", "click", function (e) {
      range = e.currentTarget.getAttribute("data-range");
      render();
    });

    /* --- profile --- */
    var reset = $("#reset-demo");
    if (reset)
      reset.addEventListener("click", function () {
        localStorage.removeItem(KEY);
        state = load();
        onbStep = 1;
        payStep = 1;
        toast("Demo data reset");
        go("#/");
        render();
      });

    /* --- subscription --- */
    on("[data-plan]", "click", function (e) {
      set({ plan: e.currentTarget.getAttribute("data-plan") });
      render();
    });
    on("[data-method]", "click", function (e) {
      set({ paymentMethod: e.currentTarget.getAttribute("data-method") });
      render();
    });
    on("[data-paystep]", "click", function (e) {
      payStep = parseInt(e.currentTarget.getAttribute("data-paystep"), 10);
      render();
    });
    var payNow = $("#pay-now");
    if (payNow)
      payNow.addEventListener("click", function () {
        set({ phone: $("#pay-phone").value.trim() || state.phone });
        payStep = 4;
        render();
      });
    if ($("#pay-countdown")) {
      countdown = 60;
      clearInterval(countdownTimer);
      countdownTimer = setInterval(function () {
        var el = $("#pay-countdown");
        if (!el) return clearInterval(countdownTimer);
        countdown = Math.max(countdown - 1, 0);
        el.textContent = countdown;
        if (countdown === 0) clearInterval(countdownTimer);
      }, 1000);
    }
    var resend = $("#resend-prompt");
    if (resend)
      resend.addEventListener("click", function () {
        countdown = 60;
        $("#pay-countdown").textContent = countdown;
        toast("Prompt resent to " + state.phone);
      });
    var confirmPay = $("#confirm-pay");
    if (confirmPay)
      confirmPay.addEventListener("click", function () {
        clearInterval(countdownTimer);
        set({ subscribed: true });
        payStep = 5;
        render();
      });
    var cancelSub = $("#cancel-sub");
    if (cancelSub)
      cancelSub.addEventListener("click", function () {
        set({ subscribed: false });
        payStep = 1;
        toast("Subscription cancelled");
        render();
      });
  }

  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "#/";
  render();
})();
