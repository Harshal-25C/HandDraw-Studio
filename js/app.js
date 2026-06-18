/**
 * Harsh Tech Diary(Harshal's Brand Name) — App Entry Point
 * Boots the loading screen, initialises engine, tracker, and UI.
 */

window.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  const canvas    = document.getElementById('canvas');
  const video     = document.getElementById('vid');

  //Init drawing engine first
  DiaryEngine.init(canvas);

  //Init UI (toolbar, shortcuts, etc.)
  UI.init();

  //Hide hint after 6 s
  setTimeout(() => {
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = '0';
  }, 6000);

  //Start hand tracker — hide loader once camera is live
  HandTracker.init(video, () => {
    setTimeout(() => {
      loadingEl.classList.add('hidden');
      setTimeout(() => { loadingEl.style.display = 'none'; }, 900);
      UI.toast('✦ Raise your hand to begin');
    }, 600);
  });

});
