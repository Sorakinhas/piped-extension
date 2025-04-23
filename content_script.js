console.log("piped-extension carregado e escutando...");

// Função para detectar se há erro no player
function checkForBlockedVideo() {
    const errorElement = document.querySelector('.error-screen, .player-error-message, .error-message');
    
    if (errorElement && errorElement.textContent) {
        const errorText = errorElement.textContent.toLowerCase();
        if (
            errorText.includes('sign in to confirm') ||
            errorText.includes('not available for embedding') ||
            errorText.includes('video unavailable') ||
            errorText.includes('this video may be inappropriate') ||
            errorText.includes('blocked')
        ) {
            console.log("🔒 Vídeo travado detectado, tentando bypass com yt-dlp...");
            attemptBypass();
        }
    }
}

// Função para converter o link atual do Piped pra link do YouTube
function getYoutubeLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return null;
}

// Função para chamar o servidor local
function attemptBypass() {
    const youtubeLink = getYoutubeLink();
    if (!youtubeLink) {
        console.error("❌ Não foi possível obter o link do vídeo.");
        return;
    }

    fetch(`http://localhost:5000/get_video?url=${encodeURIComponent(youtubeLink)}`)
        .then(response => response.json())
        .then(data => {
            if (data.video) {
                injectVideoPlayer(data.video, data.audio);
            } else {
                console.error("❌ Erro ao obter os links do servidor:", data);
            }
        })
        .catch(err => {
            console.error("❌ Erro na requisição ao servidor local:", err);
        });
}

// Injeta o player alternativo na página
function injectVideoPlayer(videoUrl, audioUrl) {
    const container = document.querySelector('.video-js') || document.querySelector('#player');
    if (container) {
        container.innerHTML = `
            <video controls autoplay style="width: 100%; height: auto;">
                <source src="${videoUrl}" type="video/mp4">
                Seu navegador não suporta vídeo.
            </video>
            <p style="color: #ccc;">Bypass ativo via piped-extension 🚀</p>
        `;
    } else {
        console.error("❌ Não foi possível encontrar o container do player.");
    }
}

// Checa a cada 2 segundos se o vídeo travou (pode ajustar esse tempo)
setInterval(checkForBlockedVideo, 2000);
