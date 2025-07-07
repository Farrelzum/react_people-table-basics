import './App.scss';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import classNames from 'classnames';
import { HomePage } from './components/HomePage/HomePage';
import { PeoplePage } from './components/PeoplePage/PeoplePage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { PeopleTable } from './components/PeopleTable/PeopleTable';
import { useEffect, useState } from 'react';
import { getPeople } from './api';
import { Person } from './types';

export const App = () => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoadingPeople, setIsLoadingPeople] = useState<boolean>(false);
  const [fetchPeopleError, setFetchPeopleError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingPeople(true);
    setFetchPeopleError(false);

    getPeople()
      .then((data: Person[]) => {
        setPeople(data);
      })
      .catch(() => {
        setFetchPeopleError(true);
      })
      .finally(() => setIsLoadingPeople(false));
  }, []);

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink
              to={'/'}
              className={({ isActive }) =>
                classNames('navbar-item', {
                  'has-background-grey-lighter': isActive,
                })
              }
            >
              Home
            </NavLink>
            <NavLink
              to={'/people'}
              className={({ isActive }) =>
                classNames('navbar-item', {
                  'has-background-grey-lighter': isActive,
                })
              }
            >
              People
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/home" element={<Navigate to={'/'} replace />}></Route>

            <Route
              path="/people"
              element={
                <PeoplePage
                  isLoadingPeople={isLoadingPeople}
                  fetchPeopleError={fetchPeopleError}
                />
              }
            >
              <Route index element={<PeopleTable people={people} />}></Route>
              <Route
                path="/people/:slug"
                element={<PeopleTable people={people} />}
              ></Route>
            </Route>

            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </div>
      </main>
    </div>
  );
};
