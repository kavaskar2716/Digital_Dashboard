import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import { authActions,userActions } from '_store';


export { Nav };

function Nav() {
    const authUser = useSelector(x => x.auth.user);
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
    const [localStorageValue,setLocalStorageValue] = useState();
    useEffect(() => {
        dispatch(userActions.getAll());

        const storedName = localStorage.getItem('UserName');
        // Check if storedName is not null before calling replace
        const storedName1 = storedName ? storedName.replace(/"/g, '') : '';

        // Set the retrieved value in component state
        if (storedName1) {
          setLocalStorageValue(storedName1);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // only show nav when logged in
    if (!authUser) return null;
    return (
        <nav className="navbar navbar-expand navbar-white">
            <div className="navbar-nav">
                <div class="row">
                    <div class="col-2">
                    <img src="/logo1.png" alt="Logo" class="logn"/>
                    </div>
                    <div class="col-5">
                        <h4 class="engg">DIGITAL TRANSFORMATION</h4>
                    </div>
                    <div class="col-5">
                    <button onClick={logout} className="btn btn-link nav-item nav-link home"><i class="fa fa-sign-out wel"></i>Logout</button>
                    <NavLink to="/" className="nav-item nav-link home"><b><i class="fa fa-user wel"></i>Welcome </b>{localStorageValue}</NavLink>
                    <NavLink to="/dashboard" className="nav-item nav-link home"><b><i class="fa fa-home wel"></i> </b></NavLink>
                    </div>
                </div>


            </div>
        </nav>
    );
}