import React, { useState, useEffect } from 'react';
import Header from './Header';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import './Report.css';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


// Get report for all bills of the current date
function Report() {
    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const currentDate = getCurrentDate();

    const [report, setReport] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState('bills'); // Default to 'bills'

    useEffect(() => {
        fetch(`http://localhost:8080/bills/${currentDate}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setReport(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [currentDate]);

    // Get count of all items present in the bill
    const menuItemCounts = {};

    // Iterate through the data and count menu items with the same id
    report.forEach((item) => {
        item.items.forEach((itemDetail) => {
            const itemId = itemDetail.menuItem.id;
            if (menuItemCounts[itemId]) {
                menuItemCounts[itemId] += itemDetail.qty; // Add quantity to the count
            } else {
                menuItemCounts[itemId] = itemDetail.qty; // Initialize count with quantity
            }
        });
    });

    // Create an object to store the desired properties for each unique menu item
    const uniqueItems = {};

    // Iterate through the data and store the unique menu items with combined totalCount
    report.forEach((item) => {
        item.items.forEach((itemDetail) => {
            const itemId = itemDetail.menuItem.id;
            if (!uniqueItems[itemId]) {
                uniqueItems[itemId] = {
                    itemId: itemId,
                    itemName: itemDetail.menuItem.itemName,
                    itemPrice: itemDetail.menuItem.itemPrice,
                    totalCount: menuItemCounts[itemId],
                };
            }
        });
    });

    // Convert uniqueItems object to an array for easy printing
    const itemsWithCounts = Object.values(uniqueItems);

    // For table
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - report.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //Get total sale value
    const calculateTotalPrice = (itemsWithCounts) => {
        let totalPrice = 0;
        itemsWithCounts.forEach((item) => {
            totalPrice += item.itemPrice * item.totalCount;
        });
        return totalPrice;
    }

    const getTotalSale = () => {
        const totalPrice = calculateTotalPrice(itemsWithCounts);
        console.log(`Total Price : ${totalPrice}`);
        Swal.fire({
            icon: 'success',
            title: `TOTAL SALE IS RS.${totalPrice.toFixed(2)}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });
    }

    useEffect(() => {
        console.log("Report : ", report)
    })

    return (
        <div className="report">
            <Header />
            <div className='report-actions'>
                <div className="report-type-dropdown">
                    <label className='report-label'>GET REPORT BY : </label>
                    <select
                        className="form-select form-select-sm"
                        value={selectedReportType}
                        onChange={(e) => setSelectedReportType(e.target.value)}
                    >
                        <option value="bills">BILLS</option>
                        <option value="quantity">QUANTITY</option>
                        <option value="type">TYPE</option>
                    </select>
                </div>
                <button className='btn btn-success' onClick={() => getTotalSale()}>TOTAL SALE</button>
            </div>
            <TableContainer component={Paper}>
                {/* Render the table based on the selected report type */}
                {selectedReportType === 'bills' ? (
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">BILL ID</StyledTableCell>
                                <StyledTableCell align="center">CREATED TIME</StyledTableCell>
                                <StyledTableCell align="center">MENU ITEM</StyledTableCell>
                                <StyledTableCell align="center">PRICE</StyledTableCell>
                                <StyledTableCell align="center">QUANTITY</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? report.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : report
                            ).map((item) =>
                                item.items.map((itemData) => (
                                    <StyledTableRow key={itemData.id}>
                                        <StyledTableCell align="center">{item.id}</StyledTableCell>
                                        <StyledTableCell align="center">{item.createdTime.toUpperCase()}</StyledTableCell>
                                        <StyledTableCell align="center">{itemData.menuItem.itemName}</StyledTableCell>
                                        <StyledTableCell align="center">{itemData.menuItem.itemPrice}</StyledTableCell>
                                        <StyledTableCell align="center">{itemData.qty}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                            {emptyRows > 0 && (
                                <StyledTableRow style={{ height: 53 * emptyRows }}>
                                    <StyledTableCell colSpan={5} />
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={report.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (selectedReportType === 'quantity' ? (
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">MENU ITEM</StyledTableCell>
                                <StyledTableCell align="center">PRICE</StyledTableCell>
                                <StyledTableCell align="center">COUNT</StyledTableCell>
                                <StyledTableCell align="center">TOTAL PRICE</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? itemsWithCounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : itemsWithCounts
                            ).map((item) => (
                                <StyledTableRow key={item.itemId}>
                                    <StyledTableCell align="center">{item.itemId}</StyledTableCell>
                                    <StyledTableCell align="center">{item.itemName}</StyledTableCell>
                                    <StyledTableCell align="center">{item.itemPrice}</StyledTableCell>
                                    <StyledTableCell align="center">{item.totalCount}</StyledTableCell>
                                    <StyledTableCell align="center">{(item.totalCount) * (item.itemPrice)}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {emptyRows > 0 && (
                                <StyledTableRow style={{ height: 53 * emptyRows }}>
                                    <StyledTableCell colSpan={4} />
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={itemsWithCounts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">TYPE</StyledTableCell>
                                <StyledTableCell align="center">SALE</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <>
                                <StyledTableRow>
                                    <StyledTableCell align="center">TAKE AWAY</StyledTableCell>
                                    <StyledTableCell align="center">4000</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell align="center">Dine In</StyledTableCell>
                                    <StyledTableCell align="center">4000</StyledTableCell>
                                </StyledTableRow>
                            </>
                        </TableBody>
                    </Table>
                ))}
            </TableContainer>
        </div>
    );
}

export default Report;
