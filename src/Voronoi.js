import React, { useEffect, useRef } from 'react';
import { voronoi } from 'd3-voronoi';
import { select } from 'd3-selection';
import { WebMercatorViewport } from 'deck.gl';

function Voronoi({ viewport, data }) {
    if (!data.map) return null;
    viewport = new WebMercatorViewport(viewport);
    const width = viewport.width;
    const height = viewport.height;
    const point = data.map((d) => viewport.project(d.position));
    const pointPmMap = data.map((d) => {
        return { array: viewport.project(d.position), pm: d.pm };
    });
    const vor = voronoi().extent([
        [0, 0],
        [width, height],
    ]);
    const polygons = vor(point).triangles();
    //const polygons = vor(point).polygons();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const pathGroupEl = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const update = useRef();

    update.current = () => {
        const selected = select(pathGroupEl.current).selectAll('.cell').data(polygons);

        const enter = selected
            .enter()
            .append('path')
            .attr('class', 'cell')
            .attr('fill', (d) => {
                let total = 0;
                d.forEach((item) => {
                    pointPmMap.forEach((point) => {
                        if (JSON.stringify(point.array) === JSON.stringify(item)) {
                            total += Number(point.pm) / 3;
                        }
                    });
                });
                if (total >= 2.5) {
                    return 'rgba(255, 0, 0, 0.9)';
                } else if (total < 2.5 && total > 1) {
                    return 'rgba(255, 0, 0, 0.6)';
                } else {
                    return 'rgba(255, 0, 0, 0.3)';
                }
            })
            .attr('stroke', 'black');

        selected.merge(enter).attr('d', (d) => {
            if (!d || d.length < 1) return null;
            return `M${d.join('L')}Z`;
        });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        update.current();
    }, [polygons]);

    return (
        <svg viewBox={`0 0 ${viewport.width} ${viewport.height}`}>
            <g ref={pathGroupEl} />
        </svg>
    );
}

export default Voronoi;
