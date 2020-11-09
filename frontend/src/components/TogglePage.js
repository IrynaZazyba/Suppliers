import React, {useState} from 'react';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

function ToggleButtonExample(props) {

    const [radioValue, setRadioValue] = useState(props.props.countPerPage);

    const radios = [
        {name: '10', value: '10'},
        {name: '20', value: '20'},
    ];


    return (
        <>
            <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        size={"sm"}
                        key={idx}
                        type="radio"
                        variant="secondary"
                        name="radio"
                        value={radio.value}
                        checked={radioValue == radio.value}
                        onChange={(e) => {
                            setRadioValue(e.currentTarget.value);
                            props.onChange(e);
                        }}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </>
    );
}

export default ToggleButtonExample;
