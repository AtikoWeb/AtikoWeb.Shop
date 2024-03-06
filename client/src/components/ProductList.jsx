import React, {useEffect, useState} from 'react';
import ProductCard from './ProductCard';
import axios from '../../axios';
import {Spinner} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


function ProductList({display = 'grid', isUpload = false, isHome}) {
    const products = useSelector((state) => state.products);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isProductsLoading = products.products.status === 'loading';
    const isProductsError = products.products.status === 'error';
    const productsItems = products.products.items;
    const totalCount = products.products.totalCount;
    const [images, setImages] = useState([]);
    const [columnCount, setColumnCount] = useState(3);
    const navigate = useNavigate();


    const fetchImages = () => {
        axios
            .get(`/images/get-images`)
            .then((res) => {
                setImages(res.data);
            })
            .catch((err) => {
                console.warn(err);
            });
    };

    useEffect(() => {
        fetchImages();
    }, []);


    useEffect(() => {
        axios
            .get(`/settings/`)
            .then((res) => {
                setColumnCount(res.data.config.column_count)
            })
            .catch((err) => {
                console.warn(err);
            });
    }, []);

    const clickProduct = (product) => {
        navigate(`/detailview/${product.productId}`, {
            state: {
                MobileProduct: product,
            },
        });
    };


    const renderProducts = () => {
        return (
            <div>
                {productsItems.length > 0 ? (

                    <div
                        className={`${display === 'grid' && 'grid'} ${
                            isMobile && columnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'
                        } ${
                            display === 'flex' && 'flex px-3'
                        } ${isUpload && 'grid-cols-2 lg:grid-cols-5'} snap-x overflow-x-scroll gap-3`}
                    >
                        {productsItems.map((product, index) => (
                            <div>
                                <ProductCard
                                    key={index}
                                    art={product.art}
                                    name={product.name}
                                    price={product.price}
                                    images={images}
                                    productId={product.productId}
                                    brand={product.brand}
                                    category={product.category}
                                    onClick={() => clickProduct(product)}
                                    isLoading={isProductsLoading}
                                    weight={
                                        display === 'flex' ? 'w-44' : columnCount === 3 ? 'w-44' : 'w-full'
                                    }
                                    isUpload={isUpload}
                                />
                            </div>
                        ))}
                    </div>

                ) : (
                    <>
                        <div className='w-screen mt-52 h-52'>
                            <div className={'flex justify-center items-center'}>
                                <span className={'text-xl'}>Ничего не найдено :(</span>
                            </div>
                        </div>
                    </>
                )}


            </div>
        );
    };

    return (
        <div>
            {isProductsLoading || isProductsError ? (
                <div className='flex w-screen justify-center items-center'>
                    <Spinner/>
                </div>
            ) : (
                <>
                    {renderProducts()}
                </>
            )}
        </div>
    );
}

export default ProductList;