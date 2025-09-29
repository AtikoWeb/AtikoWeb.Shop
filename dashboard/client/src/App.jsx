import './App.css';
import Detail from "./screens/Detail.jsx";
import {AnimatePresence, motion} from 'framer-motion';
import {Route, Routes} from "react-router-dom";
import Home from "./screens/Home.jsx";

function App() {

    return (
        <>
            <div className={'h-screen bg-[#F2F2F7]'}>
                <AnimatePresence
                    mode='wait'
                    onExitComplete={() => handlePageChange(null)}
                >
                    <Routes>
                        <Route
                            key={'Home'}
                            path='/'
                            element={
                                <motion.div
                                    key='Home'
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.1, delay: 0.2}}
                                >
                                    <Home/>
                                </motion.div>
                            }
                        />

                        <Route
                            key={'Detail'}
                            path='/server/:id'
                            element={
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.1, delay: 0.2}}
                                >
                                    <Detail/>
                                </motion.div>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </div>


        </>
    )
}

export default App
