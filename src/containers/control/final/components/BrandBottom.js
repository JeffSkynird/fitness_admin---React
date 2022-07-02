import React from 'react'

import Logo1 from '../../../assets/images/LogoXFIT.png'
import Logo2 from '../../../assets/images/LogoPARTAN.png'
import { Typography, useMediaQuery, useTheme } from '@material-ui/core'
import InstagramIcon from '@material-ui/icons/Instagram';
export default function BrandBottom() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    return (
        <div style={{ backgroundColor: '#000000', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: 50 }}>
            <Typography variant="h3" color="initial" style={{ color: 'gray', textAlign: 'center' }}>ORGANIZA</Typography>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly',marginTop:30 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginRight:30 }}>
                    <img src={Logo1} style={{ height: matches?100:200 }} />
                    <a href="https://www.instagram.com/xfit_time/" style={{ marginTop: 10, textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><InstagramIcon style={{ marginRight: 5, color: '#981717' }} /> @XFIT_TIME
                    </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={Logo2} style={{ height:  matches?100:200  }} />
                    <a href="https://www.instagram.com/spartanleo2017/?hl=en" style={{ marginTop: 10, textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><InstagramIcon style={{ marginRight: 5, color: '#981717' }} /> @SPARTANLEO2017
                    </a>
                </div>
            </div>
        </div>
    )
}
