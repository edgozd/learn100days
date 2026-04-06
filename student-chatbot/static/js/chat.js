const messagesEl = document.getElementById('messages');
const inputEl    = document.getElementById('user-input');
const sendBtn    = document.getElementById('send-btn');
const tokenEl    = document.getElementById('token-display');

let isLoading = false;

// ---- Send message ----
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text || isLoading) return;

  // Remove welcome screen on first message
  const welcome = document.querySelector('.welcome-block');
  if (welcome) welcome.remove();

  appendMessage('user', text);
  inputEl.value = '';
  inputEl.style.height = 'auto';
  setLoading(true);

  const typingId = appendTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    removeTyping(typingId);

    if (!res.ok) {
      appendMessage('bot', data.error || 'Đã xảy ra lỗi.', true);
    } else {
      appendMessage('bot', data.reply, false, data.timestamp);
      if (data.tokens_used) {
        tokenEl.textContent = `${data.tokens_used.toLocaleString()} tokens`;
      }
    }
  } catch (err) {
    removeTyping(typingId);
    appendMessage('bot', '⚠️ Không kết nối được server. Hãy chắc chắn app đang chạy.', true);
  }

  setLoading(false);
}

// ---- Append message to DOM ----
function appendMessage(role, content, isError = false, time = '') {
  const div = document.createElement('div');
  div.className = `message ${role}`;

  const avatarEl = document.createElement('div');
  avatarEl.className = `avatar ${role === 'bot' ? 'bot' : 'user-av'}`;
  avatarEl.textContent = role === 'bot' ? '🎓' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble' + (isError ? ' error-bubble' : '');
  bubble.innerHTML = formatMarkdown(content);

  const timeEl = document.createElement('div');
  timeEl.className = 'bubble-time';
  timeEl.textContent = time || getCurrentTime();

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.appendChild(bubble);
  wrapper.appendChild(timeEl);

  div.appendChild(avatarEl);
  div.appendChild(wrapper);

  messagesEl.appendChild(div);
  scrollToBottom();
  return div;
}

// ---- Typing indicator ----
function appendTyping() {
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = id;

  const avatar = document.createElement('div');
  avatar.className = 'avatar bot';
  avatar.textContent = '🎓';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;

  div.appendChild(avatar);
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  scrollToBottom();
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ---- Quick messages ----
function sendQuickMessage(text) {
  inputEl.value = text;
  sendMessage();
}

// ---- Clear chat ----
async function clearChat() {
  try {
    await fetch('/api/clear', { method: 'POST' });
  } catch {}

  messagesEl.innerHTML = `
    <div class="welcome-block">
      <div class="welcome-emoji">👋</div>
      <h2>Xin chào, mình là StudyBot!</h2>
      <p>Mình có thể giúp bạn học lập trình, toán, kinh tế, ngoại ngữ và nhiều môn học khác. Hỏi mình bất cứ điều gì nhé!</p>
      <div class="welcome-chips">
        <span class="w-chip" onclick="sendQuickMessage('Tôi đang học lập trình Python, cho tôi bài tập cơ bản')">Bài tập Python</span>
        <span class="w-chip" onclick="sendQuickMessage('Giải thích Big-O notation')">Big-O là gì?</span>
        <span class="w-chip" onclick="sendQuickMessage('Cho tôi tips học tập hiệu quả')">Tips học tập</span>
      </div>
    </div>`;

  tokenEl.textContent = '— tokens';
}

// ---- Toggle sidebar on mobile ----
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// ---- Helpers ----
function setLoading(state) {
  isLoading = state;
  sendBtn.disabled = state;
}

function scrollToBottom() {
  setTimeout(() => messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' }), 50);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ---- Simple Markdown formatter ----
function formatMarkdown(text) {
  return text
    // code blocks
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // italic
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    // unordered lists
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // ordered lists  
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    // single newline
    .replace(/\n/g, '<br>');
}
