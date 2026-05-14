/**
 * Mintt.ca — Company Chat Widget
 * Drop this script on every page of the Mintt website
 * <script src="mintt-widget.js"></script>
 *
 * Answers questions about Mintt pricing, features, how it works
 * Captures demo bookings (name + email)
 */
(function() {
  'use strict';
  if (window._minttWidgetLoaded) return;
  window._minttWidgetLoaded = true;

  // ── Knowledge base ────────────────────────────────────────────────────────
  var KB = {
    pricing: {
      triggers: ['price','pricing','cost','how much','plan','plans','starter','growth','agency','pay','subscription','monthly','annual','affordable'],
      answer: "We have three plans:\n\n💚 **Starter — $97/mo** · 1 location, AI chat, lead capture, scoring, dashboard, email alerts\n\n💚 **Growth — $247/mo** · Up to 3 locations, everything in Starter + image analysis, voice upload, customer confirmation emails\n\n💚 **Agency — $597/mo** · Unlimited locations, everything + white label (remove Mintt branding)\n\nAll plans include a free demo and setup. Annual plans save 20%.\n\nWould you like to book a free demo to see it live?"
    },
    features: {
      triggers: ['feature','features','what does','what can','capability','capabilities','do you','does it','image','photo','nameplate','voice','dashboard','scoring','hot lead','notification','email alert','widget','chat'],
      answer: "Here's what Mintt does:\n\n🤖 **AI chat agent** — responds to every visitor 24/7, trained on your business\n📸 **Image analysis** — reads motor nameplates, panel photos, spec sheets\n🔴 **HOT lead detection** — flags urgent, high-value leads automatically\n📊 **Live dashboard** — every lead scored, prioritized, with full conversation history\n📧 **Instant email alerts** — full briefing in your inbox the moment a lead arrives\n🎤 **Voice & file upload** — customers can send voice notes and documents\n🔐 **Secure login** — 2FA protected dashboard for you and your team\n\nWant to see it in action? I can book you a free demo."
    },
    howItWorks: {
      triggers: ['how does','how it work','setup','install','integrate','implementation','get started','one line','code','website','work','live','quickly','fast','how long'],
      answer: "Getting live with Mintt takes about one hour:\n\n**Step 1** — We add one line of code to your existing website\n**Step 2** — We train the AI on your products, services, and brand\n**Step 3** — Your agent goes live — responding to visitors 24/7\n**Step 4** — Leads appear in your dashboard and your inbox in real time\n\nNo redesign, no downtime, no IT department. Works on any website — Wix, WordPress, Squarespace, custom HTML, anything.\n\nWant us to show you exactly how it works for your business?"
    },
    demo: {
      triggers: ['demo','book','schedule','call','meeting','see it','try','trial','free','show me','talk'],
      answer: "A free demo is 20 minutes over video call. We'll show you:\n✅ The AI agent responding to questions in your industry\n✅ How HOT leads are flagged and alerted\n✅ Your dashboard with live leads\n✅ How to go live on your website\n\nNo commitment, no pressure. Just a live look at what Mintt does.\n\n👉 **To book your demo, just share your name and email and we'll confirm a time within one business day.**"
    },
    industries: {
      triggers: ['industry','industries','work for','electrical','contractor','distributor','plumbing','hvac','trades','trade','automation','controls','integrator','what kind','business type','type of business'],
      answer: "Mintt is built specifically for trade businesses:\n\n⚡ Electrical contractors\n📦 Electrical distributors\n🤖 Controls & automation integrators\n🔧 HVAC & mechanical contractors\n🪠 Plumbing contractors\n🏗️ General contractors\n\nEach agent is trained on your specific industry, products, and services — not a generic chatbot response. Two of our current clients are an Ontario electrical distributor and an electrical controls contractor.\n\nWant to see a live demo for your industry?"
    },
    privacy: {
      triggers: ['privacy','data','secure','pipeda','canada','canadian','gdpr','safe','store','storage','where','server'],
      answer: "All Mintt data is stored on Canadian servers and never sold or shared with third parties. We are compliant with PIPEDA — Canada's federal privacy law.\n\nSecurity includes:\n🔐 Two-factor authentication (2FA)\n🔒 Encrypted passwords\n🍁 Canadian data storage only\n📋 PIPEDA compliant\n\nYour customer data belongs to you. We process it on your behalf."
    },
    contract: {
      triggers: ['contract','cancel','commitment','lock','locked','annual','month to month','binding','refund'],
      answer: "No long-term contracts. Cancel anytime from your dashboard — no questions asked.\n\nCancellation takes effect at the end of your current billing period. Annual plans save 20% but are paid upfront.\n\nWe don't believe in locking businesses in. We earn your business every month."
    },
    hours: {
      triggers: ['hours','open','close','business hours','when are you','office hours','monday','available','operation'],
      answer: "Our business hours are:\n\n🕐 **Monday – Friday: 9:00am – 5:00pm EST**\n\nWe respond to demo requests and inquiries within one business day.\n\nWant to book a free demo during business hours?"
    },
    compare: {
      triggers: ['competitor','compare','versus','vs','other','alternative','different','better','why mintt','why not','chatbot','intercom','drift','tidio','crisp'],
      answer: "Most chat tools are built for software companies — not trades.\n\nWhat makes Mintt different:\n\n✅ Trained on your industry (electrical, controls, HVAC, plumbing)\n✅ Reads motor nameplates and spec sheets from photos\n✅ HOT lead detection — not just lead capture\n✅ Built for Canadian trade businesses\n✅ Full lead dashboard with conversion tracking\n✅ One-hour setup, no IT required\n\nGeneric chatbots give generic answers. Mintt knows your business.\n\nWant to see the difference live?"
    }
  };

  var conversationHistory = [];
  var leadCaptureState = 'none'; // none | awaiting_name | awaiting_email | captured
  var capturedLead = { name: '', email: '' };
  var messageCount = 0;
  var isOpen = false;

  // ── Find best response ────────────────────────────────────────────────────
  function findResponse(userMsg) {
    var msg = userMsg.toLowerCase();

    // Lead capture flow
    if (leadCaptureState === 'awaiting_name') {
      var name = userMsg.trim();
      if (name.length > 1 && name.length < 40 && !name.includes('@')) {
        capturedLead.name = name;
        leadCaptureState = 'awaiting_email';
        return "Nice to meet you, " + name + "! 👋\n\nWhat's the best email address to send your demo confirmation to?";
      } else {
        return "I didn't quite catch that — what's your first name?";
      }
    }

    if (leadCaptureState === 'awaiting_email') {
      var emailMatch = userMsg.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        capturedLead.email = emailMatch[0];
        leadCaptureState = 'captured';
        saveLead();
        return "✅ Perfect! We've got your details, " + capturedLead.name + ".\n\nSomeone from our team will email **" + capturedLead.email + "** within one business day to confirm your demo time.\n\nIn the meantime, feel free to check out our [pricing page](pricing.html) or [see the live demo](demo.html). Any other questions?";
      } else {
        return "That doesn't look like a valid email — could you double-check it? (e.g. name@company.com)";
      }
    }

    // Check knowledge base
    for (var key in KB) {
      var category = KB[key];
      for (var i = 0; i < category.triggers.length; i++) {
        if (msg.indexOf(category.triggers[i]) !== -1) {
          // If demo-related, start lead capture after response
          if (key === 'demo' || msg.indexOf('book') !== -1 || msg.indexOf('yes') !== -1 && messageCount > 2) {
            setTimeout(function() {
              if (leadCaptureState === 'none') {
                leadCaptureState = 'awaiting_name';
                addMessage("To get that booked — what's your first name?", 'agent');
              }
            }, 800);
          }
          return category.answer;
        }
      }
    }

    // Greeting
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|howdy|sup|yo)/)) {
      return "Hi there! 👋 I'm the Mintt assistant — I can tell you about our pricing, features, how setup works, or book you a free demo.\n\nWhat are you looking to find out?";
    }

    // Yes responses
    if (msg.match(/^(yes|yeah|sure|absolutely|definitely|ok|okay|sounds good|let's do it|yep|yup)/)) {
      if (messageCount > 1 && leadCaptureState === 'none') {
        leadCaptureState = 'awaiting_name';
        return "Let's get that booked! What's your first name?";
      }
    }

    // Fallback
    messageCount++;
    if (messageCount >= 3 && leadCaptureState === 'none') {
      return "I want to make sure you get the right answer — our team can go deeper on that in a live demo.\n\nWould you like to book a free 20-minute demo? Just say 'yes' and I'll get you set up.";
    }

    return "Good question! Here's what I can help with:\n\n• 💰 **Pricing** — our plans start at $97/mo\n• ⚡ **Features** — what Mintt does\n• 🛠️ **How it works** — setup takes under an hour\n• 📅 **Book a demo** — free, 20 minutes, no commitment\n\nWhat would you like to know?";
  }

  function saveLead() {
    try {
      var leads = JSON.parse(localStorage.getItem('mintt_site_leads') || '[]');
      leads.push({ name: capturedLead.name, email: capturedLead.email, ts: new Date().toISOString(), page: window.location.pathname });
      localStorage.setItem('mintt_site_leads', JSON.stringify(leads));
      console.log('📧 Mintt demo lead captured:', capturedLead);
    } catch(e) {}
  }

  // ── Widget HTML ────────────────────────────────────────────────────────────
  function createWidget() {
    var style = document.createElement('style');
    style.textContent = `
      #mintt-widget * { box-sizing: border-box; font-family: 'Outfit', -apple-system, sans-serif; }
      #mintt-widget { position: fixed; bottom: 28px; right: 28px; z-index: 99999; }
      #mintt-btn {
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #00a356, #00c96b);
        border: none; cursor: pointer;
        box-shadow: 0 8px 28px rgba(0,201,107,0.4);
        display: flex; align-items: center; justify-content: center;
        transition: all .3s; color: white;
        animation: minttPulse 3s ease-in-out infinite;
      }
      @keyframes minttPulse {
        0%,100% { box-shadow: 0 8px 28px rgba(0,201,107,0.4); }
        50% { box-shadow: 0 8px 40px rgba(0,201,107,0.65); }
      }
      #mintt-btn:hover { transform: scale(1.08); }
      #mintt-btn svg { width: 26px; height: 26px; }
      #mintt-unread {
        position: absolute; top: -4px; right: -4px;
        width: 20px; height: 20px; border-radius: 50%;
        background: #ff4444; color: white;
        font-size: 11px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid white; display: none;
      }
      #mintt-window {
        position: absolute; bottom: 76px; right: 0;
        width: 360px; height: 540px;
        background: white; border-radius: 20px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.18);
        display: none; flex-direction: column;
        overflow: hidden;
        animation: minttSlideUp .35s cubic-bezier(0.34,1.56,0.64,1);
        border: 1px solid rgba(0,201,107,0.12);
      }
      @keyframes minttSlideUp { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      #mintt-header {
        background: linear-gradient(135deg, #080f0a, #0d2416);
        padding: 16px 18px;
        display: flex; align-items: center; gap: 12px;
        flex-shrink: 0;
      }
      .mintt-hdr-icon {
        width: 38px; height: 38px; border-radius: 50%;
        background: linear-gradient(135deg, #00a356, #00c96b);
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; flex-shrink: 0;
      }
      .mintt-hdr-info { flex: 1; }
      .mintt-hdr-name { font-size: 14px; font-weight: 700; color: white; }
      .mintt-hdr-status { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
      .mintt-status-dot { width: 6px; height: 6px; background: #00c96b; border-radius: 50%; animation: minttPls 2s infinite; }
      @keyframes minttPls { 0%,100%{opacity:1}50%{opacity:.4} }
      .mintt-status-txt { font-size: 11px; color: rgba(255,255,255,.5); }
      #mintt-minimize { background: rgba(255,255,255,.08); border: none; color: rgba(255,255,255,.6); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; line-height: 1; transition: all .2s; font-weight: 300; }
      #mintt-minimize:hover { background: rgba(255,255,255,.15); color: white; }
      #mintt-reset { background: rgba(255,255,255,.08); border: none; color: rgba(255,255,255,.6); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all .2s; }
      #mintt-reset:hover { background: rgba(255,255,255,.15); color: white; }
      #mintt-reset svg { width: 13px; height: 13px; transition: transform .5s ease; }
      #mintt-reset.spinning svg { transform: rotate(-360deg); }
      #mintt-close { background: rgba(255,255,255,.08); border: none; color: rgba(255,255,255,.6); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all .2s; }
      #mintt-close:hover { background: rgba(255,255,255,.15); color: white; }
      #mintt-msgs { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f7fdf9; }
      #mintt-msgs::-webkit-scrollbar { width: 4px; }
      #mintt-msgs::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
      .mintt-msg { max-width: 86%; padding: 11px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.6; animation: minttFade .2s ease; word-break: break-word; }
      @keyframes minttFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .mintt-msg.agent { align-self: flex-start; background: white; color: #080f0a; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
      .mintt-msg.user { align-self: flex-end; background: linear-gradient(135deg, #00a356, #00c96b); color: white; border-bottom-right-radius: 4px; font-weight: 500; }
      .mintt-msg strong { font-weight: 700; }
      .mintt-typing { align-self: flex-start; background: white; padding: 12px 16px; border-radius: 14px; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
      .mintt-dots { display: flex; gap: 4px; }
      .mintt-dots span { width: 6px; height: 6px; border-radius: 50%; background: #00c96b; animation: minttTyp 1.4s infinite; }
      .mintt-dots span:nth-child(2){animation-delay:.2s}.mintt-dots span:nth-child(3){animation-delay:.4s}
      @keyframes minttTyp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
      .mintt-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; background: #f7fdf9; flex-shrink: 0; }
      .mintt-qbtn { background: white; border: 1.5px solid rgba(0,201,107,0.25); color: #00a356; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; font-family: inherit; }
      .mintt-qbtn:hover { background: #00c96b; color: white; border-color: #00c96b; }
      #mintt-input-bar { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid #e5e7eb; background: white; align-items: center; flex-shrink: 0; }
      #mintt-input { flex: 1; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; font-size: 14px; font-family: inherit; outline: none; transition: all .2s; background: #fafafa; min-width: 0; color: #080f0a; }
      #mintt-input:focus { border-color: #00c96b; background: white; }
      #mintt-send { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #00a356, #00c96b); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .2s; }
      #mintt-send:hover { transform: scale(1.05); }
      #mintt-send svg { width: 16px; height: 16px; }
      #mintt-footer { text-align: center; padding: 8px; font-size: 11px; color: #9ca3af; background: white; border-top: 1px solid #f3f4f6; flex-shrink: 0; }
      #mintt-footer a { color: #00c96b; text-decoration: none; font-weight: 600; }
      #mintt-window.minimized { height: 68px !important; overflow: hidden; }
      #mintt-window.minimized #mintt-msgs,
      #mintt-window.minimized #mintt-input-bar,
      #mintt-window.minimized #mintt-qbtns,
      #mintt-window.minimized #mintt-footer { display: none !important; }
      @media(max-width:480px) {
        #mintt-window { width: calc(100vw - 32px); right: -4px; height: 85vh; max-height: 85vh; }
        #mintt-widget { bottom: 16px; right: 16px; }
        #mintt-btn { width: 52px; height: 52px; }
      }
    `;
    document.head.appendChild(style);

    var link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    var wrap = document.createElement('div');
    wrap.id = 'mintt-widget';
    wrap.innerHTML = `
      <div id="mintt-window">
        <div id="mintt-header">
          <div class="mintt-hdr-icon">🌿</div>
          <div class="mintt-hdr-info">
            <div class="mintt-hdr-name">Mintt Assistant</div>
            <div class="mintt-hdr-status">
              <div class="mintt-status-dot"></div>
              <span class="mintt-status-txt">Online — ask me anything</span>
            </div>
          </div>
          <button id="mintt-minimize" title="Minimize">&#8722;</button>
          <button id="mintt-reset" title="Reset conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button id="mintt-close" title="Close">✕</button>
        </div>
        <div id="mintt-msgs"></div>
        <div class="mintt-quick-btns" id="mintt-qbtns">
          <button class="mintt-qbtn" onclick="window._minttSend('What are your plans?')">💰 Pricing</button>
          <button class="mintt-qbtn" onclick="window._minttSend('How does it work?')">⚡ How it works</button>
          <button class="mintt-qbtn" onclick="window._minttSend('What features do you have?')">🤖 Features</button>
          <button class="mintt-qbtn" onclick="window._minttSend('I want to book a demo')">📅 Book demo</button>
          <button class="mintt-qbtn" onclick="window._minttSend('What are your hours?')">🕐 Hours</button>
        </div>
        <div id="mintt-input-bar">
          <input id="mintt-input" type="text" placeholder="Ask me anything about Mintt..." />
          <button id="mintt-send">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div id="mintt-footer">Powered by <a href="https://mintt.ca">Mintt.ca</a></div>
      </div>
      <div id="mintt-unread">1</div>
      <button id="mintt-btn" title="Chat with Mintt">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>
    `;
    document.body.appendChild(wrap);

    // Bind events
    document.getElementById('mintt-btn').addEventListener('click', toggleWidget);
    document.getElementById('mintt-minimize').addEventListener('click', minimizeWidget);
    document.getElementById('mintt-reset').addEventListener('click', resetWidget);
    document.getElementById('mintt-close').addEventListener('click', toggleWidget);
    document.getElementById('mintt-send').addEventListener('click', sendMessage);
    document.getElementById('mintt-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
    });

    // Show unread badge after 4 seconds
    setTimeout(function() {
      if (!isOpen) {
        document.getElementById('mintt-unread').style.display = 'flex';
      }
    }, 4000);

    // Auto-open with greeting after 6 seconds (first visit only)
    setTimeout(function() {
      if (!isOpen && !sessionStorage.getItem('mintt_opened')) {
        toggleWidget();
      }
    }, 6000);
  }

  function minimizeWidget() {
    var win = document.getElementById('mintt-window');
    win.classList.toggle('minimized');
  }

  function resetWidget() {
    var btn = document.getElementById('mintt-reset');
    btn.classList.add('spinning');
    setTimeout(function() { btn.classList.remove('spinning'); }, 500);
    // Reset all state
    conversationHistory = [];
    leadCaptureState = 'none';
    capturedLead = { name: '', email: '' };
    messageCount = 0;
    // Clear messages and re-greet
    var msgs = document.getElementById('mintt-msgs');
    msgs.innerHTML = '';
    setTimeout(function() {
      addMessage(formatMarkdown("👋 Hi! I'm the Mintt assistant.\n\nI can tell you about our pricing, features, how Mintt works, or book you a free demo.\n\nWhat would you like to know?"), 'agent');
    }, 300);
  }

  function toggleWidget() {
    isOpen = !isOpen;
    var win = document.getElementById('mintt-window');
    var btn = document.getElementById('mintt-btn');
    var unread = document.getElementById('mintt-unread');
    win.classList.remove('minimized');
    win.style.display = isOpen ? 'flex' : 'none';
    unread.style.display = 'none';
    if (isOpen) {
      sessionStorage.setItem('mintt_opened', '1');
      document.getElementById('mintt-input').focus();
      if (document.getElementById('mintt-msgs').children.length === 0) {
        addMessage(formatMarkdown("👋 Hi! I'm the Mintt assistant.\n\nI can tell you about our pricing, features, how Mintt works, or book you a free demo.\n\nWhat would you like to know?"), 'agent');
      }
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function sendMessage() {
    var input = document.getElementById('mintt-input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(escapeHtml(text).replace(/\n/g,'<br>'), 'user');
    messageCount++;
    // Quick buttons stay visible always
    showTyping();
    var delay = 600 + Math.random() * 600;
    setTimeout(function() {
      hideTyping();
      var response = findResponse(text);
      addMessage(formatMarkdown(response), 'agent');
    }, delay);
  }

  window._minttSend = function(text) {
    document.getElementById('mintt-input').value = text;
    sendMessage();
  };

  function addMessage(html, role) {
    var msgs = document.getElementById('mintt-msgs');
    var d = document.createElement('div');
    d.className = 'mintt-msg ' + role;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function showTyping() {
    var msgs = document.getElementById('mintt-msgs');
    var d = document.createElement('div');
    d.className = 'mintt-typing'; d.id = 'mintt-typing';
    d.innerHTML = '<div class="mintt-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('mintt-typing');
    if (t) t.remove();
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#00c96b;font-weight:600;">$1</a>')
      .replace(/\n/g, '<br>');
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
