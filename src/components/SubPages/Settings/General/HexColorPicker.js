import propTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

const ColorPickerWidget = (props) => {
    const { currentcolor, colorfunction } = props;
    // const [color, setColor] = useState(currentcolor);
    return <HexColorPicker color={currentcolor} onChange={colorfunction} />;
};
ColorPickerWidget.propTypes = {
    currentcolor: propTypes.string.isRequired,
    colorfunction: propTypes.func.isRequired
};
export default ColorPickerWidget;
