import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';

import Logo from './icons/Logo';

import {DRAWER_WIDTH} from '../config';
import {useTheme} from '@mui/styles';

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widescreen'
})(({theme, widescreen}) => {
  return {
    flexGrow: 1,
    padding: 0,
    position: 'absolute',
    top: widescreen ? theme.mixins.toolbar.minHeight + 8 : theme.mixins.toolbar.minHeight,
    bottom: 0,
    right: 0,
    left: widescreen ? DRAWER_WIDTH : 0
  };
});

const Layout = ({mainContent, sidePanelContent}) => {
  const theme = useTheme();
  const widescreen = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const handleClose = () => setIsSidePanelOpen(!isSidePanelOpen);
  return (
    <>
      <ResponsiveHeader
        title='Pasión por la información geográfica'
        logo={<Logo/>}
        onStartIconClick={widescreen ? undefined : handleClose}
        isStartIconCloseable={isSidePanelOpen}
        sx={{
          '&.MuiAppBar-root': {
            zIndex: 1500
          }
        }}
      >
      </ResponsiveHeader>
      <SidePanel
        drawerWidth={DRAWER_WIDTH}
        anchor='left'
        isOpen={isSidePanelOpen}
        onClose={handleClose}
        widescreen={widescreen}
      >
        {sidePanelContent}
      </SidePanel>
      <Main widescreen={widescreen}>
        {mainContent}
      </Main>
    </>
  );
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired
};

export default Layout;
