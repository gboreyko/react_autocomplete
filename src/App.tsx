import React, { useState } from 'react';
import './App.scss';
import { Dropdown } from './components/Dropdown';
import { peopleFromServer } from './data/people';
import type { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleClearSelected = (person: Person) => {
    setSelectedPerson(person);
  };

  const clearSelected = () => {
    if (selectedPerson) {
      setSelectedPerson(null);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          people={peopleFromServer}
          onSelected={handleClearSelected}
          onClearSelected={clearSelected}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
