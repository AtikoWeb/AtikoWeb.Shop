import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedCategory} from '../../redux/slices/categorySlice';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {FaChevronRight} from 'react-icons/fa6';
import {Button} from "@nextui-org/react";

function CategoriesList({display, isSearch}) {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = categories.categories.items.category;
    const selectedCategory = useSelector(
        (state) => state.categories.selectedCategory
    );

    const onClick = (category) => {
        dispatch(setSelectedCategory(category.id));

        if (selectedCategory !== category) {
            navigate(`/category/${category.id}`);
        }
    };

    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;


    return (
        <>
            {isSearch ? (
                <div className="grid grid-cols-1 gap-5">
                    {isCategoriesLoading || isCategoriesError ? (
                        <></>
                    ) : (
                        CategoriesItems &&
                        CategoriesItems.map((obj, index) =>
                            isCategoriesLoading || isCategoriesError ? (
                                ''
                            ) : (
                                <>
                                    <motion.div
                                        key="CategoryList"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.8, delay: 0.2}}
                                    >

                                        <Button
                                            key={obj.id}
                                            onClick={() => onClick(obj)}
                                            className={`relative flex bg-neutral-200/60 justify-between items-center text-left w-full text-md font-semibold rounded-xl h-14`}
                                            data-id={obj.id}
                                        >
                                            <div className={'flex justify-center items-center gap-5'}>
                                                <img
                                                    src={`${API_URL_IMAGES}/category_${(obj.id)}.png`}
                                                    alt=''
                                                    className='h-14 object-contain'
                                                />
                                                {obj.name}
                                            </div>
                                            <FaChevronRight className='text-neutral-400'/>
                                        </Button>


                                    </motion.div>


                                </>
                            )
                        )
                    )}
                </div>
            ) : (
                <div
                    className={`overflow-x-scroll scrollbar-hide z-10 rounded-b-3xl ${
                        display === 'flex' && 'flex'
                    } lg:grid lg:grid-cols-1 gap-3 overflow-hidden px-3`}
                    ref={containerRef}
                >
                    {isCategoriesLoading || isCategoriesError ? (
                        <></>
                    ) : (
                        CategoriesItems &&
                        CategoriesItems.map((obj, index) =>
                            isCategoriesLoading || isCategoriesError ? (
                                ''
                            ) : (
                                <>
                                    <div
                                        key={obj.id}
                                        className=''
                                    >
                                        <button
                                            onClick={() => onClick(obj)}
                                            className={`relative ${
                                                display === 'flex'
                                                    ? 'w-52 bg-neutral-200/60'
                                                    : 'w-full text-left'
                                            }  flex items-center gap-1 text-md ${
                                                selectedCategory === obj.id
                                                    ? 'bg-neutral-200/60 px-1'
                                                    : ''
                                            } font-medium rounded-xl h-12 mb-3`}
                                            data-id={obj.id}
                                        >
                                            <img
                                                src={`${API_URL_IMAGES}/category_${(obj.id)}.png`}
                                                alt=''
                                                className='h-9 rounded-md'
                                            />
                                            {obj.name}
                                        </button>
                                    </div>
                                </>
                            )
                        )
                    )}
                </div>
            )}
        </>
    );
}

export default CategoriesList;
