import React from 'react';
import { Link, useMatch } from 'react-router-dom';
import { classNames } from '../index';

function NavbarLink({ name, exact, path, className }) {
  const match = useMatch({
    path,
    exact,
  });

  return (
    <Link
      key={name}
      to={path}
      className={`${className} ${classNames(
        match
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'px-3 py-2 rounded-md text-sm font-medium'
      )}`}
      aria-current={path ? 'page' : undefined}
    >
      {name}
    </Link>
  );
}

export default NavbarLink;
