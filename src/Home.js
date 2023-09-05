import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');
function Home({ gridItemsData }) {
    const [section1Data, setSection1Data] = useState([]);

    const [data, setData] = useState([]);
    const { id } = useParams();

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

    const [selectedButtonSection1, setSelectedButtonSection1] = useState(null);
    const [selectedButtonSection2, setSelectedButtonSection2] = useState(null);

    const selectedItem = gridItemsData.find(item => item.id === parseInt(id));

    const [timer, setTimer] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
            if (selectedItem) {
                selectedItem.timer = timer;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, selectedItem]);

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
            updatedButtonCountMap[buttonLabel] = { count: 1, itemPrice: buttonPrice };
            setSelectedButtons([...selectedButtons, buttonLabel]);
        } else {
            updatedButtonCountMap[buttonLabel].count++;
            updatedButtonCountMap[buttonLabel].itemPrice += buttonPrice;
        }

        setButtonCountMap(updatedButtonCountMap);

        setTotal((prevTotal) => prevTotal + buttonPrice);
    };

    const updateQuantity = (buttonLabel, change, buttonPrice) => {
        const updatedButtonCountMap = { ...buttonCountMap };
        let price = 0;

        for (const item of data) {
            if (item.itemName === buttonLabel) {
                price = parseFloat(item.itemPrice);
                break;
            }
        }

        if (updatedButtonCountMap[buttonLabel]) {
            updatedButtonCountMap[buttonLabel].count += change;

            if (updatedButtonCountMap[buttonLabel].count <= 0) {
                delete updatedButtonCountMap[buttonLabel];
                setSelectedButtons(selectedButtons.filter(label => label !== buttonLabel));
            } else {
                if (price !== 0) {
                    updatedButtonCountMap[buttonLabel].itemPrice += change * price;
                }
            }

            setButtonCountMap(updatedButtonCountMap);
            const newTotal = Object.values(updatedButtonCountMap).reduce((acc, item) => {
                return acc + item.itemPrice;
            }, 0);

            setTotal(newTotal);
        }
    };

    const handlePrint = () => {
        var printableContent = document.getElementById('section3-content').innerHTML + "<br><br>";
        printableContent += document.getElementById('total-section').innerHTML;

        const printWindow = window.open('', '', 'height=900, width=1200');

        printWindow.document.write('<html>');
        printWindow.document.write('<head>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          .decrement-btn,
          .increment-btn {
            display: none;
          }

          .billing-table {
            border: none;
            margin: 50px;
          }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head>');
        printWindow.document.write('<body>');

        printWindow.document.write('<h1>Restaurant</h1><p>Hyderabad Telangana State</p><br>');
        printWindow.document.write(printableContent);

        printWindow.document.write('</body></html>');
        printWindow.document.close();

        printWindow.print();
        printWindow.close();
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
                console.log('New menu item added successfully:', data);
                setSection1Data([...section1Data, newMenuItemData]);
                setNewMenuItem('');
                closeModal();
            })
            .catch((error) => {
                console.error('Error adding new menu item:', error);
            });
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
                console.log('New item added:', result);
            })
            .catch((error) => {
                console.error('Error adding new item:', error);
            });

        setNewSubMenuItem('');
        setNewItemPrice('');
        setSelectedMainMenu('');
        closeSubMenuModal();
    };

    return (
        <div className="Home">
            <Header />
            <div className='add-buttons'>
                <button className="btn" onClick={openModal}>Add Menu</button>
                <button className="btn" onClick={openSubMenuModal}>Add Menu Item</button>
            </div>
            <main className="Home-main">
                <div className="section" style={{ width: '15%' }}>
                    <h4>Menu Items</h4>
                    {section1Data.length > 0 ? (
                    <div id="section1">
                        {section1Data.map((menuItem,index) => (
                            <div className='section1' key={index}>
                                <Link to={`/${menuItem.id}`}>
                                    <button
                                        className={`btn ${selectedButtonSection1 === menuItem.itemName ? 'selected' : ''}`}
                                        onClick={() => { setSelectedButtonSection1(menuItem.itemName); showSection2Content(menuItem.itemName) }}
                                    >
                                        {menuItem.itemName}
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    ):(
                        <p>Add Menues</p>
                    )}
                </div>
                <div className="section">
                    <h4>Items</h4>
                    <div id="section2-content">
                        {data.length > 0 ? (
                            <div className="section2-content-buttons">
                                {data.map((menuItem, index) => (
                                    <button
                                        className={`section2-content-buttons-btn ${selectedButtonSection2 === menuItem.itemName ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => {
                                            setSelectedButtonSection2(menuItem.itemName);
                                            addSection3Content(menuItem.itemName, menuItem.itemPrice);
                                        }}
                                    >
                                        {menuItem.itemName} <br /> ({menuItem.itemPrice})
                                    </button>
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
                                                <button className='decrement-btn' onClick={() => updateQuantity(buttonLabel, -1, buttonCountMap[buttonLabel].itemPrice)}>-</button>
                                                <span>{buttonCountMap[buttonLabel]?.count}</span>
                                                <button className='increment-btn' onClick={() => updateQuantity(buttonLabel, 1, buttonCountMap[buttonLabel].itemPrice)}>+</button>
                                            </td>
                                            <td>{buttonCountMap[buttonLabel].itemPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>
                                {selectedItem ? (
                                    <><h6>Table {selectedItem.id} is occupied from {formatTime(selectedItem?.timer)}</h6>
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
                                                    <td>{selectedItem.items}</td>
                                                    <td><span>{selectedItem.quantity}</span></td>
                                                    <td>{selectedItem.price}</td>
                                                </tr>
                                            </tbody>
                                        </table></>
                                ) : (
                                    <p>No item found.</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='billing-details'>
                        <div className="col-lg-3">
                            <button type="button" className="btn btn-outline" onClick={handlePrint} disabled={selectedButtons.length === 0}>Save & Print</button>
                            <button type="button" className="btn btn-outline" onClick={handlePrint} disabled={selectedButtons.length === 0}>Clear All</button>
                        </div>
                        {/* eslint-disable-next-line eqeqeq */}
                        <div id="total-section">Total : RS {total.toFixed(2) == 0 ? selectedItem?.price : total.toFixed(2)}</div>
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
                        onRequestClose={closeModal}
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
                            </select><br/>
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
                </div>
            </main>
        </div>
    );
}

export default Home;
