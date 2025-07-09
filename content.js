document.addEventListener("copy", () => {
  const copiedText = document.getSelection().toString();
  if (copiedText.trim()) {
    const sourceUrl = location.href;

    chrome.storage.local.get({ history: [] }, ({ history }) => {
      history.unshift({
        text: copiedText,
        source: sourceUrl,
        time: new Date().toISOString(),
      });
      history = history.slice(0, 100);
      chrome.storage.local.set({ history });
    });
  }
});
