import React from 'react';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Logo_geomatico from '../img/Logo_geomatico.png';
import SwitchPad from '@geomatico/geocomponents/SwitchPad';
import SearchBox from '@geomatico/geocomponents/SearchBox';

import SectionTitle from './SectionTitle';

const SidePanelContent = ({categories, selectedCategories, onChangeSelectedCategories, searchText, setSearchText}) => {
  return <Stack sx={{height: '100%'}}>

    <SectionTitle titleKey='Cerca'/>
    <SearchBox text={searchText} onTextChange={setSearchText} dense={true} onSearchClick={setSearchText} placeholder='Cerca...'/>

    <SectionTitle titleKey='Selecciona categoria'/>
    <SwitchPad categories={categories} selected={selectedCategories} onSelectionChange={onChangeSelectedCategories}/>

    <Link style={{flexGrow: 2, position: 'relative', minHeight: 25}} href='https://geomatico.es' target='_blank'>
      <img src={Logo_geomatico} width={80} alt='geomatico.es' style={{position: 'absolute', bottom: 0, right: 0}}/>
    </Link>
  </Stack>;
};

SidePanelContent.propTypes = {
  categories: PropTypes.array,
  selectedCategories: PropTypes.array.isRequired,
  onChangeSelectedCategories: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  setSearchText: PropTypes.func.isRequired,
};


export default SidePanelContent;

