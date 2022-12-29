import React, { useState, useEffect } from 'react';
import ReactMapGl from 'react-map-gl';
import DeckGL from 'deck.gl';
import { csv } from 'd3-fetch';
import InputLocation from './InputLocation.js';
import layer from './Layer.js';
import Voronoi from './Voronoi.js';

const DATA_URL = './heatmap-data.csv';

let token = 'pk.eyJ1IjoibmhtdC11aXQiLCJhIjoiY2xjNmFzcjQ2MnZxbDNvcGp6d3F6eTBqaSJ9.Wr5Ton63cKo90l2hSPJkVQ';
function Mapbox() {
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [data, setData] = useState({});
    const [viewPort, setViewPort] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 21.0244246,
        longitude: 105.7938072,
        zoom: 12,
        pitch: 0,
        bearing: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await csv(DATA_URL);
            const points = result.map(function (d) {
                return { position: [+d.lng, +d.lat], pm: d.pm };
            });
            setData(points);
        };

        fetchData();
    }, []);

    const handleSetViewPort = (evt) => {
        const { longitude, latitude, zoom } = evt.viewState;
        let viewport = { ...viewPort, latitude, longitude, zoom };
        setViewPort(viewport);
    };

    const handleClickOnMap = (value) => {
        let lat = value[1];
        let lng = value[0];
        setLat(lat);
        setLng(lng);
    };

    const onClickSave = (dataSave) => {
        let oldData = data.slice();
        let newItem = [{ position: [+dataSave.lngInput, +dataSave.latInput], pm: dataSave.pm }];
        let newData = oldData.concat(newItem);
        setData(newData);
    };

    return (
        <>
            <InputLocation lat={lat} lng={lng} onClickSave={onClickSave} />
            <DeckGL
                style={{ zIndex: -1 }}
                layers={layer(data)}
                initialViewState={viewPort}
                controller={true}
                onClick={(evt) => handleClickOnMap(evt.coordinate)}
                onViewStateChange={(evt) => handleSetViewPort(evt)}
            >
                <ReactMapGl
                    {...viewPort}
                    style={{ width: '80vw', height: '100vh' }}
                    preventStyleDiffing={false}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    mapboxAccessToken={token}
                    //onMove={(evt) => handleSetViewPort(evt)}
                ></ReactMapGl>
                <Voronoi viewport={viewPort} data={data} />
            </DeckGL>
        </>
    );
}

export default Mapbox;
