import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home';
import { MailDetails } from './cmps/MailDetails';
export function App() {

    return (
        <Router>
            <section className='main-app'>

                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Home />} />
                        <Route path='/inbox' element={<Home />} >
                            <Route path='/inbox/:mailId' element={<MailDetails />} />
                        </Route>
                        <Route path='/sent' element={<Home />} >
                            <Route path='/sent/:mailId' element={<MailDetails />} />
                        </Route>
                        <Route path='/trash' element={<Home />} >
                            <Route path='/trash/:mailId' element={<MailDetails />} />
                        </Route>
                        <Route path='/starred' element={<Home />} >
                            <Route path='/starred/:mailId' element={<MailDetails />} />
                        </Route>
                        <Route path='/all-mail' element={<Home />} >
                            <Route path='/all-mail/:mailId' element={<MailDetails />} />
                        </Route>
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

