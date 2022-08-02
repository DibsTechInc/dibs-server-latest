import propTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import DropDownMenu from 'shared/components/TextField/DropDownOutlined';
import getLocations from 'actions/studios/getStudioLocations';

export default function LocationSelector({ dibsStudioId, onChangeLocation, valueString, widthNumber }) {
    const menuOptions = useMemo(() => [{ value: '999', label: 'All Locations' }], []);
    const [locationOptions, setLocationOptions] = useState(menuOptions);
    useEffect(() => {
        const getLocationsFromDb = async () => {
            await getLocations(dibsStudioId).then((locations) => {
                if (locations.length > 0) {
                    const locationData = locations.map((location) => ({ value: location.id, label: location.name }));
                    const locationNewData = [...menuOptions, ...locationData];
                    setLocationOptions(locationNewData);
                }
            });
        };
        getLocationsFromDb();
    }, [dibsStudioId, menuOptions]);
    const handleOptionChange = (e) => {
        locationOptions.forEach((option) => {
            if (option.value === e.target.value) {
                onChangeLocation(e.target.value);
            }
        });
    };
    return <DropDownMenu options={locationOptions} valueString={valueString} widthNumber={widthNumber} onChange={handleOptionChange} />;
}
LocationSelector.propTypes = {
    dibsStudioId: propTypes.number,
    onChangeLocation: propTypes.func,
    valueString: propTypes.oneOfType([propTypes.string, propTypes.number]),
    widthNumber: propTypes.number
};
