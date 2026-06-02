const CATEGORY_MAP = {
    micancas: 'micancas',
    passantes: 'passantes',
    medalhas: 'entremeios',
    crucifixos: 'crucifixos',
};

const fallbackCatalog = () => ({
    micancas: [
        { id: 'm1', name: 'Cristal Azul', material: 'Cristal', price: 7.50, color: '#1e2d8a', shine: true },
        { id: 'm2', name: 'Madeira de Oliveira', material: 'Madeira', price: 7.50, color: '#8b6f5c', shine: false },
        { id: 'm3', name: 'Pérola Branca', material: 'Pérola', price: 7.50, color: '#f0ede6', shine: true },
        { id: 'm4', name: 'Quartzo Rosa', material: 'Quartzo', price: 7.50, color: '#f0b8c4', shine: true },
        { id: 'm5', name: 'Ônix Negro', material: 'Pedra', price: 7.50, color: '#1c1c1e', shine: true },
        { id: 'm6', name: 'Ágata Vermelha', material: 'Pedra', price: 7.50, color: '#8b1e1e', shine: true },
        { id: 'm7', name: 'Jade Verde', material: 'Pedra', price: 7.50, color: '#3a7a48', shine: true },
        { id: 'm8', name: 'Âmbar Dourado', material: 'Resina', price: 7.50, color: '#b87d2a', shine: true },
    ],
    passantes: [
        { id: 'p1', name: 'Prata 925', material: 'Prata', price: 7.50, color: '#c0c0c0', shine: true },
        { id: 'p2', name: 'Ouro Velho', material: 'Metal', price: 7.50, color: '#b8973a', shine: true },
        { id: 'p3', name: 'Bronze Rústico', material: 'Bronze', price: 7.50, color: '#7d5a3c', shine: false },
        { id: 'p4', name: 'Aço Inox', material: 'Metal', price: 7.50, color: '#adb5bd', shine: true },
    ],
    medalhas: [
        { id: 'md1', name: 'Nossa Senhora de Fátima', material: 'Metal', price: 7.50, color: '#b8973a', shine: true },
        { id: 'md2', name: 'Nossa Senhora Aparecida', material: 'Metal', price: 7.50, color: '#c0c0c0', shine: true },
        { id: 'md3', name: 'Sagrado Coração', material: 'Metal', price: 7.50, color: '#c0392b', shine: true },
        { id: 'md4', name: 'São Bento', material: 'Metal', price: 7.50, color: '#7d5a3c', shine: false },
    ],
    crucifixos: [
        { id: 'c1', name: 'Crucifixo Prata', material: 'Prata', price: 7.50, color: '#c0c0c0', shine: true },
        { id: 'c2', name: 'Crucifixo Ouro', material: 'Metal', price: 7.50, color: '#b8973a', shine: true },
        { id: 'c3', name: 'Crucifixo Madeira', material: 'Madeira', price: 7.50, color: '#6d4c41', shine: false },
        { id: 'c4', name: 'Crucifixo Bronze', material: 'Bronze', price: 7.50, color: '#7d5a3c', shine: false },
    ]
});

let catalog = {
    micancas: [],
    passantes: [],
    medalhas: [],
    crucifixos: [],
};

const selected = {};
const requiredCategories = ['micancas', 'passantes', 'medalhas', 'crucifixos'];

const normalizeItem = (item) => ({
    id: item.id,
    name: item.name || '',
    material: item.material || '',
    price: Number(item.price) || 0,
    color: item.color || '#c8bfb0',
    shine: Boolean(item.shine),
});

const fetchCategoryItems = async (category) => {
    const apiCategory = CATEGORY_MAP[category] || category;
    try {
        const items = await ApiClient.get(`/api/pecas/${apiCategory}`);
        return Array.isArray(items) ? items.map(normalizeItem) : [];
    } catch (error) {
        console.warn(`Falha ao carregar ${category}:`, error);
        return null;
    }
};

