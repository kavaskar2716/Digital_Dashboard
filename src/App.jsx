import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { Nav, PrivateRoute } from '_components';
import CsaInput from './csainput/CsaInput';
import { Login } from 'login';
import ParentComponent from 'csainput/parentcomponent';
import ChildComponent from 'csainput/childcomponent';
import DashboardComponent from 'csainput/dashboard';



export { App };

function App() {
    // init custom history object to allow navigation from
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (

        <div className="app-container bg-light container-fluid">

            <Nav />
            <div className=".container-fluid pt-4 pb-4">
                <Routes>
                <Route path="/" element={<PrivateRoute><CsaInput /></PrivateRoute> }/>
                <Route path="/login" element={<Login />} />
                <Route path="/parentcomponent" element={<PrivateRoute><ParentComponent /></PrivateRoute>} />
                <Route path="/childcomponent" element={<PrivateRoute><ChildComponent /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardComponent /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}
