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
        fetchAllMenuItems();
    }, [])

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

    const [descriptionData, setDescriptionData] = useState([]);

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
        } else {

            const updatedButtonCountMap = { ...buttonCountMap };

            if (!updatedButtonCountMap[buttonLabel]) {
                updatedButtonCountMap[buttonLabel] = { item: buttonLabel, count: 1, itemPrice: buttonPrice, desc: '' };
                setSelectedButtons([...selectedButtons, buttonLabel]);
            } else {
                updatedButtonCountMap[buttonLabel].count++;
                updatedButtonCountMap[buttonLabel].itemPrice += parseFloat(buttonPrice);
            }

            setButtonCountMap(updatedButtonCountMap);
            setDescriptionData(updatedButtonCountMap);

            setTotal((prevTotal) => prevTotal + buttonPrice);
            console.log("Description data : ", descriptionData)

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

    //For handling description form submit
    const [isDescriptionFormOpen, setIsDescriptionFormOpen] = useState(false);
    const [itemDescription, setNewItemDescription] = useState('');
    const [itemsDescription, setItemsDescription] = useState(null);

    const openDescriptionForm = (items) => {
        setNewItemDescription('');
        setIsDescriptionFormOpen(true);
        setItemsDescription(items);
    };

    const closeDescriptionForm = () => {
        setIsDescriptionFormOpen(false);
    };

    const handleDescriptionSubmit = async (e) => {
        e.preventDefault();
        if (itemDescription.trim() === '') {
            return;
        }

        let matchedItem = null;

        for (const key in allMenuItems) {
            if (allMenuItems[key].itemName === itemsDescription) {
                matchedItem = allMenuItems[key];
                break;
            }
        }

        if (matchedItem !== null) {
            console.log("Matched Item:", matchedItem);


            const updatedButtonCountMap = { ...buttonCountMap };

            if (!updatedButtonCountMap[matchedItem.itemName]) {
                if (tableData && tableData.bill?.items.length > 0 && tableData.bill.id !== null) {
                    const matchingItem = tableData.bill.items.find(item => item.menuItem.id === matchedItem.id);
                    if (matchingItem) {
                        matchingItem.desc = itemDescription.toUpperCase();
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
                                    qty: buttonCountMap[buttonLabel]?.count,
                                    desc: buttonCountMap[buttonLabel]?.desc
                                };
                            })
                        };
                        console.log("Added description successfully:", billData);
                    } else {
                        updatedButtonCountMap[matchedItem.itemName] = {}; // Initialize with an empty object
                    }
                } else {
                    updatedButtonCountMap[matchedItem.itemName] = {}; // Initialize with an empty object
                }
            } else {

                updatedButtonCountMap[matchedItem.itemName].desc = itemDescription.toUpperCase();
                setButtonCountMap(updatedButtonCountMap);
            }
        } else {
            console.log("No matching item found.");
        }
        setNewItemDescription('');
        closeDescriptionForm();
    }

    //Editing description

    const openEditDescriptionForm = (items, desc) => {
        setIsDescriptionFormOpen(true);
        setItemsDescription(items);
        setNewItemDescription(desc);
    };

    const [takeAwayRecieptData, setTakeAwayRecieptData] = useState(null);
    const saveAndPrint = async () => {
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
                        qty: buttonCountMap[buttonLabel]?.count,
                        desc: buttonCountMap[buttonLabel]?.desc
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
            setTakeAwayRecieptData(data)
            setIsRecieptOpen(true);
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

    const [dineInData, setDineInData] = useState(null);
    const [alreadyDineInData, setAlreadyDineInData] = useState(null);
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
            setAlreadyDineInData(data);
            setIsAlreadyDineInRecieptOpen(true);
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
                        qty: buttonCountMap[name]?.count,
                        desc: buttonCountMap[name]?.desc
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
            setDineInData(data);
            setIsDineInRecieptOpen(true);
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
            setAlreadyDineInData(data);
            setIsAlreadyDineInRecieptOpen(true);
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

    const getItemNameWithMainMenuId = (id) => {
        const menu = section1Data.find(item => item.id === id);
        return menu ? menu.itemName : ''; 
    }

    //For adding main menu
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

    const handleMainMenuSubmit = async (e) => {
        e.preventDefault();
        console.log("Editedmainmenu : ", editedMainMenu)
        try {
            const response = await fetch("http://localhost:8080/mainmenu", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedMainMenu),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            fetchMainMenuItems();
            console.log("Main Menu Modified successfully:", data);
            Swal.fire({
                icon: 'success',
                title: 'Main Menu Modified Successfully',
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
            closeEditMainMenu();
        } catch (error) {
            console.error("Error Modifying Main Menu:", error);
            Swal.fire({
                icon: 'error',
                title: 'Main Menu was Not Updated, Try Again!',
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
            closeEditMainMenu();
        }
    }

    const [isSubMenuModalOpen, setIsSubMenuModalOpen] = useState(false);
    const [newSubMenuItem, setNewSubMenuItem] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [editedMenuItem, setEditedMenuItem] = useState(null);
    const [selectedMainMenu, setSelectedMainMenu] = useState(editedMenuItem ? getItemNameWithMainMenuId(editedMenuItem.mainMenuItemId) : '');
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
        e.preventDefault();
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
                    title: `${formData.itemName.toUpperCase()} Added Successfully, Navigate Back To See!`,
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

    const [isEditMenuItemFormOpen, setIsEditMenuItemFormOpen] = useState(false);

    const closeEditMenuItem = () => {
        setIsEditMenuItemFormOpen(false)
    }
    const handleEditMenuItem = (mId) => {
        const menuItemToEdit = allMenuItems.find((item) => item.id === mId);
        setEditedMenuItem(menuItemToEdit);
        setIsEditMenuItemFormOpen(true);
    };

    const handleMenuItemSubmit = async (e) => {
        e.preventDefault();
        console.log("Editedmenuitem : ", editedMenuItem)
        try {
            const response = await fetch("http://localhost:8080/menuitem", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedMenuItem),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Menu Item Modified successfully:", data);
            Swal.fire({
                icon: 'success',
                title: 'Menu Item Modified Successfully, Navigate Back To See!',
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
            closeEditMenuItem();
            fetchAllMenuItems();
        } catch (error) {
            console.error("Error modifying menu item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Menu Item Was Not Modified, Try Again!',
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
            closeEditMenuItem();
        }
    }

    //To display actions
    const [showActions, setShowActions] = useState(false);

    // Calculate occupied time
    const getOccupiedTime = () => {
        const currentTable = tableData;
        if (!currentTable || !currentTable.bill || !currentTable.bill.createdTime) {
            return "Bill doesn't exist";
        }
        const createdTime = currentTable.bill.createdTime;

        // Calculate and display the time difference
        const timeDifference = calculateTimeDifference(createdTime);
        return timeDifference;

    }

    function convertTo24HourFormat(timeString) {
        const [datePart, timePart] = timeString.split(" ");
        const [day, month, year] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        let hour = parseInt(hours, 10);

        if (timeString.toLowerCase().includes("pm") && hour !== 12) {
            hour += 12;
        } else if (timeString.toLowerCase().includes("am") && hour === 12) {
            hour = 0;
        }

        return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour, parseInt(minutes, 10), parseInt(seconds, 10));
    }

    function calculateTimeDifference(createdTime) {
        const currentDateTime = new Date();
        const createdDateTime = convertTo24HourFormat(createdTime);

        const timeDifferenceMilliseconds = currentDateTime - createdDateTime;

        const hoursDifference = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));
        const minutesDifference = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const secondsDifference = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000);

        return `${hoursDifference} : ${minutesDifference} : ${secondsDifference}`;
    }

    //TakeAway Reciept
    const [isRecieptOpen, setIsRecieptOpen] = useState(false);

    const closeReciept = () => {
        setIsRecieptOpen(false)
    }

    const handleRecieptSubmit = (e) => {
        console.log("TAke away data : ", takeAwayRecieptData)
        closeReciept();
        Swal.fire({
            icon: 'success',
            title: `Bill Printed Successfully`,
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

    //DineIn Receipt
    const [isDineInRecieptOpen, setIsDineInRecieptOpen] = useState(false);

    const closeDineInReciept = () => {
        setIsDineInRecieptOpen(false)
    }

    const handleDineInRecieptSubmit = (e) => {
        console.log("Dine in data : ", dineInData)
        closeDineInReciept();
        Swal.fire({
            icon: 'success',
            title: `KOT Printed Successfully`,
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

    //Already DineIn Receipt
    const [isAlreadyDineInRecieptOpen, setIsAlreadyDineInRecieptOpen] = useState(false);

    const closeAlreadyDineInReciept = () => {
        setIsAlreadyDineInRecieptOpen(false)
    }

    const handleAlreadyDineInRecieptSubmit = (e) => {
        console.log("Already dine in data : ", alreadyDineInData)
        closeAlreadyDineInReciept();
        Swal.fire({
            icon: 'success',
            title: `KOT Printed Successfully`,
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

    return (
        <div className="Home">
            <Header />
            <div id='add-buttons' className='add-buttons'>
                <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={openModal}>Add Menu</button>
                <button className={`${showActions ? 'btn' : 'displayNone'}`} onClick={openSubMenuModal}>Add Menu Item</button>
                <button
                    onClick={() => setShowActions(!showActions)}
                    className={`btn ${showActions ? 'btn-danger' : 'btn-success'}`}
                >
                    {showActions ? 'Disable Actions' : 'Enable Actions'}
                </button>
            </div>
            <main id="main-page" className="Home-main">
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
                                            {menuItem.itemName.toUpperCase()} <br /> ({menuItem.itemPrice})
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
                                        <th>Description</th>
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
                                            <td>{buttonCountMap[buttonLabel].desc ? (
                                                <div className='editDesc' onClick={() => openEditDescriptionForm(buttonLabel, buttonCountMap[buttonLabel].desc)}>
                                                    {buttonCountMap[buttonLabel].desc}
                                                    <EditIcon />
                                                </div>
                                            )
                                                : (
                                                    <div className='addDesc'>
                                                        {selectedButtons.length > 0 || tableData?.bill?.items.length > 0 ? (
                                                            <>
                                                                <Link onClick={() => openDescriptionForm(buttonLabel)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                                    </svg>
                                                                    Add
                                                                </Link><br />
                                                            </>) : ('')}
                                                    </div>
                                                )}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <>
                                {tableData?.bill?.items.length > 0 ? (
                                    // Render the table when selectedTableData has data
                                    <>
                                        {tableData.bill?.items.length > 0 ? (<h6 className='table-occupied'>Table {tableData?.name} is occupied from <b>{getOccupiedTime(tableData.id)}</b></h6>) : ('')}
                                        <table className='billing-table table table-bordered'>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Description</th>
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
                                                        <td>
                                                            {item.desc ? (
                                                                <div className='editDesc' onClick={() => openEditDescriptionForm(item.menuItem.itemName, item.desc)}>
                                                                    {item.desc}
                                                                    <EditIcon />
                                                                </div>
                                                            ) : (
                                                                <div className='addDesc'>
                                                                    {selectedButtons.length > 0 || tableData?.bill?.items.length > 0 ? (
                                                                        <>
                                                                            <Link onClick={() => openDescriptionForm(item.menuItem.itemName)}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                                                </svg>
                                                                                Add
                                                                            </Link><br />
                                                                        </>
                                                                    ) : ('')}
                                                                </div>
                                                            )}
                                                        </td>
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
                                    {(tableData.id) ? ('') : (<button type="button" className="btn btn-success" onClick={saveAndPrint}>Save & Print</button>)}
                                    <button type="button" className="btn btn-danger" onClick={handleClear}>Clear All</button>
                                    {(!tableData.id) ? ('') : (<button type="button" className="btn btn-info" onClick={handleCreateBillClick}>KOT & Print</button>)}
                                    {(!tableData.id || !tableData.bill) ? ('') : (<button type="button" className="btn btn-info" onClick={handleCloseTable}>Close Table</button>)}
                                </>
                            ) : ''}
                        </div>
                    </div>
                </div>
                {/* For Adding Item Description */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isDescriptionFormOpen}
                    onClose={closeDescriptionForm}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <form onSubmit={handleDescriptionSubmit}>
                        <DialogTitle id="responsive-dialog-title" className="formHeading">
                            {"Add Item Description"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <textarea
                                    className='formInput'
                                    type="text"
                                    placeholder="Enter Description"
                                    value={itemDescription}
                                    autoFocus
                                    onChange={(e) => setNewItemDescription(e.target.value)} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button className="formBtn" type='submit'>
                                Add
                            </Button>
                            <Button className="formBtn" onClick={closeDescriptionForm}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                {/* For Adding Main Menu */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isModalOpen}
                    onClose={closeModal}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <form onSubmit={handleSubmit}>
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
                                    autoFocus
                                    onChange={(e) => setNewMenuItem(e.target.value)} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button className="formBtn" type='submit'>
                                Add
                            </Button>
                            <Button className="formBtn" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* For Editing Main Menu */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isEditMainMenuFormOpen}
                    onClose={closeEditMainMenu}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <form onSubmit={handleMainMenuSubmit}>
                        <DialogTitle id="responsive-dialog-title" className="formHeading">
                            {"Modify Main Menu"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <input
                                    className='formInput'
                                    type="text"
                                    placeholder="Enter Main Menu"
                                    value={editedMainMenu ? editedMainMenu.itemName.toUpperCase() : newMenuItem}
                                    autoFocus
                                    onChange={(e) =>
                                        editedMainMenu
                                            ? setEditedMainMenu({ ...editedMainMenu, itemName: e.target.value })
                                            : setNewMenuItem(e.target.value)
                                    }
                                    required />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button className="formBtn" type='submit'>
                                {editedMainMenu ? 'Update' : 'Add'}
                            </Button>
                            <Button className="formBtn" onClick={closeEditMainMenu}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* For adding sub menuitems */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isSubMenuModalOpen}
                    onClose={closeSubMenuModal}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <form onSubmit={handleSubMenuSubmit}>
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
                                    autoFocus
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
                            <Button className="formBtn" type='submit'>
                                Add
                            </Button>
                            <Button className="formBtn" onClick={closeSubMenuModal}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* For Editing Menu Item */}
                <Dialog
                    fullScreen={fullScreen}
                    open={isEditMenuItemFormOpen}
                    onClose={closeEditMenuItem}
                    className="custom-modal"
                    aria-labelledby="responsive-dialog-title"
                >
                    <form onSubmit={handleMenuItemSubmit}>
                        <DialogTitle id="responsive-dialog-title" className="formHeading">
                            {"Modify Menu Item"}
                        </DialogTitle>
                        <div className="custom-select">
                            <div onClick={toggleOptions} className="selected-option">
                                {editedMenuItem ? getItemNameWithMainMenuId(editedMenuItem.mainMenuItemId) : selectedMainMenu || 'Select Main Menu'}
                            </div>
                            <div className={`options ${showOptions ? 'show' : ''}`}>
                                {section1Data.map((menuItem, index) => (
                                    <div
                                        key={index}
                                        className="option"
                                        value={editedMenuItem ? getItemNameWithMainMenuId(editedMenuItem.mainMenuItemId) : selectedMainMenu}
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
                                    value={editedMenuItem ? editedMenuItem.itemName.toUpperCase() : newSubMenuItem}
                                    autoFocus
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
                            <Button className="formBtn" type='submit'>
                                {editedMenuItem ? 'Update' : 'Add'}
                            </Button>
                            <Button className="formBtn" onClick={closeEditMenuItem}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </main>

            {/* Take away receipt */}
            <Dialog
                fullScreen={fullScreen}
                open={isRecieptOpen}
                onClose={closeReciept}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR HOTEL"}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText> */}
                    <span>----------------------------------------------------------</span><br />
                    <span><b>TAKE AWAY ( {takeAwayRecieptData?.bill?.id} ) </b></span><br />
                    <span>----------------------------------------------------------</span><br />
                    <span>Bill #{takeAwayRecieptData?.bill?.id} </span><br />
                    <span>Date: {takeAwayRecieptData?.bill?.createdTime.toUpperCase()}</span><br />
                    <span>---------------------------------------------------------</span><br />
                    <div className='takeawayRecieptDiv'>
                        <table className='takeawayRecieptTable'>
                            <thead className='takeawayRecieptTable-thead'>
                                <tr>
                                    <th className='takeawayRecieptTable-th1'>DESCRIPTION</th>
                                    <th className='takeawayRecieptTable-th2'>QTY</th>
                                    <th className='takeawayRecieptTable-th3'>PRICE</th>
                                    <th className='takeawayRecieptTable-th4'>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {takeAwayRecieptData?.bill?.items.map((item) => (
                                    <tr className='takeawayRecieptTable-tr' key={item.id}>
                                        <td className='takeawayRecieptTable-td1'>{item.menuItem.itemName}</td>
                                        <td className='takeawayRecieptTable-td2'>{item.qty}</td>
                                        <td className='takeawayRecieptTable-td3'>{item.menuItem.itemPrice}</td>
                                        <td className='takeawayRecieptTable-td4'>{(item.qty) * (item.menuItem.itemPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <span>----------------------------------------------------------</span><br />
                    <b style={{ textAlign: 'right' }}>Sub Total : RS.{takeAwayRecieptData?.bill?.price}</b><br />
                    <span>----------------------------------------------------------</span><br />
                    <b style={{ textAlign: 'right' }}>Net Total : RS.{takeAwayRecieptData?.bill?.price}</b><br />
                    <span>----------------------------------------------------------</span><br />
                    <span>THANK YOU PLEASE COME AGAIN</span>
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button className="formBtn" onClick={handleRecieptSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeReciept}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dine in reciept */}
            <Dialog
                fullScreen={fullScreen}
                open={isDineInRecieptOpen}
                onClose={closeDineInReciept}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR HOTEL"}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText> */}
                    <span>----------------------------------------------------------</span><br />
                    <span><b>KOT ( {dineInData?.bill?.id} ) </b></span><br />
                    <span>----------------------------------------------------------</span><br />
                    <span>Bill #{dineInData?.bill?.id} </span><br />
                    <span>Date: {dineInData?.bill?.createdTime.toUpperCase()}</span><br />
                    <span>---------------------------------------------------------</span><br />
                    <div className='takeawayRecieptDiv'>
                        <table className='takeawayRecieptTable'>
                            <thead className='takeawayRecieptTable-thead'>
                                <tr>
                                    <th className='takeawayRecieptTable-th1'>DESCRIPTION</th>
                                    <th className='takeawayRecieptTable-th2'>QTY</th>
                                    <th className='takeawayRecieptTable-th3'>PRICE</th>
                                    <th className='takeawayRecieptTable-th4'>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dineInData?.bill?.items.map((item) => (
                                    <tr className='takeawayRecieptTable-tr' key={item.id}>
                                        <td className='takeawayRecieptTable-td1'>{item.menuItem.itemName}</td>
                                        <td className='takeawayRecieptTable-td2'>{item.qty}</td>
                                        <td className='takeawayRecieptTable-td3'>{item.menuItem.itemPrice}</td>
                                        <td className='takeawayRecieptTable-td4'>{(item.qty) * (item.menuItem.itemPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <span>----------------------------------------------------------</span><br />
                    <b style={{ textAlign: 'right' }}>Sub Total : RS.{dineInData?.bill?.price}</b><br />
                    <span>----------------------------------------------------------</span><br />
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button className="formBtn" onClick={handleDineInRecieptSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeDineInReciept}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* already Dine in reciept */}
            <Dialog
                fullScreen={fullScreen}
                open={isAlreadyDineInRecieptOpen}
                onClose={closeAlreadyDineInReciept}
                className="custom-modal"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className="formHeading">
                    {"TANDOOR HOTEL"}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText> */}
                    {alreadyDineInData?.status === 'closed' ? (
                        <>
                            <span>----------------------------------------------------------</span><br />
                            <span><b>BILL ( {alreadyDineInData?.id} ) </b></span><br />
                            <span>----------------------------------------------------------</span><br />
                        </>
                    ) : (
                        <>
                            <span>----------------------------------------------------------</span><br />
                            <span><b>KOT ( {alreadyDineInData?.id} ) </b></span><br />
                            <span>----------------------------------------------------------</span><br />
                        </>
                    )}
                    <span>Bill #{alreadyDineInData?.id} </span><br />
                    <span>Date: {alreadyDineInData?.createdTime.toUpperCase()}</span><br />
                    <span>---------------------------------------------------------</span><br />
                    <div className='takeawayRecieptDiv'>
                        <table className='takeawayRecieptTable'>
                            <thead className='takeawayRecieptTable-thead'>
                                <tr>
                                    <th className='takeawayRecieptTable-th1'>DESCRIPTION</th>
                                    <th className='takeawayRecieptTable-th2'>QTY</th>
                                    <th className='takeawayRecieptTable-th3'>PRICE</th>
                                    <th className='takeawayRecieptTable-th4'>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alreadyDineInData?.items.map((item) => (
                                    <tr className='takeawayRecieptTable-tr' key={item.id}>
                                        <td className='takeawayRecieptTable-td1'>{item.menuItem.itemName}</td>
                                        <td className='takeawayRecieptTable-td2'>{item.qty}</td>
                                        <td className='takeawayRecieptTable-td3'>{item.menuItem.itemPrice}</td>
                                        <td className='takeawayRecieptTable-td4'>{(item.qty) * (item.menuItem.itemPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <span>----------------------------------------------------------</span><br />
                    <b style={{ textAlign: 'right' }}>Sub Total : RS.{alreadyDineInData?.price}</b><br />
                    <span>----------------------------------------------------------</span><br />
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button className="formBtn" onClick={handleAlreadyDineInRecieptSubmit}>
                        Print
                    </Button>
                    <Button className="formBtn" onClick={closeAlreadyDineInReciept}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}

export default Home;
