import { useState, useRef, useEffect } from 'react';
import '../styles/customDropdown.scss';

const CustomDropdown = ({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen) {
      if (highlightedIndex !== -1 && optionsRef.current[highlightedIndex]) {
        optionsRef.current[highlightedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex !== -1) {
          onChange({ target: { value: options[highlightedIndex].value } });
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      className={`custom-dropdown ${disabled ? 'disabled' : ''}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`dropdown-header ${!selectedOption ? 'placeholder' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <ul className="dropdown-list" role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => (optionsRef.current[index] = el)}
              className={`dropdown-option ${
                highlightedIndex === index ? 'highlighted' : ''
              } ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;