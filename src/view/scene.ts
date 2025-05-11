async function loadAndColorSVG(url: string, colorMap: Record<string, string>): Promise<HTMLImageElement> {
    const response = await fetch(url);
    let svgText = await response.text();

    for (const [originalColor, newColor] of Object.entries(colorMap)) {
        const regex = new RegExp(`"${originalColor}"`, 'gi');
        svgText = svgText.replace(regex, `"${newColor}"`);
        const fillRegex = new RegExp(`fill="${originalColor}"`, 'gi');
        svgText = svgText.replace(fillRegex, `fill="${newColor}"`);
    }

    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url2 = URL.createObjectURL(blob);

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url2);
            resolve(img);
        };
        img.src = url2;
    });
}

export async function drawScene(themeColors: { wall: Record<string, string>, leftWall: Record<string, string>, floor: Record<string, string> }) {
    const canvas = document.getElementById('scene') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const wall = await loadAndColorSVG('assets/'+ themeColors.wall.asset +'.svg', themeColors.wall);
    ctx.drawImage(wall, 0, 0, canvasWidth, canvasHeight);

    const leftWall = await loadAndColorSVG('assets/'+ themeColors.leftWall.asset +'.svg', themeColors.leftWall);
    ctx.drawImage(leftWall, 0, 0, canvasWidth, canvasHeight);

    const floor = await loadAndColorSVG('assets/'+ themeColors.floor.asset +'.svg', themeColors.floor);
    ctx.drawImage(floor, 0, 0, canvasWidth, canvasHeight);
}


drawScene({
    wall: { "white": "#0000d5", "asset": "wall2" },
    leftWall: { "white": "#e0155d", "asset": "left_wall1" },
    floor: { "white": "#ffffff", "asset": "floor1" }
});