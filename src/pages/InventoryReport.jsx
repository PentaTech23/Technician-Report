import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import SvgColor from '../components/svg-color';
import PrintInventoryReport from './PrintInventoryReport';

export default function InventoryReport() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current;
    },
  });

  return (
    <>
      <Helmet>
        <title>Technician Inventory Report</title>
      </Helmet>
      <Container sx={{ paddingLeft: { xs: '20px', lg: '240px' }, justifyContent: 'center' }}>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          sx={{ mb: 3 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h2" style={{ color: '#ff5500' }}>
            Technician Inventory Report
          </Typography>
          <button
            type="button"
            className="flex"
            style={{
              height: 'auto', // Allow height to adjust based on content
              flexDirection: 'column', // Set flex direction to column
              alignItems: 'center', // Center content along the cross-axis
              border: '1px solid #ff5500', // Set border color to orange
              color: '#ff5500', // Set text color to orange
              padding: '10px',
              paddingRight: '20px',
              borderRadius: '10px',
            }}
            onClick={handlePrint}
          >
            <SvgColor src={`/assets/icons/navbar/printer.svg`} sx={{ width: '30px', height: '18px' }} />
            <span style={{ fontSize: '1.2em' }}>Print</span>
          </button>
        </Grid>
        <PrintInventoryReport ref={componentRef} />
      </Container>
    </>
  );
}
