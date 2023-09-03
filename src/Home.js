import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';

function Home({ gridItemsData }) {

    const [data, setData] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const apiUrl = `http://localhost:8080/mainmenu/${id}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((result) => {
                setData(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
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


    return (
        <div className="Home">
            <Header />
            <main className="Home-main">
                <div className="section" style={{ width: '15%' }}>
                    <h4>Menu Items</h4>
                    <div id="section1">
                        <div className='section1'>
                            <Link to="/1">
                                <button className={`btn ${selectedButtonSection1 === 'mandi' ? 'selected' : ''}`} id="mandi" onClick={() => { setSelectedButtonSection1('mandi'); showSection2Content('mandi') }}>Mandi</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/2">
                                <button className={`btn ${selectedButtonSection1 === 'biryani' ? 'selected' : ''}`} id="biryani" onClick={() => { setSelectedButtonSection1('biryani'); showSection2Content('biryani') }}>Biryani</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/3">
                                <button className={`btn ${selectedButtonSection1 === 'curry' ? 'selected' : ''}`} id="curry" onClick={() => { setSelectedButtonSection1('curry'); showSection2Content('curry') }}>Curries</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/4">
                                <button className={`btn ${selectedButtonSection1 === 'fish' ? 'selected' : ''}`} id="fish" onClick={() => { setSelectedButtonSection1('fish'); showSection2Content('fish') }}>Fish</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/5">
                                <button className={`btn ${selectedButtonSection1 === 'mutton' ? 'selected' : ''}`} id="mutton" onClick={() => { setSelectedButtonSection1('mutton'); showSection2Content('mutton') }}>Mutton</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/6">
                                <button className={`btn ${selectedButtonSection1 === 'prawns' ? 'selected' : ''}`} id="prawns" onClick={() => { setSelectedButtonSection1('prawns'); showSection2Content('prawns') }}>Prawns</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/7">
                                <button className={`btn ${selectedButtonSection1 === 'egg' ? 'selected' : ''}`} id="egg" onClick={() => { setSelectedButtonSection1('egg'); showSection2Content('egg') }}>Egg</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/8">
                                <button className={`btn ${selectedButtonSection1 === 'veg' ? 'selected' : ''}`} id="veg" onClick={() => { setSelectedButtonSection1('veg'); showSection2Content('veg') }}>Veg</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/9">
                                <button className={`btn ${selectedButtonSection1 === 'maggie' ? 'selected' : ''}`} id="maggie" onClick={() => { setSelectedButtonSection1('maggie'); showSection2Content('maggie') }}>Maggie</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/10">
                                <button className={`btn ${selectedButtonSection1 === 'meals' ? 'selected' : ''}`} id="meals" onClick={() => { setSelectedButtonSection1('meals'); showSection2Content('meals') }}>Meals</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/11">
                                <button className={`btn ${selectedButtonSection1 === 'tea' ? 'selected' : ''}`} id="tea" onClick={() => { setSelectedButtonSection1('tea'); showSection2Content('tea') }}>Tea</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/12">
                                <button className={`btn ${selectedButtonSection1 === 'coffee' ? 'selected' : ''}`} id="coffee" onClick={() => { setSelectedButtonSection1('coffee'); showSection2Content('coffee') }}>Coffee</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/13">
                                <button className={`btn ${selectedButtonSection1 === 'fastfood' ? 'selected' : ''}`} id="fastfood" onClick={() => { setSelectedButtonSection1('fastfood'); showSection2Content('fastfood') }}>Fast Food</button>
                            </Link>
                        </div>
                        <div className="section1">
                            <Link to="/14">
                                <button className={`btn ${selectedButtonSection1 === 'dessert' ? 'selected' : ''}`} id="dessert" onClick={() => { setSelectedButtonSection1('dessert'); showSection2Content('dessert') }}>Dessert</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <h4>Items</h4>
                    <div id="section2-content">
                        {data.length > 0 ? (
                            <div className="section2-content-buttons">
                                {data.map((menuItem) => (
                                    <button
                                        className={`section2-content-buttons-btn ${selectedButtonSection2 === menuItem.itemName ? 'selected' : ''}`}
                                        key={menuItem.id}
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
                                    {selectedButtons.map((buttonLabel) => (
                                        <tr key={buttonLabel}>
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
                            <button type="button" className="btn btn-outline" onClick={handlePrint} disabled={selectedButtons.length === 0}>Print Bill</button>
                        </div>
                        {/* eslint-disable-next-line eqeqeq */}
                        <div id="total-section">Total : RS {total.toFixed(2) == 0 ? selectedItem?.price : total.toFixed(2)}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
