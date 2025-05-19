import { Header } from '../Header/index.jsx';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/index.jsx';

function Layout() {
    return (
        <div className='app-wrapper d-flex flex-column min-vh-100'>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;