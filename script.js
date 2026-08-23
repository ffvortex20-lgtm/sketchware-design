let activeColorTarget = 'bg';

// Cursor Interativo
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX} cidade` || `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    setTimeout(() => {
        follower.style.left = `${e.clientX - 11}px`;
        follower.style.top = `${e.clientY - 11}px`;
    }, 50);
});

// Efeito Tilt 3D no Canvas com o Mouse
const canvasArea = document.getElementById('canvasArea');
const sketchLinear = document.getElementById('sketchwareLinear');

canvasArea.addEventListener('mousemove', (e) => {
    const rect = canvasArea.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Rotação baseada na posição do mouse
    const rotateX = (-y / 12);
    const rotateY = (x / 12);
    
    sketchLinear.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

canvasArea.addEventListener('mouseleave', () => {
    sketchLinear.style.transform = `rotateX(0deg) rotateY(0deg)`;
    sketchLinear.style.transition = 'transform 0.5s ease';
});

canvasArea.addEventListener('mouseenter', () => {
    sketchLinear.style.transition = 'none';
});

function updatePreview() {
    const bgColor = document.getElementById('bgColor').value;
    const strokeColor = document.getElementById('strokeColor').value;
    const strokeWidth = document.getElementById('strokeWidth').value;
    const radius = document.getElementById('radiusRange').value;
    const elevation = document.getElementById('elevationRange').value;

    document.getElementById('bgColorText').value = bgColor;
    document.getElementById('strokeText').value = strokeColor;
    document.getElementById('strokeVal').innerText = strokeWidth;
    document.getElementById('radiusVal').innerText = radius;
    document.getElementById('elevationVal').innerText = elevation;

    // Aplicar no Linear do Sketchware
    sketchLinear.style.backgroundColor = bgColor;
    sketchLinear.style.border = `${strokeWidth}px solid ${strokeColor}`;
    sketchLinear.style.borderRadius = `${radius}px`;
    sketchLinear.style.boxShadow = `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.5)`;

    updateCodeXML(bgColor, strokeColor, strokeWidth, radius, elevation);
}

function updateCodeXML(bg, stroke, width, radius, elevation) {
    const xml = `<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="${bg}"
    android:padding="16dp"
    app:strokeColor="${stroke}"
    app:strokeWidth="${width}dp"
    app:cornerRadius="${radius}dp"
    app:elevation="${elevation}dp" />`;
    
    document.getElementById('codeOutput').innerText = xml;
}

function syncColorText(target) {
    if (target === 'bg') {
        const val = document.getElementById('bgColorText').value;
        if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
            document.getElementById('bgColor').value = val;
            updatePreview();
        }
    } else {
        const val = document.getElementById('strokeText').value;
        if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
            document.getElementById('strokeColor').value = val;
            updatePreview();
        }
    }
}

function identifyAndRender() {
    const code = document.getElementById('importCode').value;
    const bgMatch = code.match(/android:background="([^"]+)"/i) || code.match(/background[:=]\s*["']?([^"'\s]+)/i);
    const radiusMatch = code.match(/cornerRadius="([^"]+)"/i) || code.match(/radius="([^"]+)"/i);

    if (bgMatch && bgMatch[1].startsWith('#')) {
        document.getElementById('bgColor').value = bgMatch[1];
    }
    if (radiusMatch) {
        let rad = parseInt(radiusMatch[1]);
        if (!isNaN(rad)) document.getElementById('radiusRange').value = rad;
    }

    updatePreview();
    alert("Código identificado e renderizado com sucesso!");
}

function openFloatingPicker(target) {
    activeColorTarget = target;
    document.getElementById('floatingPickerModal').style.display = 'flex';
}

function closeFloatingPicker() {
    document.getElementById('floatingPickerModal').style.display = 'none';
}

function pickPreset(hex) {
    if (activeColorTarget === 'bg') {
        document.getElementById('bgColor').value = hex;
    } else {
        document.getElementById('strokeColor').value = hex;
    }
    updatePreview();
    closeFloatingPicker();
}

async function useEyeDropperAPI() {
    if (!window.EyeDropper) {
        alert("Seu navegador não suporta o EyeDropper nativo. Use a paleta!");
        return;
    }
    try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
            pickPreset(result.sRGBHex);
        }
    } catch (e) {
        console.log("Cancelado.");
    }
}

function copyCode() {
    navigator.clipboard.writeText(document.getElementById('codeOutput').innerText);
    alert("Código XML copiado!");
}

function exportToGitHub() {
    alert("Suba estes arquivos no seu repositório do GitHub e ative o GitHub Pages nas configurações!");
}

window.onload = updatePreview;
