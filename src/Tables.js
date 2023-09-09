import React, { useState, useEffect } from 'react';
import './Tables.css';
import Header from './Header';
import { Link } from 'react-router-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SortableGridItem = SortableElement(({ item }) => (
  <Link to={`/${item.id}`} className="grid-item">
    {item.name}<br />
    {item.sequence}
  </Link>
));

const SortableGrid = SortableContainer(({ items }) => (
  <div
    className="grid-3-columns"
    data-margin="20"
    data-item="grid-item"
    data-lightbox="gallery"
  >
    {items.map((item, index) => (
      <SortableGridItem key={item.id} index={index} item={item} />
    ))}
  </div>
));

function Tables() {
  const [tableData, setTableData] = useState([]);
  const [dragEnabled, setDragEnabled] = useState(false);

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
        if (Array.isArray(data)) {
          // Sort the data based on the 'sequence' property
          data.sort((a, b) => a.sequence - b.sequence);
          setTableData(data);
        } else {
          console.error('Fetched data is not in the expected array format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  //Form for adding table
  const [isTableOpen, setIsTableOpen] = useState(false);
    const [newTableName, setNewTableName] = useState('');

    const openTable = () => {
        setIsTableOpen(true);
    };
    const closeTable = () => {
        setIsTableOpen(false);
    };

    const handleTableSubmit = (e) => {
        if (newTableName.trim() === '') {
            return;
        }

        // let menuItemId = 0;
        // const menuItem = section1Data.find((item) => item.itemName === selectedMainMenu);
        // if (menuItem) {
        //     menuItemId = menuItem.id;
        // }
        const formData = {
          tableName: newTableName,
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
                console.log('New table added:', result);
            })
            .catch((error) => {
                console.error('Error adding new table:', error);
            });

        setNewTableName('');
        closeTable();
    };


  return (
    <div>
      <Header />
      <div className="container">
        <button onClick={() => setDragEnabled(!dragEnabled)} className="btn">
          {dragEnabled ? 'Stop Customization' : 'Customize Tables'}
        </button>
        <button className="btn" onClick={openTable}>Add Table</button>
        {tableData.length === 0 ? (
          <p>Loading...</p>
        ) : dragEnabled ? (
          <SortableGrid items={tableData} axis="xy" />
        ) : (
          <div
            className="grid-3-columns"
            data-margin="20"
            data-item="grid-item"
            data-lightbox="gallery"
          >
            {tableData.map((table) => (
              <Link to={`/${table.id}`} key={table.id} className="grid-item">
                {table.id}<br />
                {table.name}<br />
                {table.sequence}
              </Link>
            ))}
          </div>
        )}
      </div>

      
                {/* For Tables */}

                <Modal
                    isOpen={isTableOpen}
                    onRequestClose={closeTable}
                    className="custom-modal-menu-item"
                    contentLabel="Add Table"
                >
                    <h4 style={{ paddingTop: '8px' }}>Add Table</h4>
                    <form onSubmit={handleTableSubmit} className='tableForm'>
                        <input
                            className='formInput'
                            type="text"
                            placeholder="Enter Table Name"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            required
                        /><br />
                        <div className='formActions'>
                            <button className='formBtn' type="submit">Add</button>
                            <button className='formBtn' type="button" onClick={closeTable}>Cancel</button>
                        </div>
                    </form>
                </Modal>
    </div>
  );
}

export default Tables;
