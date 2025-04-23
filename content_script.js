console.log("piped-extension ativo na página!");

function getVideoInfo() {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        const title = titleElement.textContent.trim();
        console.log("Título detectado:", title);
        saveToHistory(title);
    }
}

function saveToHistory(title) {
    const words = title.toLowerCase().split(/\s+/);
    chrome.storage.local.get(['history'], (result) => {
        let history = result.history || {};
        words.forEach(word => {
            history[word] = (history[word] || 0) + 1;
        });
        chrome.storage.local.set({ history: history }, () => {
            console.log("Histórico atualizado:", history);
        });
    });
}

setTimeout(getVideoInfo, 2000); // Tempo pra página carregar o título
