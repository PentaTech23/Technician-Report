import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation,Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Typography } from '@mui/material';

export default function DashboardAppPage() {

  
  const navigate = useNavigate();

  useEffect(() => {
    const currentPageUrl = window.location.pathname;
    localStorage.setItem('currentPageUrl', currentPageUrl);
  }, []);

  useEffect(() => {
    const storedPageUrl = localStorage.getItem('currentPageUrl');
    if (!storedPageUrl) {
      navigate('/dashboard'); // Navigate to the default page if there's no stored URL
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>CICT Technician Report</title>
      </Helmet>
      <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          CICT Technician Report
        </Typography>

        <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
          <Grid container spacing={8} justifyContent="center">
            {/* Buttons as Links */}
            <Grid item xs={6} md={6} lg={6}>
              <Link to="/dashboard/dashb_request_report" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f97316',
                    '&:hover': {
                      backgroundColor: '#ea580c', // Set the background color on hover
                    },
                    width: '300px',
                    height: '100px',
                    fontSize: '20px',
                  }}
                >
                  Requests Report
                </Button>
              </Link>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <Link to="/dashboard/dashb_profiling_report" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f97316',
                    '&:hover': {
                      backgroundColor: '#ea580c', // Set the background color on hover
                    },
                    width: '300px',
                    height: '100px',
                    fontSize: '20px',
                  }}
                >
                  Profiling Report
                </Button>
              </Link>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <Link to="/dashboard/dashb_InspectionReport" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f97316',
                    '&:hover': {
                      backgroundColor: '#ea580c', // Set the background color on hover
                    },
                    width: '300px',
                    height: '100px',
                    fontSize: '20px',
                  }}
                >
                  Inspection Report
                </Button>
              </Link>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <Link to="/dashboard/dashb_inventory_report" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f97316',
                    '&:hover': {
                      backgroundColor: '#ea580c', // Set the background color on hover
                    },
                    width: '300px',
                    height: '100px',
                    fontSize: '20px',
                  }}
                >
                  Inventory Report
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </>
  );
}
