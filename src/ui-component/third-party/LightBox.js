import PropTypes from 'prop-types';

// third-party
// import Carousel from 'react-images';
import Carousel from 'react-responsive-carousel';

// ==============================|| POPUP IMAGES BOX / LIGHT BOX ||============================== //

const LightBox = ({ currentImage, photos }) => (
    <>
        <Carousel
            currentIndex={currentImage}
            views={photos.map((x) => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
            }))}
        />
    </>
);

LightBox.propTypes = {
    currentImage: PropTypes.number,
    photos: PropTypes.array
};

export default LightBox;