const loadCatalog = async () => {
    const categories = ['micancas', 'passantes', 'medalhas', 'crucifixos'];
    const results = await Promise.all(categories.map((category) => fetchCategoryItems(category)));

    if (results.some((items) => items === null)) {
        catalog = fallbackCatalog();
    } else {
        catalog = {
            micancas: results[0],
            passantes: results[1],
            medalhas: results[2],
            crucifixos: results[3],
        };
    }

    requiredCategories.forEach((category) => {
        if (catalog[category]?.length) {
            selected[category] = catalog[category][0];
        }
    });

    Object.entries(catalog).forEach(([category, items]) => buildCards(category, items));
    document.querySelectorAll('.tab-panel').forEach((p) => (p.style.display = 'none'));
    document.getElementById('tab-micancas').style.display = 'block';
    updateRosary();
    updateTotal();
    updateSummary();
};

loadCatalog();

const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16)
    ];
};


const lighten = (hex, percentage) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgb(${Math.min(255, r + percentage)},${Math.min(255, g + percentage)},${Math.min(255, b + percentage)})`;
};


const darken = (hex, percentage) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgb(${Math.max(0, r - percentage)},${Math.max(0, g - percentage)},${Math.max(0, b - percentage)})`;
};


const buildSwatchGradient = (item) => {
    if (item.shine) {
        return `radial-gradient(circle at 35% 30%, ${lighten(item.color, 60)} 0%, ${item.color} 45%, ${darken(item.color, 30)} 100%)`;
    }
    return `radial-gradient(circle at 35% 30%, ${lighten(item.color, 20)} 0%, ${item.color} 60%, ${darken(item.color, 20)} 100%)`;
};


const getShineEmoji = (item) => item.shine ? '💎' : '🔹';


const buildCircleGradient = (hex, id) => {
    const light = lighten(hex, 70);
    const mid = hex;
    const dark = darken(hex, 35);
    const defs = `
    <radialGradient id="g${id}" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="${light}"/>
      <stop offset="50%"  stop-color="${mid}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </radialGradient>`;
    return { defs };
};


const buildCards = (category, items) => {
    const grid = document.getElementById(`beadGrid-${category}`);
    grid.innerHTML = '';

    items.forEach(item => {
        const isSelected = selected[category]?.id === item.id;
        const card = document.createElement('div');
        card.className = `bead-card${isSelected ? ' selected' : ''}`;
        card.dataset.id = item.id;

        const formattedPrice = item.price.toFixed(2).replace('.', ',');
        const shineEmoji = getShineEmoji(item);
        card.innerHTML = `
            <div class="bead-swatch" style="background:${buildSwatchGradient(item)}"></div>
            <div class="bead-info">
                <div class="bead-name">${item.name}</div>
                <div class="bead-meta">${item.material} · <span>R$ ${formattedPrice}</span></div>
                <div style="font-size: 0.85em; color: var(--muted); margin-top: 0.25em;">${shineEmoji} ${item.shine ? 'Brilhoso' : 'Opaco'}</div>
            </div>`;

        card.addEventListener('click', () => selectItem(category, item));
        grid.appendChild(card);
    });
};


const selectItem = (category, item) => {
    selected[category] = item;
    buildCards(category, catalog[category]);
    updateRosary();
    updateTotal();
    updateSummary();
};




const updateTotal = () => {
    const total = Object.values(selected).reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = total.toFixed(2).replace('.', ',');
    document.getElementById('totalDisplay').textContent = `R$ ${formattedTotal}`;
};


const updateSummary = () => {
    const box = document.getElementById('summaryItems');
    const entries = Object.entries(selected);

    if (!entries.length) {
        box.innerHTML = `<div class="summary-item" style="color:var(--muted);font-style:italic;">Nenhum item selecionado ainda.</div>`;
        return;
    }

    box.innerHTML = entries.map(([category, item]) => {
        const formattedPrice = item.price.toFixed(2).replace('.', ',');
        const shineEmoji = getShineEmoji(item);
        return `
            <div class="summary-item">
                <span>
                    <span class="s-dot" style="background:${buildSwatchGradient(item)}"></span>
                    ${item.name} ${shineEmoji}
                </span>
                <span class="s-price">R$ ${formattedPrice}</span>
            </div>`;
    }).join('');
};


