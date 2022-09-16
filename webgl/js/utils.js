export function getMousePosInWebgl({clientX, clientY},canvas){
    //鼠标在画布中的css位置
    const { left, top, width, height } = canvas.getBoundingClientRect();
    const [cssX, cssY] = [clientX - left, clientY - top];

    //解决坐标原点位置的差异
    const [halfWidth, halfHeight] = [width / 2, height / 2];
    const [xBaseCenter, yBaseCenter] = [
        cssX - halfWidth,
        cssY - halfHeight,
    ];
    // 解决y 方向的差异
    const yBaseCenterTop = -yBaseCenter;
    //解决坐标基底的差异
    return {
        x:xBaseCenter / halfWidth,
        y:yBaseCenterTop / halfHeight
    }
}
export function glToCssPos({x,y},{width,height}){
    const [halfWidth, halfHeight] = [width / 2, height / 2]
    return {
        x:x*halfWidth,
        y:-y*halfHeight
    }
}
export function parseColorStops(source) {
    const stops = new Array(16).fill(-1);
    source.forEach(({ color, stop }, stopInd) => {
        let rgb = '';
        let ar = '';
        color.forEach((ele, ind) => {
            const str = (ele + 1000).toString().slice(1);
            if (ind < 3) {
                rgb += str;
            } else {
                ar += str;
            }
        })
        ar += (Math.round(stop * 255) + 1000).toString().slice(1);
        stops[stopInd * 2] = rgb;
        stops[stopInd * 2 + 1] = ar;
    })
    return stops;
}