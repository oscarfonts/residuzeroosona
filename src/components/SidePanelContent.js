import React from 'react';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';

import SectionTitle from './SectionTitle';
import Logo_geomatico from '../img/Logo_geomatico.png';
import {MAPSTYLES} from '../config';

const SidePanelContent = ({mapStyle, onMapStyleChanged}) => {
  return <Stack sx={{height: '100%'}}>
    <SectionTitle titleKey='baseMapStyle'/>
    <BaseMapList
      styles={MAPSTYLES}
      selectedStyleUrl={mapStyle}
      onStyleChange={onMapStyleChanged}
      typographyStyleProps={{fontSize: 14}}
    />
    <Link style={{flexGrow: 2, position: 'relative', minHeight: 25}} href='https://geomatico.es' target='_blank'>
      <img src={Logo_geomatico} width={80} alt='geomatico.es' style={{position: 'absolute', bottom: 0, right: 0}}/>
    </Link>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired
};

export default SidePanelContent;

