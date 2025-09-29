import React from 'react';
import Category from './Category';
import Search from './Search';
import {AnimatePresence, motion} from 'framer-motion';
import {Route, Routes} from 'react-router-dom';

function CenterPanel() {
    return (
        <div>
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
                                key='Detail'
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
                        key={'Search'}
                        path='/search'
                        element={
                            <motion.div
                                key='Search'
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.1, delay: 0.2}}
                            >
                                <Search/>
                            </motion.div>
                        }
                    />
                    <Route
                        key={'Category'}
                        path='/category/:id'
                        element={
                            <motion.div
                                key='Category'
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.1, delay: 0.2}}
                            >
                                <Category/>
                            </motion.div>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default CenterPanel;
