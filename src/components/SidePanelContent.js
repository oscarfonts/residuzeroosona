import React from 'react';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Logo_geomatico from '../img/Logo_geomatico.png';

const SidePanelContent = () => {
  return <Stack sx={{height: '100%'}}>

    <Link style={{flexGrow: 2, position: 'relative', minHeight: 25}} href='https://geomatico.es' target='_blank'>
      <img src={Logo_geomatico} width={80} alt='geomatico.es' style={{position: 'absolute', bottom: 0, right: 0}}/>
    </Link>
  </Stack>;
};


export default SidePanelContent;