const ROSARY_CONFIG = {
    centerX: 150,
    centerY: 140,
    radius: 95,
    beadCount: 50,
    separatorPositions: [0, 10, 20, 30, 40] // A cada 10 contas = separador de dezena
};

/** Calcula posição (x, y) de uma conta no círculo */
const beadPos = (index, total, radius) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
        x: ROSARY_CONFIG.centerX + radius * Math.cos(angle),
        y: ROSARY_CONFIG.centerY + radius * Math.sin(angle)
    };
};


const updateRosary = () => {
    const mainColor = selected.micancas?.color ?? '#1e2d8a';
    const separatorColor = selected.passantes?.color ?? '#b0a898';
    const tailColor = selected.micancas?.color ?? '#1e2d8a';
    const crossColor = selected.crucifixos?.color ?? '#9a8e80';

    updateMainBeads(mainColor, separatorColor);
    updateTailBeads(tailColor);
    updateCross(crossColor);
};

const updateMainBeads = (mainColor, separatorColor) => {
    const mainG = document.getElementById('mainBeads');
    mainG.innerHTML = '';

    let allDefs = '';
    let circlesHtml = '';

    for (let i = 0; i < ROSARY_CONFIG.beadCount; i++) {
        const { x, y } = beadPos(i, ROSARY_CONFIG.beadCount, ROSARY_CONFIG.radius);
        const isSeparator = ROSARY_CONFIG.separatorPositions.includes(i);
        const color = isSeparator ? separatorColor : mainColor;
        const radius = isSeparator ? 6.5 : 4.5;
        const gradientId = isSeparator ? 'sep' + i : 'main' + i;

        const { defs } = buildCircleGradient(color, gradientId);
        allDefs += defs;

        circlesHtml += `
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius}"
                    fill="url(#g${gradientId})"
                    stroke="rgba(0,0,0,.12)" stroke-width=".5"/>`;
    }

    mainG.innerHTML = `<defs>${allDefs}</defs>${circlesHtml}`;
};

/** Renderiza as contas da cauda do rosário */
const updateTailBeads = (tailColor) => {
    const tailG = document.getElementById('tailBeads');
    tailG.innerHTML = '';

    const tailPositions = [
        { x: 150, y: 243 },
        { x: 150, y: 252 },
        { x: 150, y: 261 }
    ];

    let allDefs = '';
    let circlesHtml = '';

    // Contas da cauda (pequenas)
    tailPositions.forEach((pos, i) => {
        const { defs } = buildCircleGradient(tailColor, 'tail' + i);
        allDefs += defs;

        circlesHtml += `
            <circle cx="${pos.x}" cy="${pos.y}" r="4" fill="url(#gtail${i})"
                    stroke="rgba(0,0,0,.12)" stroke-width=".5"/>`;
    });

    // Última conta (maior = entremeio)
    const lastPosition = { x: 150, y: 270 };
    const { defs: lastDefs } = buildCircleGradient(tailColor, 'taillast');
    allDefs += lastDefs;

    circlesHtml += `
        <circle cx="${lastPosition.x}" cy="${lastPosition.y}" r="6"
                fill="url(#gtaillast)" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>`;

    tailG.innerHTML = `<defs>${allDefs}</defs>${circlesHtml}`;
};


const updateCross = (crossColor) => {
    const crossG = document.getElementById('cross');
    crossG.querySelectorAll('rect').forEach(rect => {
        rect.setAttribute('stroke', crossColor);
    });
};




document.getElementById('tabBar').addEventListener('click', (event) => {
    const btn = event.target.closest('.tab-btn');
    if (!btn) return;

    const tabName = btn.dataset.tab;

    // Remove ativo de todos os botões e painéis
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');

    btn.classList.add('active');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
});


const handleOrder = () => {
    const missingCategories = requiredCategories.filter((category) => !selected[category]);
    if (missingCategories.length) {
        alert('Selecione uma opção para todas as categorias antes de continuar.');
        return;
    }

    sessionStorage.setItem('bemAventurada_selected', JSON.stringify(selected));
    window.location.href = '/checkout/pedido';
};



