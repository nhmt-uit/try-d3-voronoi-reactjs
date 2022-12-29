import React, { useEffect, useState } from 'react';

const styles = {
    wrapper: {
        zIndex: 1,
        color: 'white',
        height: '230px',
        width: '180px',
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '2px',
    },
    labelGroup: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    label: {
        display: 'block',
        fontSize: '1rem',
        fontWeight: 600,
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        fontSize: '1rem',
        minWidth: '50px',
        cursor: 'pointer',
        marginTop: '5px',
    },
};

function InputLocation({ lat, lng, onClickSave }) {
    const [lngInput, setLngInput] = useState(0);
    const [latInput, setLatInput] = useState(0);
    const [pm, setPM] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const onChangeLng = (e) => {
        setLngInput(e.target.value);
    };

    const onChangeLat = (e) => {
        setLatInput(e.target.value);
    };

    const onChangePM = (e) => {
        setPM(e.target.value);
    };

    useEffect(() => {
        setLngInput(lng);
        setLatInput(lat);
    }, [lat, lng]);

    useEffect(() => {
        if (InputValidation(latInput) && InputValidation(latInput) && InputValidation(pm)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [lngInput, latInput, pm]);

    return (
        <div style={styles.wrapper}>
            <h4 style={{ margin: '5px 0' }}> Create new point: </h4>
            <label style={styles.label}>Longitude</label>
            <input value={lngInput} onChange={(e) => onChangeLng(e)} />
            <br />
            <span style={styles.label}>Latitude</span>
            <input value={latInput} onChange={(e) => onChangeLat(e)} />
            <br />
            <span style={styles.label}>PM</span>
            <input value={pm} onChange={(e) => onChangePM(e)} />
            <br />
            <button
                style={styles.button}
                disabled={buttonDisabled}
                onClick={() => onClickSave({ latInput, lngInput, pm })}
            >
                Save
            </button>
            <span style={{ fontSize: '12px' }}> Click on the map to get coordinates </span>
        </div>
    );
}

const InputValidation = (value) => {
    if (!isNaN(value) && [0, '0', ''].indexOf(value) === -1) {
        return true;
    } else {
        return false;
    }
};

export default InputLocation;
