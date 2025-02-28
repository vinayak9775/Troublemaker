import React, { useEffect, useState } from "react";
import HRNavbar from "../../HR/HRNavbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { TextField, Button, TablePagination } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { TableCell } from "@mui/material";
import Footer from "../../../Footer";

const MonthlyCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  marginRight: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "43px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    cursor: "pointer",
  },
  fontWeight: "200",
});

const MonthlyReport = () => {
  const [hospitalType, setHospitalType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hospDataTable, setHospDataTable] = useState([]);
  const accessToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hospitalData, setHospitalData] = useState([]);

  const port = process.env.REACT_APP_API_KEY;

  const handleViewReport = async () => {
    setLoading(true); // Start loading
    try {
      let url = `${port}/hhc_repo/eve_report/?`;

      if (startDate) {
        url += `st_date=${startDate}&`;
      }
      if (endDate) {
        url += `ed_date=${endDate}&`;
      }
      if (hospitalType) {
        url += `select_report_type=${hospitalType}&`;
      }

      const res = await fetch(url.slice(0, -1), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      const data = await res.json();
      setHospDataTable(data.Record);
      setLoading(false);
      setLoading(false);
      console.log("Data from Enquiry", data);
    } catch (error) {
      console.error("Error fetching Enquiries Data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const ConsultantReport = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res);
        const data = await res.json();
        setHospitalData(data);
        console.log("Data from hospitalData", data);
      } catch (error) {
        console.error("Error fetching hospitalData Data:", error);
      }
    };
    ConsultantReport();
  }, []);

  const handleDownloadExcel = async () => {
    try {
      let url = `${port}/hhc_repo/eve_report/?`;

      if (startDate) {
        url += `st_date=${startDate}&`;
      }
      if (endDate) {
        url += `ed_date=${endDate}&`;
      }
      if (hospitalType) {
        url += `select_report_type=${hospitalType}&`;
      }

      const res = await fetch(url.slice(0, -1), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const renamedData = data.Record.map((item) => ({
        "Service Name": item.Service_Type,
        "Recommended Service": item.Sub_Service_Type,
        "Professional Name": item.Consultant_name,
        "Patient Name": item.Patient_Name,
        "Service Date": item.start_date.split(" ")[0],
        "Service Date To": item.end_date.split(" ")[0],
        "Actual Service Date":
          item["Service_Created_Date_&_Time"].split(" ")[0],
      }));

      const worksheet = XLSX.utils.json_to_sheet(renamedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "monthly_report.xlsx");
    } catch (error) {
      console.error("Error fetching Enquiries Data:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /////// date changes validation
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    // setStartDate(e.target.value);
    setEndDate(""); // Reset end date whenever start date changes
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  return (
    <div style={{ marginBottom: "2em" }}>
      <HRNavbar />
      <Box
        sx={{
          //   flexGrow: 1,
          //   mt: { xs: 2, sm: 4, md: 10.6 },
          ml: { xs: 1, sm: 2 },
          mr: { xs: 1, sm: 2 },
          //   mb: { xs: 2, sm: 4 },
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            style={{ overflowX: "auto" }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                marginTop: "20px",
                marginLeft: "10px",
              }}
              color="text.secondary"
              gutterBottom
            >
              Monthly Report
            </Typography>

            <Box sx={{ mb: 1, width: 300, marginLeft: "1rem" }}>
              <TextField
                select
                label="Select Hospital Name"
                variant="outlined"
                size="small"
                sx={{
                  height: 39,
                  width: "100%",
                  backgroundColor: "white",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "7px",
                }}
                InputProps={{ style: { border: "none" } }}
                inputProps={{ "aria-label": "Select Group" }}
                value={hospitalType}
                onChange={(e) => setHospitalType(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "2 00px", // Set the maximum height to 200px
                        maxWidth: "200px",
                      },
                    },
                    MenuListProps: {
                      style: {
                        maxHeight: "200px", // Set the maximum height to 200px
                      },
                    },
                  },
                }}
              >
                {hospitalData.map((item, index) => (
                  <MenuItem key={item.hosp_id} value={item.hosp_id}>
                    {item.hospital_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box
              component="form"
              sx={{
                marginLeft: "2rem",
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: "2.5rem",
                backgroundColor: "#ffffff",
                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                borderRadius: "10px",
                border: "1px solid #C9C9C9",
              }}
            >
              <InputBase
                 required
                 type="date"
                 value={startDate}
                 onChange={handleStartDateChange}
                 min={today} // Ensure start date cannot be before today
                 placeholder="Start Date | MM/DD/YY"
                 sx={{ ml: 1, mr: 1, flex: 1 }}
                 size="small"
                 inputProps={{
                   "aria-label": "select date",
                   // max: today, // Maximum selectable date is today
                 }}
              />
            </Box>

            <Box
              component="form"
              sx={{
                marginLeft: "2rem",
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: "2.5rem",
                backgroundColor: "#ffffff",
                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                borderRadius: "10px",
                border: "1px solid #C9C9C9",
              }}
            >
              <InputBase
                 required
                 type="date"
                 placeholder="End Date | MM/DD/YY"
                 value={endDate}
                 onChange={handleEndDateChange}
                 sx={{ ml: 1, mr: 1, flex: 1 }}
                 size="small"
                 inputProps={{
                   "aria-label": "select date",
                   min: startDate || undefined, // Minimum date is the selected start date
                   // max: today, // Set the maximum selectable date to today
                 }}
                 min={startDate || today} // Ensure end date cannot be before the selected start date

              />
            </Box>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#69A5EB",
                color: "white",
                textTransform: "capitalize",
              }}
              onClick={handleViewReport}
            >
              View Report
            </Button>

            <FileDownloadOutlinedIcon
              onClick={() => {
                handleDownloadExcel();
              }}
            />
          </Stack>
        </Box>
        <TableContainer sx={{ ml: 1, mr: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <MonthlyCard
                  style={{
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                    height: "3rem",
                  }}
                >
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Service Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">
                      Recommended Service
                    </Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">
                      Professional Name
                    </Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Service Date</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Service Date To</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">
                      Actual Service Date
                    </Typography>
                  </CardContent>
                </MonthlyCard>
              </TableRow>
            </TableHead>

            <TableBody style={{ height: "49vh" }}>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    style={{ height: "45vh" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : hospDataTable.length === 0 ? (
                <TableRow>
                  <CardContent colSpan={7} align="center">
                    No data found
                  </CardContent>
                </TableRow>
              ) : (
                hospDataTable
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((hosp, index) => (
                    <TableRow key={index}>
                      <MonthlyCard
                        style={{
                          height: "4rem",
                          background: "white",
                          color: "rgba(0, 0, 0, 0.87)",
                          fontWeight: "100",
                          borderRadius: "8px 10px 8px 8px",
                        }}
                      >
                        <CardContent
                          style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {page * rowsPerPage + index + 1}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.Service_Type || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.Sub_Service_Type || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.Consultant_name || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.Patient_Name || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.start_date.split(" ")[0] || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp.end_date.split(" ")[0] || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            {hosp["Service_Created_Date_&_Time"].split(
                              " "
                            )[0] || "-"}
                          </Typography>
                        </CardContent>
                      </MonthlyCard>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 30, 50]}
          component="div"
          count={hospDataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Footer />
    </div>
  );
};

export default MonthlyReport;
