import React from 'react'

import Logo2 from '../../../assets/images/slogan.png'
import { Typography, IconButton, useMediaQuery, useTheme } from '@material-ui/core'
import InstagramIcon from '@material-ui/icons/Instagram';
export default function BrandBottom() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    return (
        <div style={{ backgroundColor: '#981717', display: 'flex', justifyContent: 'center', padding: 15,paddingTop:70,paddingBottom:70 }}>
            <img src={Logo2} style={{ width:matches?'100%':'50%',objectFit:'contain' }} />


        </div>
    )
}
