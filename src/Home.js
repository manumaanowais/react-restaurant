import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

Modal.setAppElement('#root');
function Home() {
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
    });


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
        const itemToDelete = data.filter((item) => item.id === itemId).map((name) => name.itemName.toUpperCase());

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

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };


    const [buttonCountMap, setButtonCountMap] = useState({});
    const [total, setTotal] = useState(0);
    const [selectedButtons, setSelectedButtons] = useState([]);

    const showSection2Content = (buttonId) => {
        data[buttonId]?.map((button) => ({
            itemName: button.itemName,
            itemPrice: button.itemPrice,
        }));
    };

    const addSection3Content = (buttonLabel, buttonPrice) => {
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
    };

    const updateQuantity = (buttonLabel, change, buttonPrice) => {
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

        try {
            fetch("http://localhost:8080/bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableId: 0,
                    items: billData.items
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                })
                .then((data) => {
                    console.log("New bill added successfully:", data);
                })
                .catch((error) => {
                    console.error("Error adding new bill:", error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleClear = () => {
        setButtonCountMap({});
        setTotal(0);
        setSelectedButtons([]);
        Swal.fire({
            icon: 'success',
            title: 'Billing Section Cleared',
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
            itemName: newMenuItem.trim(),
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

    const [isSubMenuModalOpen, setIsSubMenuModalOpen] = useState(false);
    const [newSubMenuItem, setNewSubMenuItem] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [selectedMainMenu, setSelectedMainMenu] = useState('');

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
            .then((response) => response.json())
            .then((result) => {
                console.log('New Menu item added:', result);
            }).then(() => {
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
            })
            .catch((error) => {
                console.error('Error adding new item:', error);
            });

        setNewSubMenuItem('');
        setNewItemPrice('');
        setSelectedMainMenu('');
        closeSubMenuModal();
    };

    //To display actions

    const [showActions, setShowActions] = useState(false);

    const kotAndPrint = () => {
        console.log("Selected Items for KOT : ", selectedButtons.map((buttonLabel) => buttonCountMap[buttonLabel]))
    }

    return (
        <div className="Home">
            <Header />
            <div className='add-buttons'>
                <button className="btn" onClick={openModal}>Add Menu</button>
                <button className="btn" onClick={openSubMenuModal}>Add Menu Item</button>
                <button onClick={() => setShowActions(!showActions)} className="btn">
                    {showActions ? 'Disable Actions' : 'Enable Actions'}
                </button>
            </div>
            <main className="Home-main">
                <div className="section" style={{ width: '15%' }}>
                    <h4>Menu Items</h4>
                    {section1Data.length > 0 ? (
                        <div id="section1">
                            {section1Data.map((menuItem, index) => (
                                <div className='section1' key={index}>
                                    <Link className='section1-link' to={`/${menuItem.id}`}>
                                        <button
                                            className={`btn ${selectedButtonSection1 === menuItem.itemName ? 'selected' : ''}`}
                                            onClick={() => { setSelectedButtonSection1(menuItem.itemName); showSection2Content(menuItem.itemName) }}
                                        >
                                            {menuItem.itemName}
                                        </button>
                                        <div className={`${showActions ? 'actions' : 'displayNone'}`}>
                                            {showActions && (
                                                <>
                                                    <EditIcon />
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
                    <h4>Items</h4>
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
                                                    <EditIcon onClick={(e) => e.stopPropagation()} />
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
                    <h4>Billing Details</h4>
                    <div id="section3-content">
                        {selectedButtons.length > 0 ? (
                            <table border={1} className='billing-table'>
                                <thead>
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
                            <div>
                                {selectedTableData?.bill > 0 ? (
                                    // Render the table when selectedTableData has data
                                    <>
                                        <h6>Table {selectedTableData.id} is occupied from {formatTime(selectedTableData?.id)}</h6>
                                        <table border={1} className='billing-table'>
                                            <thead>
                                                <tr>
                                                    <th>Items</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{selectedTableData.name}</td>
                                                    <td><span>{selectedTableData.sequence}</span></td>
                                                    <td>{selectedTableData.id}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                ) : (
                                    // Render "No item found." when selectedTableData is empty
                                    <p>No item found.</p>
                                )}
                            </div>

                        )}
                    </div>
                    <div className='billing-details'>
                        {/* eslint-disable-next-line eqeqeq */}
                        <div id="total-section" className={`${selectedButtons.length > 0 ? 'diplayTotalBorder' : ''}`}>{selectedButtons.length === 0 ? '' : `Total  RS ${total.toFixed(2)}`}</div><br />
                        <div className="col-lg-3">
                            {selectedButtons.length !== 0 ? (
                                <>
                                    <button type="button" className="btn btn-success" onClick={saveAndPrint} disabled={selectedButtons.length === 0}>Save & Print</button>
                                    <button type="button" className="btn btn-danger" onClick={handleClear} disabled={selectedButtons.length === 0}>Clear All</button>
                                    <button type="button" className="btn btn-primary" onClick={kotAndPrint} disabled={selectedButtons.length === 0}>KOT & Print</button>
                                </>
                            ) : ''}
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    className="custom-modal"
                    contentLabel="Add Menu"
                >
                    <h4 style={{ paddingTop: '8px' }}>Add Menu</h4>
                    <form onSubmit={handleSubmit} className='form'>
                        <input
                            className='formInput'
                            type="text"
                            placeholder="Enter Menu"
                            value={newMenuItem}
                            required
                            onChange={(e) => setNewMenuItem(e.target.value)}
                        /><br />
                        <div className='formActions'>
                            <button className='formBtn' type="submit">Add</button>
                            <button className='formBtn' type="button" onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>

                {/* For sub menuitems */}

                <Modal
                    isOpen={isSubMenuModalOpen}
                    onRequestClose={closeSubMenuModal}
                    className="custom-modal-menu-item"
                    contentLabel="Add Menu Item"
                >
                    <h4 style={{ paddingTop: '8px' }}>Add Menu Item</h4>
                    <form onSubmit={handleSubMenuSubmit} className='menuItemForm'>
                        <select
                            className='formInput'
                            value={selectedMainMenu}
                            onChange={(e) => setSelectedMainMenu(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Main Menu</option>
                            {section1Data.map((menuItem, index) => (
                                <option key={index} value={menuItem.itemName}>
                                    {menuItem.itemName.toUpperCase()}
                                </option>
                            ))}
                        </select><br />
                        <input
                            className='formInput'
                            type="text"
                            placeholder="Enter Menu Item"
                            value={newSubMenuItem}
                            onChange={(e) => setNewSubMenuItem(e.target.value)}
                            required
                        /><br />
                        <input
                            className='formSubMenuInput'
                            type="number"
                            placeholder="Enter Price"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            required
                        /><br />
                        <div className='formActions'>
                            <button className='formBtn' type="submit">Add</button>
                            <button className='formBtn' type="button" onClick={closeSubMenuModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            </main>
        </div>
    );
}

export default Home;
