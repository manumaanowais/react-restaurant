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
import Box from '@mui/material/Box';
import './Report.css';
import OrderChart from './OrderChart';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //Fetch all mainmenues
    const [allMainMenues, setAllMainMenues] = useState([]);
    useEffect(() => {
        const apiUrl = 'http://localhost:8080/mainmenu';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setAllMainMenues(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [])

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
                    mainMenuItemId: itemDetail.menuItem.mainMenuItemId,
                    totalCount: menuItemCounts[itemId],
                };
            }
        });
    });

    // Convert uniqueItems object to an array for easy printing
    const itemsWithCounts = Object.values(uniqueItems);

    // Create a dictionary to store the total itemPrice for each mainmenuitemid
    const totalItemPriceByMainMenuItemId = {};

    // Iterate through itemsWithCounts to calculate the total itemPrice
    itemsWithCounts.forEach((item) => {
        const mainMenuItemId = item.mainMenuItemId;
        if (totalItemPriceByMainMenuItemId[mainMenuItemId]) {
            totalItemPriceByMainMenuItemId[mainMenuItemId] += item.itemPrice * item.totalCount;
        } else {
            totalItemPriceByMainMenuItemId[mainMenuItemId] = item.itemPrice * item.totalCount;
        }
    });

    // Add the total itemPrice as a new property in itemsWithCounts
    itemsWithCounts.forEach((item) => {
        const mainMenuItemId = item.mainMenuItemId;
        item.totalItemPrice = totalItemPriceByMainMenuItemId[mainMenuItemId];
    });

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

    const [totalSale, setTotalSale] = useState(0);
    useEffect(() => {
        const totalPrice = calculateTotalPrice(itemsWithCounts);
        setTotalSale(totalPrice);
    }, [itemsWithCounts])
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

    const [takeAwayCount, setTakeAwayCount] = useState(0);
    const [dineInCount, setDineInCount] = useState(0);
    const [takeAwayTotalPrice, setTakeAwayTotalPrice] = useState(0);
    const [dineInTotalPrice, setDineInTotalPrice] = useState(0);

    useEffect(() => {
        const takeAwayItems = report.filter((item) => item.takeAway === true);
        const dineInItems = report.filter((item) => item.takeAway === false);

        const takeAwayTrueCount = takeAwayItems.length;
        setTakeAwayCount(takeAwayTrueCount);
        const takeAwayFalseCount = dineInItems.length;
        setDineInCount(takeAwayFalseCount);

        const takeAwayTrueTotalPrice = takeAwayItems.reduce((total, item) => {
            return total + item.price;
        }, 0);
        setTakeAwayTotalPrice(takeAwayTrueTotalPrice);

        const takeAwayFalseTotalPrice = dineInItems.reduce((total, item) => {
            return total + item.price;
        }, 0);
        setDineInTotalPrice(takeAwayFalseTotalPrice);
    }, [report, takeAwayCount, dineInCount]);


    const getItemNameWithMainMenuId = (id) => {
        const menu = allMainMenues.find(item => item.id === id);
        return menu ? menu.itemName : ''; // Return the item name if found, or an empty string if not found
    }


    //Organizing for quantity report
    const organizedData = {};

    itemsWithCounts.forEach(item => {
        const { mainMenuItemId, itemId, itemName, itemPrice, totalCount, totalItemPrice } = item;

        // Create a sub-object for the mainMenuItemId if it doesn't exist
        if (!organizedData[mainMenuItemId]) {
            organizedData[mainMenuItemId] = {
                mainMenuItemId,
                items: []
            };
        }

        // Add the item data to the sub-object
        organizedData[mainMenuItemId].items.push({
            itemId,
            itemName,
            itemPrice,
            totalCount,
            totalItemPrice
        });
    });

