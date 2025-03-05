
import React, { useState } from 'react';
import './index.css';

export default function Select(props) {
    const { defaultValue,options = [] ,onChange=()=>{}} = props;
    const [selectedOption, setSelectedOption] = useState(defaultValue || options[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(option)
    }
    return (
        <div className='form-select' >

            <div className='select-show' onClick={() => { setIsOpen(!isOpen) }}>
                {selectedOption.name}
                <div className='cursor-icon'>

                </div>
            </div>
            {isOpen && <div onMouseLeave={() => { setIsOpen(false) }} className='select-options'>
                {options.map((option, index) => {
                    return (
                        <div className={selectedOption.value === option.value ? 'select-option selected' : 'select-option'} key={index}
                            onClick={() => { handleClick(option) }}>
                            {option.name}
                        </div>
                    )
                })}
            </div>}
        </div>
    )
}