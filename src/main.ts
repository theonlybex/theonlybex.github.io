import { initNav }    from './nav.js';
import { initReveal } from './reveal.js';
import { initOrbs }   from './orbs.js';
import { initCursor } from './cursor.js';
import { initTheme }  from './theme.js';
import { initGitHub } from './github.js';
import { initChat }   from './chat.js';
import { initResume } from './resume.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initOrbs();
  initCursor();
  initTheme();
  initChat();
  initResume();
  void initGitHub();
});
