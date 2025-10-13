import React, { useState, useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import type { Person } from '../../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onClearSelected: () => void;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  onClearSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [appliedInputValue, setAppliedInputValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const applyInputValue = useMemo(
    () => debounce(setAppliedInputValue, delay),
    [delay],
  );

  useEffect(() => () => applyInputValue.cancel(), [applyInputValue]);

  const filteredPeople = useMemo(() => {
    const query = appliedInputValue.trim().toLowerCase();

    if (isFocus && !query) {
      return people;
    }

    return people.filter(person => {
      const normalizedName = person.name.toLowerCase();

      return normalizedName.includes(query);
    });
  }, [people, appliedInputValue, isFocus]);

  const hasSuggestions = Boolean(filteredPeople.length);

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const text = changeEvent.target.value;
    const nextText = text.trim();

    setInputValue(text);
    if (nextText === appliedInputValue) {
      return;
    }

    applyInputValue(nextText);

    onClearSelected();
  };

  const handleClick = (currentPerson: Person) => {
    setInputValue(currentPerson.name);
    setAppliedInputValue(currentPerson.name);
    inputRef.current?.blur();
    setIsFocus(false);

    onSelect(currentPerson);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isFocus && hasSuggestions,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            ref={inputRef}
            data-cy="search-input"
            value={inputValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleChange}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                id={person.slug}
                role="button"
                onClick={() => handleClick(person)}
                tabIndex={0}
                onKeyDown={(
                  keyBoardEvent: React.KeyboardEvent<HTMLDivElement>,
                ) => {
                  if (
                    keyBoardEvent.key === 'Enter' ||
                    keyBoardEvent.key === ' '
                  ) {
                    handleClick(person);
                  }
                }}
                onMouseDown={mouseEvent => mouseEvent.preventDefault()}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!hasSuggestions && appliedInputValue.trim() !== '' && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
