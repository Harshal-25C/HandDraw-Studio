/**
 * Harsh Diary — Hand Tracker
 * Initialises MediaPipe Hands + Camera and feeds results to DiaryEngine.
 */

const HandTracker = (() => {

  let hands, camera;

  function init(videoEl, onReady) {
    hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,          // 0 = lite model, much faster
      minDetectionConfidence: 0.4, // lower = detects faster
      minTrackingConfidence: 0.4,  // lower = tracks without re-detecting constantly
    });

    hands.onResults((results) => {
      DiaryEngine.render(results);
    });

    camera = new Camera(videoEl, {
      onFrame: async () => {
        await hands.send({ image: videoEl });
      },
      width: 640,   // was 1280 — half resolution = 2x faster processing
      height: 360,
    });

    camera.start().then(() => {
      if(typeof onReady === 'function') onReady();
    }).catch((err) => {
      console.error('Camera failed:', err);
      document.getElementById('status').textContent = '⚠ Camera access denied';
    });
  }

  return { init };
})();
