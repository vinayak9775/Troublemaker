import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Box from '@mui/material/Box';
import { TextField, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../Footer';

const EmployeeCard = styled(Card)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '10px',
  marginRight: '10px',
  backgroundColor: 'white',
  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
  height: "43px",
  borderRadius: '10px',
  transition: '0.5s ease-in-out',
  '&:hover': {
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
  fontWeight: "200",
});

const LoginEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${port}/hhc_hcm/forcefully_logout_api/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data from API:', data);
        setEmployees(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchEmployees();
  }, [accessToken, port]);

  const handleLogoutClick = async (employeeId) => {
    const confirmed = window.confirm(`Are you sure you want to log out the user?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${port}/hhc_hcm/forcefully_logout_api/?id=${employeeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`Logged out employee with ID: ${employeeId}`);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
      alert(`Logged out employee with ID: ${employeeId}`);
    } catch (error) {
      console.error('Error logging out employee:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
        <TableContainer sx={{ height: "67vh" }}>
          <Table>
            <TableHead>
              <TableRow>
                <EmployeeCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>Sr No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>User Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>Email ID</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>Phone Number</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>Gender</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant='subtitle2'>Logout Action</Typography>
                  </CardContent>
                </EmployeeCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : employees
              ).map((employee, index) => (
                <TableRow key={employee.id}>
                  <EmployeeCard style={{ height: '3.8rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>{index + 1 + page * rowsPerPage}</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>{employee.name}</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>{employee.clg_email}</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>{employee.clg_mobile_no}</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>{employee.clg_gender}</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                      <Typography variant='subtitle2'>
                        <HighlightOffIcon onClick={() => handleLogoutClick(employee.id)} style={{ color: 'red', cursor: 'pointer' }} />
                      </Typography>
                    </CardContent>
                  </EmployeeCard>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 30, 50]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Footer/>
    </div>
  )
}

export default LoginEmployees;
