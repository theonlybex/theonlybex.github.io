import type { ChatMessage } from './types.js';

export function initChat(): void {
  const toggle   = document.getElementById('chat-toggle');
  const panel    = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input    = document.getElementById('chat-input') as HTMLInputElement | null;
  const sendBtn  = document.getElementById('chat-send');
  const msgs     = document.getElementById('chat-messages');

  if (!toggle || !panel || !input || !sendBtn || !msgs || !closeBtn) return;

  const history: ChatMessage[] = [];
  let isOpen   = false;
  let isTyping = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('chat-open', isOpen);
    toggle.classList.toggle('chat-active', isOpen);
    if (isOpen && history.length === 0) showWelcome();
    if (isOpen) setTimeout(() => input.focus(), 300);
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('chat-open');
    toggle.classList.remove('chat-active');
  });

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  function showWelcome(): void {
    appendMessage('assistant', "Hey! I'm Bex. Ask me anything — my experience, projects, what I'm looking for. I'll answer honestly.");
  }

  function send(): void {
    const text = input!.value.trim();
    if (!text || isTyping) return;
    input!.value = '';
    appendMessage('user', text);
    history.push({ role: 'user', content: text });
    isTyping = true;
    showTyping();

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
      .then(r => r.json())
      .then((data: { reply?: string; error?: string }) => {
        removeTyping();
        isTyping = false;
        const reply = data.reply ?? data.error ?? 'Something went wrong.';
        appendMessage('assistant', reply);
        history.push({ role: 'assistant', content: reply });
      })
      .catch(() => {
        removeTyping();
        isTyping = false;
        appendMessage('assistant', 'Network error. Reach me at itsbebox@gmail.com');
      });
  }

  function appendMessage(role: 'user' | 'assistant', text: string): void {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg--${role}`;
    div.textContent = text;
    msgs!.appendChild(div);
    msgs!.scrollTop = msgs!.scrollHeight;
  }

  function showTyping(): void {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--assistant chat-typing';
    div.id = 'chat-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs!.appendChild(div);
    msgs!.scrollTop = msgs!.scrollHeight;
  }

  function removeTyping(): void {
    document.getElementById('chat-typing-indicator')?.remove();
  }
}
