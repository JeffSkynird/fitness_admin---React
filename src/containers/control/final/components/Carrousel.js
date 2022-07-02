import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Splash1 from '../../../assets/images/01.png'
import Splash2 from '../../../assets/images/02.jpg'
import Splash3 from '../../../assets/images/03.jpg'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function Carrousel() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    return (
        <Carousel autoPlay={true} showThumbs={false} infiniteLoop={true} showStatus={false} dynamicHeight={true} axis="horizontal">

            <img src={Splash1} height={matches ? '60%' : 'auto'} style={{ objectFit: 'cover' }} />

            <img src={Splash2} height={matches ? '60%' : 'auto'} style={{ objectFit: 'cover' }} />

            <img src={Splash3} height={matches ? '60%' : 'auto'} style={{ objectFit: 'cover' }} />

        </Carousel>
    )
}
