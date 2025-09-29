import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import CategoryCard from "./CategoryCard.jsx";
import {Button} from "@nextui-org/react";
import {FaChevronCircleRight} from "react-icons/fa";

function CategoriesList({display, isHome = false, images = [], isSearch = false}) {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const categories = useSelector((state) => state.categories);
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${db_code}/images/`
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = categories.categories.items.category;


    return (
        <>
            {isSearch ? (
                <div className="grid gap-5 grid-cols-1">
                    {isCategoriesLoading || isCategoriesError ? (
                        <></>
                    ) : (
                        CategoriesItems &&
                        CategoriesItems.map((obj, index) =>
                            isCategoriesLoading || isCategoriesError ? (
                                ''
                            ) : (
                                <>
                                    <CategoryCard isSearch={true}
                                                  images={images}
                                                  name={obj.name}
                                                  id={obj.id}/>


                                </>
                            )
                        )
                    )}
                </div>
            ) : isHome ? (
                    <div className={'flex gap-3'}>
                        <div className="grid gap-3 grid-rows-2 grid-flow-col">
                            {isCategoriesLoading || isCategoriesError ? (
                                <></>
                            ) : (
                                CategoriesItems &&
                                CategoriesItems.map((obj, index) =>
                                    isCategoriesLoading || isCategoriesError ? (
                                        ''
                                    ) : (
                                        <>
                                            <CategoryCard isHome={true}
                                                          images={images}
                                                          name={obj.name}
                                                          id={obj.id}/>


                                        </>
                                    )
                                )
                            )}

                        </div>


                        {CategoriesItems && CategoriesItems.length === 10 && (
                            <>
                                <Button onPress={() => navigate('/search')}
                                        className={'h-full place-content-center place-items-center bg-neutral-500 grid mx-3'}>

                                    <FaChevronCircleRight className={'text-5xl text-neutral-100'}/>

                                </Button>
                            </>
                        )}

                    </div>
                ) :
                (
                    <div
                        className={`overflow-x-scroll scrollbar-hide z-10 ${
                            display === 'flex' && 'flex'
                        } lg:grid lg:grid-cols-1 px-3 overflow-hidden`}
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
                                        <CategoryCard isHome={display === 'flex'}
                                                      images={images}
                                                      name={obj.name}
                                                      id={obj.id}/>
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
