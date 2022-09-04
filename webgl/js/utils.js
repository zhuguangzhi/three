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