// Convert the organized data object to an array of objects
    const resultArray = Object.values(organizedData);

    const [reportData, setReportData] = useState();
    const printReport = (reportType) => {
        console.log("Report type : ", reportType)
        if (reportType === 'bills') {
            setReportData('');
            setReportData(report);
            console.log("Bills Report : ", reportData)
            setIsBillReportOpen(true);
            window.addEventListener('afterprint', () => {
                setIsBillReportOpen(false); // Close the dialog after printing
              });
            setTimeout(() => {
                window.print();
            }, 800)
        } else if (reportType === 'quantity') {
            setReportData('');
            setReportData(resultArray);
            console.log("Quantity Report : ", reportData)
            setIsQuantityReportOpen(true);
            window.addEventListener('afterprint', () => {
                setIsQuantityReportOpen(false); // Close the dialog after printing
            });
            setTimeout(() => {
                window.print();
            }, 800)
        } else {
            setIsTypeReportOpen(true);
            window.addEventListener('afterprint', () => {
                setIsTypeReportOpen(false); // Close the dialog after printing
              });
            setTimeout(() => {
                window.print();
            }, 800)
        }
    }


    //Dialog for bills report
    const [isBillReportOpen, setIsBillReportOpen] = useState(false);

    const closeBillReport = () => {
        setIsBillReportOpen(false)
    }

    // const handleBillReportSubmit = (e) => {
    //     console.log("Bill Report : ", reportData)
    //     closeBillReport();
    //     Swal.fire({
    //         icon: 'success',
    //         title: `Bill Report Printed Successfully`,
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 1500,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //             toast.addEventListener('mouseenter', Swal.stopTimer);
    //             toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //     });
    // }

    //Dialog for quantity report
    const [isQuantityReportOpen, setIsQuantityReportOpen] = useState(false);

    const closeQuantityReport = () => {
        setIsQuantityReportOpen(false)
    }

    // const handleQuantityReportSubmit = (e) => {
    //     console.log("Quantity Report : ", reportData)
    //     closeQuantityReport();
    //     Swal.fire({
    //         icon: 'success',
    //         title: `Quantity Report Printed Successfully`,
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 1500,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //             toast.addEventListener('mouseenter', Swal.stopTimer);
    //             toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //     });
    // }

    //Dialog for type report
    const [isTypeReportOpen, setIsTypeReportOpen] = useState(false);

    const closeTypeReport = () => {
        setIsTypeReportOpen(false)
    }

    // const handleTypeReportSubmit = (e) => {
    //     console.log("Type Report : ", reportData)
    //     closeTypeReport();
    //     Swal.fire({
    //         icon: 'success',
    //         title: `Type Report Printed Successfully`,
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 1500,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //             toast.addEventListener('mouseenter', Swal.stopTimer);
    //             toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //     });
    // }

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
                        <option value="quantity">GROUP</option>
                        <option value="type">TYPE</option>
                    </select>
                </div>
                <div className='report-buttons'>
                    <button className='btn btn-info' onClick={() => printReport(selectedReportType)}>PRINT</button>
                    <button className='btn btn-success' onClick={() => getTotalSale()}>TOTAL SALE</button>
                </div>
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
                                <StyledTableCell align="center">GROUP</StyledTableCell>
                                <StyledTableCell align="center">MENU ITEM</StyledTableCell>
                                <StyledTableCell align="center">PRICE</StyledTableCell>
                                <StyledTableCell align="center">QUANTITY</StyledTableCell>
                                <StyledTableCell align="center">TOTAL ITEM PRICE</StyledTableCell>
                                <StyledTableCell align="center">TOTAL PRICE</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? itemsWithCounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : itemsWithCounts
                            ).map((item) => (
                                <StyledTableRow key={item.itemId}>
                                    <StyledTableCell align="center">{getItemNameWithMainMenuId(item.mainMenuItemId)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.itemName}</StyledTableCell>
                                    <StyledTableCell align="center">{item.itemPrice}</StyledTableCell>
                                    <StyledTableCell align="center">{item.totalCount}</StyledTableCell>
                                    <StyledTableCell align="center">{(item.totalCount) * (item.itemPrice)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.totalItemPrice}</StyledTableCell>
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
                ) : (selectedReportType === 'type' ? (
                    <>
                        <OrderChart takeAwayCount={takeAwayCount} dineInCount={dineInCount} takeAwayTotalPrice={takeAwayTotalPrice} dineInTotalPrice={dineInTotalPrice} />

                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">TYPE</StyledTableCell>
                                    <StyledTableCell align="center">ORDERS</StyledTableCell>
                                    <StyledTableCell align="center">SALE</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">
                                            <img src="https://cdn-icons-png.flaticon.com/128/1585/1585302.png?ga=GA1.1.1226481460.1697015811" alt="TakeAway" className='report-img' />
                                            TAKE AWAY
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{takeAwayCount}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" name="bi bi-currency-rupee" viewBox="0 0 16 16">
                                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                                            </svg>{takeAwayTotalPrice}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">
                                            <img src="https://cdn-icons-png.flaticon.com/128/2555/2555794.png" alt="DineIn" className='report-img' />
                                            DINE IN
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{dineInCount}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" name="bi bi-currency-rupee" viewBox="0 0 16 16">
                                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                                            </svg>{dineInTotalPrice}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </>
                            </TableBody>
                        </Table>
                    </>
                ) : ('')
                ))}
            </TableContainer>

            {/* For showing bill report */}
            <Dialog
                fullScreen={fullScreen}
                open={isBillReportOpen}
                onClose={closeBillReport}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR MULTICUSINE RESTAURANT BILL REPORT"}
                </DialogTitle>
                <DialogContent>
                    <span className='dashedLines'>Shamirpet Road</span><br />
                    <span className='dashedLines'>Dongala Mysama, Tumkunta</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <span className='bill-date'>DATE : {currentDate}</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <span className='bill-number'>TOTAL BILLS CREATED : {reportData?.length}</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <div className='takeawayRecieptDiv'>
                        <table className='takeawayRecieptTable'>
                            <thead className='takeawayRecieptTable-thead'>
                                <tr>
                                    <th className='takeawayRecieptTable-th1'>BillId</th>
                                    <th className='takeawayRecieptTable-th2'>Items</th>
                                    <th className='takeawayRecieptTable-th2'>Qty</th>
                                    <th className='takeawayRecieptTable-th3'>Price</th>
                                    <th className='takeawayRecieptTable-th4'>Type</th>
                                    <th className='takeawayRecieptTable-th4'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData &&
                                    reportData.map((report) => (
                                        report?.items &&
                                        report?.items?.map((item) => (
                                            <tr className='takeawayRecieptTable-tr' key={item?.id}>
                                                <td className='takeawayRecieptTable-td2'>{report?.id}</td>
                                                <td className='takeawayRecieptTable-td1'>{item?.menuItem?.itemName}</td>
                                                <td className='takeawayRecieptTable-td2'>{item?.qty}</td>
                                                <td className='takeawayRecieptTable-td4' style={{ textAlign: 'center' }}>{item?.qty * item?.menuItem?.itemPrice}</td>
                                                <td className='takeawayRecieptTable-td4'>{report?.takeAway ? 'TA' : 'DI'}</td>
                                                <td className='takeawayRecieptTable-td4'>{report?.price}</td>
                                            </tr>
                                        ))
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <b className='bill-nettotal'>Total Sale Is RS.{totalSale.toFixed(2)}</b><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                </DialogContent>
                {/* <DialogActions>
                    <Button className="formBtn" onClick={handleBillReportSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeBillReport}>
                        Cancel
                    </Button>
                </DialogActions> */}
            </Dialog>

            {/* For showing quantity report */}
            <Dialog
                fullScreen={fullScreen}
                open={isQuantityReportOpen}
                onClose={closeQuantityReport}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR MULTICUSINE RESTAURANT GROUP REPORT"}
                </DialogTitle>
                <DialogContent>
                    <span className='dashedLines'>Shamirpet Road</span><br />
                    <span className='dashedLines'>Dongala Mysama, Tumkunta</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <span className='bill-date'>DATE : {currentDate}</span><br />
                    <div className='takeawayRecieptDiv'>
                        {reportData?.map((group, index) => (
                            <div key={index}>
                                <span className='dashedLines'>----------------------------------------------------------</span><br />
                                <h6 style={{fontWeight: '700',color:'black'}}>GROUP: {getItemNameWithMainMenuId(group?.mainMenuItemId)}</h6>
                                <table className='takeawayRecieptTable'>
                                    <thead className='takeawayRecieptTable-thead'>
                                        <tr>
                                            <th className='takeawayRecieptTable-th1'>Item</th>
                                            <th className='takeawayRecieptTable-th2'>Price</th>
                                            <th className='takeawayRecieptTable-th3'>Count</th>
                                            <th className='takeawayRecieptTable-th4'>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.items.map((item, itemIndex) => (
                                            <tr className='takeawayRecieptTable-tr' key={itemIndex}>
                                                <td className='takeawayRecieptTable-td1'>{item?.itemName}</td>
                                                <td className='takeawayRecieptTable-td2'>{item?.itemPrice}</td>
                                                <td className='takeawayRecieptTable-td3'>{item?.totalCount}</td>
                                                <td className='takeawayRecieptTable-td4'>{isNaN((item?.itemPrice) * (item?.totalCount)) ? 0 : (item?.itemPrice) * (item?.totalCount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='bill-subtotal' style={{textAlign:'left', borderTop: '2px dashed black'}}>TOTAL {getItemNameWithMainMenuId(group?.mainMenuItemId)} SALE : {group.items[0].totalItemPrice}</div>
                            </div>
                        ))}
                    </div>
                    <br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <b className='bill-nettotal'>Total Sale Is RS.{totalSale.toFixed(2)}</b><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                </DialogContent>
                {/* <DialogActions>
                    <Button className="formBtn" onClick={handleQuantityReportSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeQuantityReport}>
                        Cancel
                    </Button>
                </DialogActions> */}
            </Dialog>

            {/* For showing type report */}
            <Dialog
                fullScreen={fullScreen}
                open={isTypeReportOpen}
                onClose={closeTypeReport}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR MULTICUSINE RESTAURANT TYPE REPORT"}
                </DialogTitle>
                <DialogContent>
                    <span className='dashedLines'>Shamirpet Road</span><br />
                    <span className='dashedLines'>Dongala Mysama, Tumkunta</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <span className='bill-date'>DATE : {currentDate}</span><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <div className='takeawayRecieptDiv'>
                        <table className='takeawayRecieptTable'>
                            <thead className='takeawayRecieptTable-thead'>
                                <tr>
                                    <th className='takeawayRecieptTable-th1'>TYPE</th>
                                    <th className='takeawayRecieptTable-th2'>ORDERS</th>
                                    <th className='takeawayRecieptTable-th3'>SALE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='takeawayRecieptTable-tr'>
                                    <td className='takeawayRecieptTable-td1'>TAKEAWAY</td>
                                    <td className='takeawayRecieptTable-td2'>{takeAwayCount}</td>
                                    <td className='takeawayRecieptTable-td2'>{takeAwayTotalPrice}</td>
                                </tr>
                                <tr className='takeawayRecieptTable-tr'>
                                    <td className='takeawayRecieptTable-td1'>DINEIN</td>
                                    <td className='takeawayRecieptTable-td2'>{dineInCount}</td>
                                    <td className='takeawayRecieptTable-td2'>{dineInTotalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                    <b className='bill-nettotal'>Total Sale Is RS.{totalSale.toFixed(2)}</b><br />
                    <span className='dashedLines'>----------------------------------------------------------</span><br />
                </DialogContent>
                {/* <DialogActions>
                    <Button className="formBtn" onClick={handleTypeReportSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeTypeReport}>
                        Cancel
                    </Button>
                </DialogActions> */}
            </Dialog>
        </div>
    );
}

export default Report;
