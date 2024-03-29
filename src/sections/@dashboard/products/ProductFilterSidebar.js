import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  TextField,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'oldest', label: 'Oldest' },
  { value: 'newest', label: 'Newest' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = [
  'Application Installation',
  'Network',
  'Inventory',
  'Reformat',
  'Repair',
  'Others',
];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

// ----------------------------------------------------------------------
export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter }) {
  


  
    const [open, setOpen] = useState(null);
  
    const handleOpen = (event) => {
      setOpen(event.currentTarget);
    };
  
    const handleClose = () => {
      setOpen(null);
    };
  

    
  return (
    <>
      
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button>
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
        <Divider/>
        <Scrollbar>
          <Typography variant="subtitle1" sx={{ ml: 3, mt: 3, }}>
            Sort By:
              <Button
                variant="subtitle1" sx={{ ml: 1}}
                alignItems="left"
                display="flex"
                color="inherit"
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Newest
              </Typography>
            </Button>
          </Typography>
        <Menu
          keepMounted
          anchorEl={open}
          open={Boolean(open)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'newest'}
            onClick={handleClose}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
        </Menu>
      
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date From:
            </Typography>
            <TextField
              id="dateFrom"
              size="small"
              type="date"
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date To:
            </Typography>
            <TextField
              id="dateTo"
              size="small"
              type="date"
            />

            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Location/Room:
            </Typography>
            <TextField
              id="location"
              size="small"
              type="text"
            />
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Service
              </Typography>
              <RadioGroup>
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                ))}
              </RadioGroup>
            </div>
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
