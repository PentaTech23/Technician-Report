import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// This is the navConfig for Technician and Dean primarily! :/ 
const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  //                  FORMS
  {
    title: 'Forms',
    path: '/dashboard/form',
    icon: icon('forms'),
    children: [
      {
        title: "Borrower's Form",
        path: '/dashboard/borrowers_item',
      },
      {
        title: 'Request Item Form',
        path: '/dashboard/request_item',
      },
      {
        title: 'Service Request Form',
        path: '/dashboard/service_request',
      },
      {
        title: 'Inspection Report Form',
        path: '/dashboard/inspection_report',
      },
    ],
  },
  //             PROFILING
  {
    title: 'Profiling',
    path: '/dashboard/profiling',
    icon: icon('profiling'),
    children: [
      {
        title: 'Memorandum of Receipts',
        path: '/dashboard/profiling_mr', // Replace with the actual path
      },
      {
        title: 'Property Transfer Report',
        path: '/dashboard/reports_ptr',
      },
      {
        title: 'Condemned Items',
        path: '/dashboard/profiling_ci', // Replace with the actual path
      },
      
    ],
  },
  //               REPORTS
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: icon('report'),
    children: [
      

      {
        title: 'Monthly Assessment Report & Inventory Laboratory Form',
        path: '/dashboard/reports_marilf',
      },
     
    ],
  },

  {
    title: 'Archives',
    path: '/dashboard/archives',
    icon: icon('archives'),
  },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

// This is the navConfig for Dean! :/ 

const navConfigDean = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  //                  FORMS
  {
    title: 'Forms',
    path: '/dashboard/form',
    icon: icon('forms'),
    children: [
      {
        title: "Borrower's Form",
        path: '/dashboard/borrowers_item',
      },
      {
        title: 'Request Item Form',
        path: '/dashboard/request_item',
      },
      {
        title: 'Service Request Form',
        path: '/dashboard/service_request',
      },
      {
        title: 'Inspection Report Form',
        path: '/dashboard/inspection_report',
      },
     
    ],
  },
  //             PROFILING
  {
    title: 'Profiling',
    path: '/dashboard/profiling',
    icon: icon('profiling'),
    children: [
      {
        title: 'Memorandum of Receipts',
        path: '/dashboard/profiling_mr', // Replace with the actual path
      },
      {
        title: 'Property Transfer Report',
        path: '/dashboard/reports_ptr',
      },
      {
        title: 'Condemned Items',
        path: '/dashboard/profiling_ci', // Replace with the actual path
      },
      {
        title: 'Profiling Report',
        path: '/dashboard/ProfilingReport', // Replace with the actual path
      },
      
    ],
  },
  //               REPORTS
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: icon('report'),
    children: [
      
      {
        title: 'Monthly Assessment Report & Inventory Laboratory Form',
        path: '/dashboard/reports_marilf',
      },
      
      { 
        title: 'Inspection Report',
        path: '/dashboard/dashb_InspectionReport'
      },

      {
        title: 'Request Report',
        path: '/dashboard/dashb_request_report',
      },

      {
        title: 'Inventory Report',
        path: '/dashboard/dashb_inventory_report', 
        },

      {
        title: 'Profiling Report',
        path: '/dashboard/dashb_profiling_report', 
      },

    ],
  },

  {
    title: 'Archives',
    path: '/dashboard/archives',
    icon: icon('archives'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('userxd'),
  },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

// This is the navConfig for Faculty by Dashboard! :/ 

const navConfigFaculty = [
  //                  FORMS
  {
    title: 'Forms',
    path: '/dashboard/form',
    icon: icon('forms'),
    children: [
      {
        title: "Borrower's Form",
        path: '/dashboard/borrowers_item',
      },
      {
        title: 'Request Item Form',
        path: '/dashboard/request_item',
      },
      {
        title: 'Service Request Form',
        path: '/dashboard/service_request',
      },
      {
        title: 'Inspection Report Form',
        path: '/dashboard/inspection_report',
      },
    ],
  },
  //             PROFILING
  {
    title: 'Profiling',
    path: '/dashboard/profiling',
    icon: icon('profiling'),
    children: [
      {
        title: 'Memorandum of Receipts',
        path: '/dashboard/profiling_mr', // Replace with the actual path
      },
      {
        title: 'Property Transfer Report',
        path: '/dashboard/reports_ptr',
      },
      {
        title: 'Condemned Items',
        path: '/dashboard/profiling_ci', // Replace with the actual path
      },
    ],
  },

  {
    title: 'Archives',
    path: '/dashboard/archives',
    icon: icon('archives'),
  },
 
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export { navConfig, navConfigFaculty, navConfigDean };
