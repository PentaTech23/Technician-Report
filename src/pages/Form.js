import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Dialog, Button, Stack, Typography, Box, Card, Link } from '@mui/material';
// components
import { ProductList } from '../sections/@dashboard/form';
// mock
import FORMS from '../_mock/forms';


import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <>
      <Helmet>
        <title>Forms</title>
      </Helmet>
     
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
      <Container>
        
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 0 }}>
        { <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> }
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* { <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> }
            { <ProductSort /> } */}
          </Stack>
        </Stack>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff7200' }} >
          Forms
        </Typography>





        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}>
        <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
          >
            Total SRF:
          </Typography>
        </Link>
 
      </Stack>
    </Card>

    
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                >
                  Total BIF:
                </Typography>
              </Link>
            
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"

                >
                  Total RIF:
                </Typography>
              </Link>
             
            </Stack>
          </Card>
    
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                >
                  Total IRF:
                </Typography>
              </Link>
            
            </Stack>
          </Card>
          </Stack>
            </Container>
            
            <Container> 
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}> 
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                >
                  Total Forms:
                </Typography>
              </Link>
            
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                >
                  Total Archived Forms:
                </Typography>
              </Link>
              
            </Stack>
          </Card>

        </Stack>
      </Container>
      </Container>
    </>
  );
}

