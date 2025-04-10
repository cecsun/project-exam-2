import { Header } from '../Header/index.jsx';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/index.jsx';

function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;