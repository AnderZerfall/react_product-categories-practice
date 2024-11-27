/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function GetCategoryById(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId);
}

function GetUserById(userId) {
  return usersFromServer.find(user => user.id === userId);
}

export const products = productsFromServer.map(product => {
  const category = GetCategoryById(product.categoryId);
  const user = GetUserById(category.ownerId);

  return { ...product, category, owner: user };
});

export const filterAndSortProducts = (prods, params) => {
  const { query, selectedCategory, selectedUser, sortBy, sortType } = params;

  return prods
    .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
    .filter(product => {
      if (selectedCategory === 'all') return true;

      return product.category.title === selectedCategory;
    })
    .filter(product => {
      if (selectedUser === 'all') return true;

      return product.owner.name === selectedUser;
    })
    .toSorted((product1, product2) => {
      if (sortBy === 'id') {
        if (sortType === 'asc') {
          return product1.id - product2.id;
        }

        if (sortType === 'desc') {
          return product2.id - product1.id;
        }
      }

      if (sortBy === 'product') {
        if (sortType === 'asc') {
          return product1.name.localeCompare(product2.name);
        }

        if (sortType === 'desc') {
          return product2.name.localeCompare(product1.name);
        }
      }

      if (sortBy === 'category') {
        if (sortType === 'asc') {
          return product1.category.title.localeCompare(product2.category.title);
        }

        if (sortType === 'desc') {
          return product2.category.title.localeCompare(product1.category.title);
        }
      }

      if (sortBy === 'user') {
        if (sortType === 'asc') {
          return product1.owner.name.localeCompare(product2.owner.name);
        }

        if (sortType === 'desc') {
          return product2.owner.name.localeCompare(product1.owner.name);
        }
      }

      return 0;
    });
};

export const App = () => {
  const [sortBy, setSortBy] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [sortType, setSortType] = useState('');
  const [query, setQuery] = useState('');

  const onReset = () => {
    setQuery('');
    setSortBy(null);
    setSelectedCategory('all');
  };

  const handleSortByAndType = by => {
    if (sortType === 'asc') {
      setSortType('desc');
    } else if (sortType === 'desc') {
      setSortType('');
    } else {
      setSortType('asc');
    }

    setSortBy(by);
  };

  const handleIconChange = categoryType => {
    if (sortBy === categoryType) {
      if (sortType === 'asc') {
        return 'fa-sort-up';
      }

      if (sortType === 'desc') {
        return 'fa-sort-down';
      }
    }

    return 'fa-sort';
  };

  const sortedProducts = filterAndSortProducts(products, {
    query,
    selectedCategory,
    selectedUser,
    sortBy,
    sortType,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser('all')}
                className={classNames(selectedUser === 'all' && 'is-active')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user}
                  onClick={() => setSelectedUser(user.name)}
                  className={classNames(
                    selectedUser === user.name && 'is-active',
                  )}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button',
                  'is-success',
                  'mr-6',
                  selectedCategory !== 'all' && 'is-outlined',
                )}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames(
                    'button',
                    'mr-2',
                    'my-1',
                    selectedCategory === category.title && 'is-info',
                  )}
                  href="#/"
                  key={category}
                  onClick={() => setSelectedCategory(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => onReset()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {sortedProducts.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={() => handleSortByAndType('id')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              handleIconChange('id'),
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={() => handleSortByAndType('product')}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              handleIconChange('product'),
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={() => handleSortByAndType('category')}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              handleIconChange('category'),
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={() => handleSortByAndType('user')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              handleIconChange('user'),
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedProducts.map(product => (
                  <tr data-cy="Product" key={product}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames(
                        product.owner.sex === 'f'
                          ? 'has-text-danger'
                          : 'has-text-link',
                      )}
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
