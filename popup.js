document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ history: [] }, ({ history }) => {
    const list = document.getElementById("historyList");

    if (history.length === 0) {
      const emptyMsg = document.createElement("li");
      emptyMsg.textContent = "Clipboard history is empty.";
      list.appendChild(emptyMsg);
      return;
    }

    history.forEach((item, index) => {
      const formatted = formatTime(item.time);

      const li = document.createElement("li");
      li.style.marginBottom = "8px";

      const headerDiv = document.createElement("div");
      headerDiv.style.display = "flex";
      headerDiv.style.justifyContent = "space-between";
      headerDiv.style.alignItems = "center";
      headerDiv.style.flexWrap = "wrap";

      const timeEl = document.createElement("b");
      timeEl.textContent = formatted;

      const butDiv = document.createElement("div");
      butDiv.style.display = "flex";
      butDiv.style.gap = "4px";

      const srcLink = document.createElement("a");
      try {
        const url = new URL(item.source);
        srcLink.href = url.href;
        srcLink.textContent = url.hostname;
        srcLink.target = "_blank";
      } catch (e) {
        srcLink.textContent = "Unknown source";
        srcLink.style.color = "#888";
      }

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(item.text).then(() => {
          copyBtn.textContent = "Copied";
          setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
        });
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => {
        chrome.storage.local.get({ history: [] }, ({ history }) => {
          history.splice(index, 1);
          chrome.storage.local.set({ history }, () => {
            li.remove();
          });
        });
      };

      headerDiv.appendChild(timeEl);
      butDiv.appendChild(srcLink);
      butDiv.appendChild(copyBtn);
      butDiv.appendChild(deleteBtn);
      headerDiv.appendChild(butDiv);

      const textEl = document.createElement("div");
      textEl.textContent = item.text;
      textEl.style.whiteSpace = "pre-wrap";
      textEl.style.wordBreak = "break-word";

      li.appendChild(headerDiv);
      li.appendChild(document.createElement("br"));
      li.appendChild(textEl);
      list.appendChild(li);
    });
  });
});

function formatTime(isoString) {
  const date = new Date(isoString);
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = (hours24 % 12 || 12).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${hours12}:${minutes} ${ampm} ${day}/${month}/${year}`;
}
