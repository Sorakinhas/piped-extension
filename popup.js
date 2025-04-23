function generateRecommendations(history) {
    const sorted = Object.entries(history)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);  // Top 5 palavras

    const recommendations = sorted.map(([word, count]) => {
        const searchUrl = `https://piped.kavin.rocks/results?search_query=${encodeURIComponent(word)}`;
        return `<div class="recommendation"><a href="${searchUrl}" target="_blank">${word} (${count}x)</a></div>`;
    }).join('');

    return recommendations || "<p>Nenhum histórico ainda!</p>";
}

chrome.storage.local.get(['history'], (result) => {
    const history = result.history || {};
    const container = document.getElementById('recommendations');
    container.innerHTML = generateRecommendations(history);
});
