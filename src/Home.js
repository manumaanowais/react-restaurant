import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from './Header';
import { useParams } from 'react-router-dom';

function Home({ gridItemsData }) {
    const { id } = useParams();
    const selectedItem = gridItemsData.find(item => item.id === parseInt(id));

  const [timer, setTimer] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
          setTimer(prev => prev + 1);
          if(selectedItem) {
            selectedItem.timer = timer;
          }
        }, 1000);
        return () => clearInterval(interval);
      }, [timer]);

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
    const [section2Content, setSection2Content] = useState([]);
    const [selectedButtons, setSelectedButtons] = useState([]);

    const buttonData = {
        "mandi": [
            { label: "Chicken Mandi", price: "250" },
            { label: "Mutton Mandi", price: "300" },
            { label: "Fish Mandi", price: "350" },
            { label: "Prawns Mandi", price: "400" },
            { label: "Laham Mandi", price: "380" },
            { label: "Bbq Mandi", price: "410" },

        ],
        "biryani": [
            { label: "Chicken Biryani", price: "150" },
            { label: "Mutton Birayni", price: "200" },
            { label: "Chicken Biryani Family", price: "400" }
        ],
        "curry": [
            { label: "Mutton Curry", price: "100" },
            { label: "Chicken Curry", price: "80" },
            { label: "Fish Curry", price: "120" }
        ],
        "fish": [
            { label: "Nellore Fish", price: "120" },
            { label: "Fish Nahari", price: "150" },
            { label: "Fish Tadaka", price: "100" }
        ],
        "mutton": [
            { label: "Mutton Nahari", price: "150" },
            { label: "Mutton Masala", price: "130" },
            { label: "Mutton Tadaka", price: "120" }
        ],
    };

    const showSection2Content = (buttonId) => {
        const content = buttonData[buttonId].map((button) => ({
            label: button.label,
            price: button.price,
        }));

        setSection2Content(content);
    };

    const addSection3Content = (buttonLabel, buttonPrice) => {
        const updatedButtonCountMap = { ...buttonCountMap };

        if (!updatedButtonCountMap[buttonLabel]) {
            updatedButtonCountMap[buttonLabel] = { count: 1, price: parseFloat(buttonPrice) };
            setSelectedButtons([...selectedButtons, buttonLabel]);
        } else {
            updatedButtonCountMap[buttonLabel].count++;
            updatedButtonCountMap[buttonLabel].price += parseFloat(buttonPrice);
        }

        setButtonCountMap(updatedButtonCountMap);

        // Updating the total price
        setTotal((prevTotal) => prevTotal + parseFloat(buttonPrice));
    };

    const updateQuantity = (buttonLabel, change, buttonPrice) => {
        const updatedButtonCountMap = { ...buttonCountMap };
        let itemPrice = 0;

        for (const categoryKey of Object.keys(buttonData)) {
            const matchingItem = buttonData[categoryKey].find(item => item.label === buttonLabel);
            if (matchingItem) {
                itemPrice = parseFloat(matchingItem.price);
                break;
            }
        }

        if (updatedButtonCountMap[buttonLabel]) {
            updatedButtonCountMap[buttonLabel].count += change;

            if (updatedButtonCountMap[buttonLabel].count <= 0) {
                delete updatedButtonCountMap[buttonLabel];
                setSelectedButtons(selectedButtons.filter(label => label !== buttonLabel));
            } else {
                if (itemPrice !== 0) {
                    updatedButtonCountMap[buttonLabel].price += change * itemPrice;
                }
            }

            setButtonCountMap(updatedButtonCountMap);
            const newTotal = Object.values(updatedButtonCountMap).reduce((acc, item) => {
                return acc + item.price;
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
                <div className="section" style={{ width: '20%' }}>
                    <h2>Menu Items</h2>
                    <div id="section1">
                        <div className="section1">
                            <button className="btn" id="mandi" onClick={() => showSection2Content('mandi')}> Mandi </button>
                        </div><br></br>
                        <div className="section1">
                            <button className="btn" id="biryani" onClick={() => showSection2Content('biryani')}>Biryani</button>
                        </div><br></br>
                        <div className="section1">
                            <button className="btn" id="curry" onClick={() => showSection2Content('curry')}>Curries</button>
                        </div><br></br>
                        <div className="section1">
                            <button className="btn" id="fish" onClick={() => showSection2Content('fish')}>Fish</button>
                        </div><br></br>
                        <div className="section1">
                            <button className="btn" id="mutton" onClick={() => showSection2Content('mutton')}>Mutton</button>
                        </div><br></br>
                    </div>
                </div>
                <div className="section">
                    <h2>Items</h2>
                    <div id="section2-content">
                        {section2Content.length > 0 ? (
                            <div className="section2-content-buttons">
                                {section2Content.map((button, index) => (
                                    <button className='section2-content-buttons-btn'
                                        key={index}
                                        onClick={() => addSection3Content(button.label, button.price)}
                                    >
                                        {button.label} <br></br> ({button.price})
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p>Select a menu item to see its options.</p>
                        )}
                    </div>
                </div>
                <div className="section">
                    <h2>Billing Details</h2>
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
                                                <button className='decrement-btn' onClick={() => updateQuantity(buttonLabel, -1, buttonCountMap[buttonLabel]?.price)}>-</button>
                                                <span>{buttonCountMap[buttonLabel]?.count}</span>
                                                <button className='increment-btn' onClick={() => updateQuantity(buttonLabel, 1, buttonCountMap[buttonLabel]?.price)}>+</button>
                                            </td>
                                            <td>{buttonCountMap[buttonLabel]?.price.toFixed(2)}</td>
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
                        <div id="total-section">Total : RS {total.toFixed(2) == 0 ? selectedItem?.price : total.toFixed(2)}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;