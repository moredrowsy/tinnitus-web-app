import React from 'react';
import { NavLink } from 'react-router-dom';

function NavbarLink({ name, exact, path, className }) {
  return (
    <NavLink
      key={name}
      to={path}
      className={({ isActive }) =>
        `${
          isActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        } px-3 py-2 rounded-md text-sm font-medium`
      }
      aria-current={path ? 'page' : undefined}
    >
      {name}
    </NavLink>
  );
}

export default NavbarLink;
