import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AppHeader } from './cmps/AppHeader';
import { Home } from './pages/Home';
export function App() {

    return (
        <Router>
            <section className='main-app'>

                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

