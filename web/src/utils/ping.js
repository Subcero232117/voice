/**
 * Suaviza pings entrantes con un filtro exponencial.
 * Retorna la media redondeada; permite resetear.
 */
export function createPingSmoother(alpha = 0.25) {
    let avg = null;

    const smoother = (pingMs) => {
        if (typeof pingMs !== "number" || Number.isNaN(pingMs)) {
            return avg ?? 0;
        }
        avg = avg === null ? pingMs : avg * (1 - alpha) + pingMs * alpha;
        return Math.round(avg);
    };

    smoother.reset = () => { avg = null; };
    return smoother;
}
