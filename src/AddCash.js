import React, { useState } from 'react';
import './AddCash.css';
import Header from './Header';

const AddCash = () => {
    const [inputValues, setInputValues] = useState(Array(6).fill(0));
    const notes = [500, 200, 100, 50, 20, 10];

    const handleInputChange = (e, index) => {
        const inputValue = e.target.value;
        if (inputValue >= 0) {
            const count = isNaN(inputValue) ? 0 : inputValue;
            const newInputValues = [...inputValues];
            newInputValues[index] = count;
            setInputValues(newInputValues);
        }
    };

    const totalValue = inputValues.reduce((total, count, index) => {
        return total + notes[index] * count;
    }, 0);

    const handleAddNotes = () => {
        alert("Add notes clicked")
    }

    const handleClear = () => {
        setInputValues(Array(6).fill(0));
    };

    return (
        <div className="add-cash">
            <Header />
            <div className="Cash-form-container">
                <form className="Cash-form">
                    <div className="Cash-form-content">
                        <h3 className="Cash-form-title">Add Cash</h3>
                        <div className='Cash-form-table'>
                            <table className='Cash-table'>
                                <thead>
                                    <tr>
                                        <th className='note-th'>Notes</th>
                                        <th className='x-th'></th>
                                        <th className='input-th'>Count</th>
                                        <th className='total-th'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes.map((note, index) => (
                                        <tr key={index}>
                                            <td className='note-td'>{note}</td>
                                            <td className='x-td'>X</td>
                                            <td className='input-td'>
                                                <input
                                                    className='input-td-input'
                                                    type="number"
                                                    value={inputValues[index]}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                            </td>
                                            <td className='total-td'>{note * inputValues[index]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='total-value'>
                            <b>Total Amount In Cash : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" name="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
                            </svg>{totalValue}</b>
                        </div>
                        <div className='action-buttons'>
                            <button type='button' className='btn btn-primary' onClick={handleAddNotes}>Add Notes</button>
                            <button type='button' className='btn btn-primary' onClick={handleClear}>Clear All</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCash;
