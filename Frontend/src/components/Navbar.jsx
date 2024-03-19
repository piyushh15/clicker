import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    // Check if the authentication token exists in localStorage
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken); // Set isLoggedIn based on the presence of authToken
  };

  useEffect(() => {
    checkLoginStatus();
  }, []); // Run the check when the component mounts

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); // Update state to reflect user logout
    navigate('/'); // Navigate to the default page
  };

  return (
    <header className='padding-x py-8 absolute z-10 w-full'>
      <nav className='flex justify-between items-center max-container'>
        <a href="/">
          <span className="font-montserrat">SecureCar</span>
        </a>

        <ul className='flex-1 flex justify-end items-center gap-16 max-lg:hidden'>
          <li className="list-none"><Link className="font-montserrat" aria-current="page" to="/">Home</Link></li>
          {isLoggedIn ? (
            <>
              <li className="list-none"><Link className="font-montserrat" aria-current="page" to="/data">Data</Link></li>
              <li className="list-none"><button className="font-montserrat" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li className="list-none"><Link className="font-montserrat" aria-current="page" to="/login">Login</Link></li>
              <li className="list-none"><Link className="font-montserrat" aria-current="page" to="/createuser">SignUp</Link></li>
            </>
          )}
        </ul>

        <div className='hidden max-lg:block'>
          {/* Additional content for larger screens if needed */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
