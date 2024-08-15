import { Chip, Divider, Grid } from '@mui/material'
import React from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Tag = ({label="", icon}) => {
  return (
    <Grid item xs={12} sx={{mt: 2}}>
        <Divider textAlign="left">
            <Chip 
                icon={icon}
                label={label} 
                variant="filled" 
                color="primary"
                size="medium" />
        </Divider>
    </Grid>
  )
}

export default Tag