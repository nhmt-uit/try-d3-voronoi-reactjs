import { ScatterplotLayer } from 'deck.gl';

const Layer = (data) => {
    return [
        new ScatterplotLayer({
            id: 'scatter-layer',
            data,
            opacity: 0.5,
            stroked: true,
            filled: true,
            radiusMinPixels: 10,
            radiusMaxPixels: 1000,
            lineWidthMinPixels: 1,
            getPosition: (d) => d.position,
            getRadius: (d) => Math.sqrt(d.exits),
            getFillColor: (d) => [255, 140, 0],
            getLineColor: (d) => [255, 0, 0],
        }),
    ];
};

export default Layer;
