let activeColorTarget = 'bg';

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    setTimeout(() => {
        follower.style.left = `${e.clientX - 11}px`;
        follower.style.top = `${e.clientY - 11}px`;
    }, 50);
});

const canvasArea = document.getElementById('canvasArea');
const sketchLinear = document.getElementById('sketchwareLinear');

canvasArea.addEventListener('mousemove', (e) => {
    const rect = canvasArea.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (-y / 15);
    const rotateY = (x / 15);
    
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
    
    const rtl = document.getElementById('radiusTopLeft').value;
    const rtr = document.getElementById('radiusTopRight').value;
    const rbr = document.getElementById('radiusBottomRight').value;
    const rbl = document.getElementById('radiusBottomLeft').value;
    const elevation = document.getElementById('elevationRange').value;

    document.getElementById('bgColorText').value = bgColor;
    document.getElementById('strokeText').value = strokeColor;
    document.getElementById('strokeVal').innerText = strokeWidth;
    
    document.getElementById('rtlVal').innerText = rtl;
    document.getElementById('rtrVal').innerText = rtr;
    document.getElementById('rbrVal').innerText = rbr;
    document.getElementById('rblVal').innerText = rbl;
    document.getElementById('elevationVal').innerText = elevation;

    // Aplicar cantos individuais no preview
    sketchLinear.style.backgroundColor = bgColor;
    sketchLinear.style.border = `${strokeWidth}px solid ${strokeColor}`;
    sketchLinear.style.borderRadius = `${rtl}px ${rtr}px ${rbr}px ${rbl}px`;
    sketchLinear.style.boxShadow = `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.5)`;

    updateCodeXML(bgColor, strokeColor, strokeWidth, rtl, rtr, rbr, rbl, elevation);
}

function updateCodeXML(bg, stroke, width, rtl, rtr, rbr, rbl, elevation) {
    const xml = `<!-- Sketchware Custom Background / XML Shape -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="${bg}" />
    <stroke android:width="${width}dp" android:color="${stroke}" />
    <corners 
        android:topLeftRadius="${rtl}dp"
        android:topRightRadius="${rtr}dp"
        android:bottomRightRadius="${rbr}dp"
        android:bottomLeftRadius="${rbl}dp" />
    <elevation android:value="${elevation}dp" />
</shape>`;
    
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
    const bgMatch = code.match(/android:color="([^"]+)"/i) || code.match(/background="([^"]+)"/i);
    const rtlMatch = code.match(/topLeftRadius="([^"]+)"/i);
    const rtrMatch = code.match(/topRightRadius="([^"]+)"/i);
    const rbrMatch = code.match(/bottomRightRadius="([^"]+)"/i);
    const rblMatch = code.match(/bottomLeftRadius="([^"]+)"/i);

    if (bgMatch && bgMatch[1].startsWith('#')) {
        document.getElementById('bgColor').value = bgMatch[1];
    }
    if (rtlMatch) document.getElementById('radiusTopLeft').value = parseInt(rtlMatch[1]) || 0;
    if (rtrMatch) document.getElementById('radiusTopRight').value = parseInt(rtrMatch[1]) || 0;
    if (rbrMatch) document.getElementById('radiusBottomRight').value = parseInt(rbrMatch[1]) || 0;
    if (rblMatch) document.getElementById('radiusBottomLeft').value = parseInt(rblMatch[1]) || 0;

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
        alert("Seu navegador não suporta o EyeDropper nativo. Use a paleta de cores!");
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
    alert("Código copiado para a área de transferência!");
}

function exportToGitHub() {
    alert("Repositório configurado! Suba estes arquivos (index.html, style.css, script.js) e ative o GitHub Pages.");
}

window.onload = updatePreview;
