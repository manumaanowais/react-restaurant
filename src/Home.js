import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from './Header';
import { Link, useParams, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

Modal.setAppElement('#root');
function Home() {
    const { tableId } = useParams();
    const [allTables, setAllTables] = useState([]);
    useEffect(() => {
        // Fetch data from localhost:8080/tables
        fetch('http://localhost:8080/tables')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setAllTables(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const [tableData, setTableData] = useState(allTables);

    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/order') {
            handleClear();
            setTableData({})
        }
    }, [location.pathname]);

    useEffect(() => {
        if (tableId) {
            const apiUrl = `http://localhost:8080/tables/${tableId}`;

            fetch(apiUrl)
                .then((response) => response.json())
                .then((result) => {
                    setTableData(result);
                })
                .catch((error) => {
                    console.error('Error fetching menu items :', error);
                });
        }
    }, [tableId]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [section1Data, setSection1Data] = useState([]);

    const [data, setData] = useState([]);
    const { id } = useParams();

    const [allMenuItems, setAllMenuItems] = useState([]);

    //get all menuitems
    useEffect(() => {
        const apiUrl = 'http://localhost:8080/menuitems';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setAllMenuItems(result);
            })
            .catch((error) => {
                console.error('Error fetching menu items :', error);
            });
    },[])

    const fetchAllMenuItems = () => {
        const apiUrl = 'http://localhost:8080/menuitems';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setAllMenuItems(result);
            })
            .catch((error) => {
                console.error('Error fetching menu items :', error);
            });
    };

    useEffect(() => {
        const apiUrl = 'http://localhost:8080/mainmenu';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setSection1Data(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        if (id) {
            const additionalDataUrl = `http://localhost:8080/mainmenu/${id}`;

            fetch(additionalDataUrl)
                .then((response) => response.json())
                .then((result) => {
                    setData(result);
                })
                .catch((error) => {
                    console.error('Error fetching additional data:', error);
                });
        }
    }, [id]);

    //Delete mainmenu with id

    const handleDeleteMainMenu = (itemId) => {
        const itemToDelete = section1Data.filter((item) => item.id === itemId).map((name) => name.itemName.toUpperCase());

        // Show a confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${itemToDelete}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete It!',
        }).then((result) => {
            if (result.isConfirmed) {
                // User confirmed, proceed with deletion
                fetch(`http://localhost:8080/mainmenu/${itemId}`, {
                    method: 'DELETE',
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        // Remove the deleted item from your state
                        const updatedSection1Data = section1Data.filter((item) => item.id !== itemId);
                        setSection1Data(updatedSection1Data);
                        console.log('Menu item deleted successfully: ', itemToDelete);
                        Swal.fire({
                            icon: 'success',
                            title: `${itemToDelete} Removed Successfully`,
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
                    })
                    .catch((error) => {
                        console.error('Error deleting menu item:', error);
                        Swal.fire(
                            `${itemToDelete} can not be deleted!`,
                            `${itemToDelete} contains menu items or have items in an existing bill.`,
                            'error'
                        );
                    });
            }
        })
    };


    //Delete Menu item with id

    const handleDeleteMenuItem = (itemId) => {
        const itemToDelete = data.filter((item) => item.id === itemId).map((name) => name.itemName);

        // Show a confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${itemToDelete}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete It!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8080/menuitem/${itemId}`, {
                    method: 'DELETE',
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const updatedSection2Data = data.filter((item) => item.id !== itemId);
                        setData(updatedSection2Data);
                        console.log('Menu item deleted successfully : ', itemId);
                        Swal.fire({
                            icon: 'success',
                            title: `${itemToDelete} Removed Successfully`,
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
                    })
                    .catch((error) => {
                        console.error('Error deleting menu item:', error);
                        Swal.fire(
                            `${itemToDelete} was not deleted! try again`,
                            `${itemToDelete} may exist in an existing bill`,
                            'error'
                        );
                    })
                    .catch((error) => {
                        console.error('Error deleting menu item:', error);
                    });
            }
        })
    };


    const [selectedButtonSection1, setSelectedButtonSection1] = useState(null);
    const [selectedButtonSection2, setSelectedButtonSection2] = useState(null);

    // const selectedItem = gridItemsData.find(item => item.id === parseInt(id));
    const [selectedTableData, setSelectedTableData] = useState(null);

    useEffect(() => {
        const apiUrl = 'http://localhost:8080/tables';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setSelectedTableData(result);
            })
            .catch((error) => {
                console.error('Error fetching tabale data:', error);
            });
    }, []);

    const [timer, setTimer] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
            if (selectedTableData) {
                // selectedTableData.timer = timer;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, selectedTableData]);

    const [buttonCountMap, setButtonCountMap] = useState({});
    const [total, setTotal] = useState(0);
    const [selectedButtons, setSelectedButtons] = useState([]);

    useEffect(() => {
        // Calculate the total from billing data (tableData.bill.items) and update the 'total' state.
        let newTotal = 0;
        if (tableData?.bill?.items.length > 0) {
            newTotal = tableData.bill.items.reduce((acc, item) => {
                return acc + (item.qty * item.menuItem.itemPrice);
            }, 0);
        }
        setTotal(newTotal);
    }, [tableData]);


    const showSection2Content = (buttonId) => {
        data[buttonId]?.map((button) => ({
            itemName: button.itemName,
            itemPrice: button.itemPrice,
        }));
    };

    const addSection3Content = (buttonLabel, buttonPrice) => {
        if (tableData.bill?.items.length > 0) {
            if (tableData) {
                const existingItem = tableData.bill.items.find((item) => item.menuItem.itemName === buttonLabel);

                if (existingItem) {
                    // If the item exists, increment the quantity and update the price
                    existingItem.qty += 1;
                    existingItem.itemPrice += buttonPrice;
                } else {
                    // If the item doesn't exist, add a new item
                    const item = allMenuItems.find((item) => item.itemName === buttonLabel);

                    if (item) {
                        const newItem = {
                            menuItem: item,
                            qty: 1,
                        };
                        tableData.bill.items.push(newItem);
                    }
                }
                // Update the total price
                tableData.bill.price += buttonPrice;
                setTotal(tableData.bill.price)

                // Update the state with the modified table data
                setTableData({ ...tableData });
                console.log("total : ", total)
            }
            // else {
            //     // If the item doesn't exist, add a new item
            //     const item = allMenuItems.find((item) => item.itemName === buttonLabel);

            //     if (item) {
            //         const newItem = {
            //             menuItem: item,
            //             qty: 1,
            //         };
            //         tableData.bill.items.push(newItem);
            //     }
            //     tableData.bill.price += buttonPrice;
            //     setTotal(tableData.bill.price)

            //     // Update the state with the modified table data
            //     setTableData({...tableData});
            //     console.log("total : ", total)
            // }
        } else {

            const updatedButtonCountMap = { ...buttonCountMap };

            if (!updatedButtonCountMap[buttonLabel]) {
                updatedButtonCountMap[buttonLabel] = { item: buttonLabel, count: 1, itemPrice: buttonPrice };
                setSelectedButtons([...selectedButtons, buttonLabel]);
            } else {
                updatedButtonCountMap[buttonLabel].count++;
                updatedButtonCountMap[buttonLabel].itemPrice += parseFloat(buttonPrice);
            }

            setButtonCountMap(updatedButtonCountMap);

            setTotal((prevTotal) => prevTotal + buttonPrice);
        }
    };

    const updateQuantity = (buttonLabel, change, buttonPrice) => {
        if (tableData?.bill?.items.length > 0) {
            // Check if the item already exists in the billing items
            const existingItem = tableData.bill.items.find((item) => item.menuItem.itemName === buttonLabel);

            if (existingItem) {
                // Increment the quantity and update the price
                existingItem.qty += change;

                // If the quantity goes less than 1, remove it from billing items
                if (existingItem.qty <= 0) {
                    const index = tableData.bill.items.indexOf(existingItem);
                    if (index !== -1) {
                        tableData.bill.items.splice(index, 1);
                    }
                }

                // Update the total price
                tableData.bill.price += change * buttonPrice;
                setTotal(tableData.bill.price)

                // Update the state with the modified table data
                setTableData({ ...tableData });
                console.log("total : ", total)
            }
        } else {

            const updatedButtonCountMap = { ...buttonCountMap };

            if (updatedButtonCountMap[buttonLabel]) {
                updatedButtonCountMap[buttonLabel].count += change;

                if (updatedButtonCountMap[buttonLabel].count <= 0) {
                    delete updatedButtonCountMap[buttonLabel];
                    setSelectedButtons(selectedButtons.filter(label => label !== buttonLabel));
                } else {
                    let price = allMenuItems.find((item) => item.itemName === buttonLabel)?.itemPrice;
                    updatedButtonCountMap[buttonLabel].itemPrice += change * price;
                }

                setButtonCountMap(updatedButtonCountMap);
                const newTotal = Object.values(updatedButtonCountMap).reduce((acc, item) => {
                    return acc + item.itemPrice;
                }, 0);

                setTotal(newTotal);
            }
        }
    };

    const saveAndPrint = async () => {
        // var printableContent = document.getElementById('section3-content').innerHTML + "<br><br>";
        // printableContent += document.getElementById('total-section').innerHTML;

        // const printWindow = window.open('', '', 'height=900, width=1200');

        // printWindow.document.write('<html>');
        // printWindow.document.write('<head>');
        // printWindow.document.write('<style>');
        // printWindow.document.write(`
        //   .decrement-btn,
        //   .increment-btn {
        //     display: none;
        //   }

        //   .billing-table {
        //     border: none;
        //     margin: 50px;
        //   }
        // `);
        // printWindow.document.write('</style>');
        // printWindow.document.write('</head>');
        // printWindow.document.write('<body>');

        // printWindow.document.write('<h1>Restaurant</h1><p>Hyderabad Telangana State</p><br>');
        // printWindow.document.write(printableContent);

        // printWindow.document.write('</body></html>');
        // printWindow.document.close();

        // printWindow.print();
        // printWindow.close();
        if (tableData && tableData.bill?.id && tableData.bill?.price > 0) {
            handleCloseTable();
        } else {
            const billData = {
                items: selectedButtons.map(buttonLabel => {
                    const item = allMenuItems.find(item => item.itemName === buttonLabel);

                    return {
                        menuItem: {
                            id: item?.id,
                            mainMenuItemId: item?.mainMenuItemId,
                            itemName: item?.itemName,
                            itemPrice: item?.itemPrice
                        },
                        qty: buttonCountMap[buttonLabel]?.count
                    };
                })
            };

            const response = await fetch("http://localhost:8080/bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableId: 0,
                    items: billData.items,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("New bill added successfully:", data);
            Swal.fire({
                icon: 'success',
                title: 'Bill Created',
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
            handleClear();
        }
    };

    const handleCreateBillClick = async () => {
        if (tableData.bill?.price > 0) {
            console.log("Table data : ", tableData)
            const billDataForModification = {
                bill: tableData.bill
            };
            console.log("Tabledata after modify : ", tableData.bill.id)

            const response = await fetch(`http://localhost:8080/bill`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(billDataForModification.bill),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Bill modified successfully:", data);

            // Display a success message or handle other UI updates
            Swal.fire({
                icon: 'success',
                title: 'Bill Modified',
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
        } else {

            const billData = {
                items: selectedButtons.map(name => {
                    const item = allMenuItems.find(item => item.itemName === name);

                    return {
                        menuItem: {
                            id: item?.id,
                            mainMenuItemId: item?.mainMenuItemId,
                            itemName: item?.itemName,
                            itemPrice: item?.itemPrice
                        },
                        qty: buttonCountMap[name]?.count
                    };
                })
            };

            const response = await fetch("http://localhost:8080/bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableId: tableData.id,
                    items: billData.items,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("New bill added successfully:", data);
            Swal.fire({
                icon: 'success',
                title: 'Bill Created',
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
    };

    const handleCloseTable = async () => {
        console.log("Table data for closing : ", tableData);
        const tableDataToClose = { ...tableData }

        try {
            const response = await fetch(`http://localhost:8080/bill/${tableData.bill.id}/completeBill`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tableDataToClose),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Table Modified successfully:", data);
            Swal.fire({
                icon: 'success',
                title: 'Table Modified',
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
        } catch (error) {
            console.error("Error modifying table:", error);
        }
        console.log("Table closed : ", tableData)
        handleClear();
    }

    const handleClear = () => {
        setButtonCountMap({});
        setTotal(0);
        setSelectedButtons([]);
        setTableData([]);
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Billing Section Cleared',
        //     toast: true,
        //     position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 1500,
        //     timerProgressBar: true,
        //     didOpen: (toast) => {
        //         toast.addEventListener('mouseenter', Swal.stopTimer);
        //         toast.addEventListener('mouseleave', Swal.resumeTimer);
        //     },
        // });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMenuItem, setNewMenuItem] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMenuItem.trim() === '') {
            return;
        }

        const newMenuItemData = {
            itemName: newMenuItem.toUpperCase(),
        };

        fetch('http://localhost:8080/mainmenu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMenuItemData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('New menu added successfully:', data);
                setSection1Data([...section1Data, newMenuItemData]);
                setNewMenuItem('');
                closeModal();
                // After successfully adding a new main menu item, fetch the updated main menu items
                fetchMainMenuItems();
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: `${newMenuItemData.itemName.toUpperCase()} Added Successfully`,
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
            })
    };

    // Function to fetch the main menu items
    const fetchMainMenuItems = () => {
        const apiUrl = 'http://localhost:8080/mainmenu';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setSection1Data(result);
            })
            .catch((error) => {
                console.error('Error fetching main menu items:', error);
            });
    };

    //For Editing Main Menu

    const [editedMainMenu, setEditedMainMenu] = useState(null);
    const [isEditMainMenuFormOpen, setIsEditMainMenuFormOpen] = useState(false);

    // const openEditMainMenu = () => {
    //     setIsEditMainMenuFormOpen(true)
    // }

    const closeEditMainMenu = () => {
        setIsEditMainMenuFormOpen(false)
    }
    const handleEditMainMenu = (mId) => {
        const mainMenuToEdit = section1Data.find((item) => item.id === mId);
        setEditedMainMenu(mainMenuToEdit);
        setIsEditMainMenuFormOpen(true);
    };

    const handleMainMenuSubmit = (e) => {
        alert("From submitted")
        closeEditMainMenu();
    }

    const [isSubMenuModalOpen, setIsSubMenuModalOpen] = useState(false);
    const [newSubMenuItem, setNewSubMenuItem] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [selectedMainMenu, setSelectedMainMenu] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const openSubMenuModal = () => {
        setIsSubMenuModalOpen(true);
    };

    const closeSubMenuModal = () => {
        setIsSubMenuModalOpen(false);
    };

    const handleSubMenuSubmit = (e) => {
        if (newSubMenuItem.trim() === '' || newItemPrice.trim() === '' || selectedMainMenu.trim() === '') {
            return;
        }

        let menuItemId = 0;
        const menuItem = section1Data.find((item) => item.itemName === selectedMainMenu);
        if (menuItem) {
            menuItemId = menuItem.id;
        }
        const formData = {
            mainMenuItemId: menuItemId,
            itemName: newSubMenuItem.toUpperCase(),
            itemPrice: parseFloat(newItemPrice),
        };

        const apiUrl = 'http://localhost:8080/menuitem';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => {
                console.log('New Menu item added:', result);
                Swal.fire({
                    icon: 'success',
                    title: `${formData.itemName.toUpperCase()} Added Successfully`,
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
                fetchAllMenuItems();
            })
            .catch((error) => {
                console.error('Error adding new item:', error);
                Swal.fire({
                    icon: 'error',
                    title: `${formData.itemName.toUpperCase()} Was Not Added, Try Again`,
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
            });

        setNewSubMenuItem('');
        setNewItemPrice('');
        setSelectedMainMenu('');
        closeSubMenuModal();
    };

    //For Editing Menu Item

    const [editedMenuItem, setEditedMenuItem] = useState(null);
    const [isEditMenuItemFormOpen, setIsEditMenuItemFormOpen] = useState(false);

    // const openEditMenuItem = () => {
    //     setIsEditMenuItemFormOpen(true)
    // }

    const closeEditMenuItem = () => {
        setIsEditMenuItemFormOpen(false)
    }
    const handleEditMenuItem = (mId) => {
        const menuItemToEdit = allMenuItems.find((item) => item.id === mId);
        setEditedMenuItem(menuItemToEdit);
        setIsEditMenuItemFormOpen(true);
    };

    const handleMenuItemSubmit = (e) => {
        alert("From submitted")
        closeEditMenuItem();
    }

    //To display actions
    const [showActions, setShowActions] = useState(false);

    // Get current time in 12-hour format with AM/PM
    const getCurrentTime12Hr = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    // Calculate occupied time
    const getOccupiedTime = () => {
        const currentTable = tableData;
        if (!currentTable || !currentTable.bill || !currentTable.bill.createdTime) {
            return "Bill doesn't exist";
        }
        const createdTime = currentTable.bill.createdTime;
        // Parse createdTime
        const [datePart, timePart] = createdTime.split(' ');
        const [day, month, year] = datePart.split('-');
        const [hours, minutes, seconds, ampm] = timePart.split(/:| /); // Split on ':' or space
        // Convert hours to 24-hour format
        let hours24 = parseInt(hours, 10);
        if (ampm === 'pm' && hours24 < 12) {
            hours24 += 12;
        } else if (ampm === 'am' && hours24 === 12) {
            hours24 = 0;
        }
        const createTime = new Date(year, month - 1, day, hours24, parseInt(minutes, 10), parseInt(seconds, 10));
        // Get current time in 12-hour format with AM/PM
        const currentTime = getCurrentTime12Hr();
        const [currentDatePart, currentTimePart] = currentTime.split(' ');
        const [currentDay, currentMonth, currentYear] = currentDatePart.split('-');
        const [currentHours, currentMinutes, currentSeconds, currentAmPm] = currentTimePart.split(/:| /); // Split on ':' or space
        // Convert current hours to 24-hour format
        let currentHours24 = parseInt(currentHours, 10);
        if (currentAmPm === 'pm' && currentHours24 < 12) {
            currentHours24 += 12;
        } else if (currentAmPm === 'am' && currentHours24 === 12) {
            currentHours24 = 0;
        }
        const currentTimeObj = new Date(currentYear, currentMonth - 1, currentDay, currentHours24, parseInt(currentMinutes, 10), parseInt(currentSeconds, 10));
        // Calculate time difference in seconds
        const timeDifference = currentTimeObj - createTime;
        const totalSeconds = Math.floor(timeDifference / 1000);
        // Calculate hours, minutes, and seconds
        const hoursDiff = Math.floor(totalSeconds / 3600);
        const minutesDiff = Math.floor((totalSeconds % 3600) / 60);
        const secondsDiff = totalSeconds % 60;
        // Format the result with AM/PM
        // const amPm = currentAmPm === 'am' ? 'AM' : 'PM';
        const formattedTime = `${hoursDiff.toString().padStart(2, '0')} : ${minutesDiff.toString().padStart(2, '0')} : ${secondsDiff.toString().padStart(2, '0')}`;
        return formattedTime;
    }

    return (
        <div className="Home">
            <Header />
            <div className='add-buttons'>
                <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={openModal}>Add Menu</button>
                <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={openSubMenuModal}>Add Menu Item</button>
                <button
                    onClick={() => setShowActions(!showActions)}
                    className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}
                >
                    {showActions ? 'Disable Actions' : 'Enable Actions'}
                </button>
            </div>
            <main className="Home-main">
                <div className="section" style={{ width: '15%' }}>
                    {/* <h4>Menu Items</h4> */}
                    {section1Data.length > 0 ? (
                        <div id="section1">
                            {section1Data.map((menuItem, index) => (
                                <div className='section1' key={index}>
                                    <Link className='section1-link' to={`/order/${menuItem.id}`}>
                                        <button
                                            className={`btn ${selectedButtonSection1 === menuItem.itemName ? 'selected' : ''}`}
                                            onClick={() => { setSelectedButtonSection1(menuItem.itemName); showSection2Content(menuItem.itemName) }}
                                        >
                                            {menuItem.itemName}
                                        </button>
                                        <div className={`${showActions ? 'actions' : 'displayNone'}`}>
                                            {showActions && (
                                                <>
                                                    <EditIcon className="btn-edit" onClick={() => handleEditMainMenu(menuItem.id)} />
                                                    <DeleteIcon
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            handleDeleteMainMenu(menuItem.id)
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No menu items found.</p>
                    )}
                </div>

                <div className="section">
                    {/* <h4>Items</h4> */}
                    <div id="section2-content">
                        {data.length > 0 ? (
                            <div className="section2-content-buttons">
                                {data.map((menuItem, index) => (
                                    <div key={index} className="menu-item">
                                        <button
                                            className={`section2-content-buttons-btn ${selectedButtonSection2 === menuItem.itemName ? 'selected' : ''}`}
                                            key={index}
                                            onClick={() => {
                                                setSelectedButtonSection2(menuItem.itemName);
                                                addSection3Content(menuItem.itemName, menuItem.itemPrice);
                                            }}
                                        >
                                            {menuItem.itemName} <br /> ({menuItem.itemPrice})
                                            {showActions && (
                                                <>
                                                    <EditIcon onClick={(e) => { e.stopPropagation(); handleEditMenuItem(menuItem.id) }} />
                                                    <DeleteIcon
                                                        className="delete-menu-item-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteMenuItem(menuItem.id);
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Select a menu item to see its options.</p>
                        )}
                    </div>
                </div>
                <div className="section">
                    {/* <h4>Billing Details</h4> */}
                    <div id="section3-content">
                        {selectedButtons.length > 0 ? (
                            <table className='billing-table table table-bordered'>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedButtons.map((buttonLabel, index) => (
                                        <tr key={index}>
                                            <td>{buttonLabel}</td>
                                            <td className='increment-decrement-btn'>
                                                <button className='decrement-btn' onClick={() => updateQuantity(buttonLabel, -1, data.find(item => item.itemName === buttonLabel)?.itemPrice)}>-</button>
                                                <span>{buttonCountMap[buttonLabel]?.count}</span>
                                                <button className='increment-btn' onClick={() => updateQuantity(buttonLabel, 1, data.find(item => item.itemName === buttonLabel)?.itemPrice)}>+</button>
                                            </td>
                                            <td>{buttonCountMap[buttonLabel].itemPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <>
                                {tableData?.bill?.items.length > 0 ? (
                                    // Render the table when selectedTableData has data
                                    <>
                                        {tableData.bill?.items.length > 0 ? (<h6 style={{ textAlign: 'center' }}>Table {tableData?.name} is occupied from <b style={{ color: 'green' }}>{getOccupiedTime(tableData.id)}</b></h6>) : ('')}
                                        <table className='billing-table table table-bordered'>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.bill?.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.menuItem?.itemName}</td>
                                                        <td className='increment-decrement-btn'>
                                                            <button className='decrement-btn' onClick={() => updateQuantity(item.menuItem.itemName, -1, item.menuItem.itemPrice)}>-</button>
                                                            <span>{item.qty}</span>
                                                            <button className='increment-btn' onClick={() => updateQuantity(item.menuItem.itemName, 1, item.menuItem.itemPrice)}>+</button>
                                                        </td>
                                                        <td>{(item.qty * item.menuItem?.itemPrice).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </>
                                ) : (
                                    // Render "No item found." when selectedTableData is empty
                                    <p>No item found.</p>
                                )}
                            </>

                        )}
                    </div>
                    <div className='billing-details'>
                        {/* eslint-disable-next-line eqeqeq */}
                        <div id="total-section" className={`${(selectedButtons.length > 0 || (tableData && tableData.bill && tableData.bill.items && tableData.bill.items.length > 0)) ? 'displayTotalBorder' : ''}`}>
                            {(selectedButtons.length !== 0 || (tableData && tableData.bill && tableData.bill.items && tableData.bill.items.length > 0)) ? `Total RS ${total.toFixed(2)}` : ''}
                        </div>
                        <br />

                        <div className="col-lg-3">
                            {selectedButtons.length > 0 || tableData?.bill?.items.length > 0 ? (
                                <>
                                    <button type="button" className="btn btn-success" onClick={saveAndPrint}>Save & Print</button>
                                    <button type="button" className="btn btn-danger" onClick={handleClear}>Clear All</button>
                                    {(!tableData.id) ? ('') : (<button type="button" className="btn btn-info" onClick={handleCreateBillClick}>KOT & Print</button>)}
                                    {(!tableData.id || !tableData.bill) ? ('') : (<button type="button" className="btn btn-info" onClick={handleCloseTable}>Close Table</button>)}
                                </>
                            ) : ''}
                            {/* {tableData.bill?.price > 0 ? (
                                <button type="button" className="btn btn-primary" onClick={kotAndPrint}>KOT & Print</button>
                            ) : ''} */}
                        </div>
                    </div>
                </div>
                {/* For Adding Main Menu */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isModalOpen}
                    onClose={closeModal}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" className="formHeading">
                        {"Add Main Menu"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Main Menu"
                                value={newMenuItem}
                                required
                                onChange={(e) => setNewMenuItem(e.target.value)} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className="formBtn" onClick={handleSubmit}>
                            Add
                        </Button>
                        <Button className="formBtn" onClick={closeModal}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* For Editing Main Menu */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isEditMainMenuFormOpen}
                    onClose={closeEditMainMenu}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" className="formHeading">
                        {"Modify Main Menu"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Main Menu"
                                value={editedMainMenu ? editedMainMenu.itemName : newMenuItem}
                                onChange={(e) =>
                                    editedMainMenu
                                        ? setEditedMainMenu({ ...editedMainMenu, itemName: e.target.value })
                                        : setNewMenuItem(e.target.value)
                                }
                                required />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className="formBtn" onClick={handleMainMenuSubmit}>
                            {editedMainMenu ? 'Update' : 'Add'}
                        </Button>
                        <Button className="formBtn" onClick={closeEditMainMenu}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* For sub menuitems */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isSubMenuModalOpen}
                    onClose={closeSubMenuModal}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" className="formHeading">
                        {"Add Menu Item"}
                    </DialogTitle>
                    <div className="custom-select">
                        <div onClick={toggleOptions} className="selected-option">
                            {selectedMainMenu || 'Select Main Menu'}
                        </div>
                        <div className={`options ${showOptions ? 'show' : ''}`}>
                            {section1Data.map((menuItem, index) => (
                                <div
                                    key={index}
                                    className="option"
                                    onClick={() => {
                                        setSelectedMainMenu(menuItem.itemName);
                                        toggleOptions();
                                    }}
                                >
                                    {menuItem.itemName.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogContent>
                        <DialogContentText>
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Menu Item"
                                value={newSubMenuItem}
                                onChange={(e) => setNewSubMenuItem(e.target.value)}
                                required
                            /><br />
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Price"
                                value={newItemPrice}
                                onChange={(e) => setNewItemPrice(e.target.value)}
                                required
                            /><br />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className="formBtn" onClick={handleSubMenuSubmit}>
                            Add
                        </Button>
                        <Button className="formBtn" onClick={closeSubMenuModal}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* For Editing Menu Item */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isEditMenuItemFormOpen}
                    onClose={closeEditMenuItem}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" className="formHeading">
                        {"Modify Menu Item"}
                    </DialogTitle>
                    <div className="custom-select">
                        <div onClick={toggleOptions} className="selected-option">
                            {selectedMainMenu || 'Select Main Menu'}
                        </div>
                        <div className={`options ${showOptions ? 'show' : ''}`}>
                            {section1Data.map((menuItem, index) => (
                                <div
                                    key={index}
                                    className="option"
                                    value={editedMenuItem ? selectedMainMenu : ''}
                                    onClick={() => {
                                        setSelectedMainMenu(menuItem.itemName);
                                        toggleOptions();
                                    }}
                                >
                                    {menuItem.itemName.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div><br />
                    <DialogContent>
                        <DialogContentText>
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Menu Item"
                                value={editedMenuItem ? editedMenuItem.itemName : newSubMenuItem}
                                onChange={(e) =>
                                    editedMenuItem
                                        ? setEditedMenuItem({ ...editedMenuItem, itemName: e.target.value })
                                        : setNewSubMenuItem(e.target.value)
                                }
                                required /><br />
                            <input
                                className='formInput'
                                type="text"
                                placeholder="Enter Price"
                                value={editedMenuItem ? editedMenuItem.itemPrice : newItemPrice}
                                onChange={(e) =>
                                    editedMenuItem
                                        ? setEditedMenuItem({ ...editedMenuItem, itemPrice: e.target.value })
                                        : setNewItemPrice(e.target.value)
                                }
                                required />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className="formBtn" onClick={handleMenuItemSubmit}>
                            {editedMenuItem ? 'Update' : 'Add'}
                        </Button>
                        <Button className="formBtn" onClick={closeEditMenuItem}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
}

export default Home;
