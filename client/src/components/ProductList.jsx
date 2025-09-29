import React, {useEffect, useMemo, useState} from 'react';
import ProductCard from './ProductCard';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Cookies from "js-cookie";
import ModalWindow from "./Modal.jsx";
import DetailProduct from "../screens/DetailProduct.jsx";
import VisibilitySensor from 'react-visibility-sensor';

function ProductList({
                         display = 'grid',
                         categoryProducts = [],
                         isCategory,
                         settingsDBcode,
                         useReduxProducts = true,
                         isLoading = true,
                         isUpload = false,
                         marginBottom = 'mb-20',
                         onProductsView = () => {
                         }
                     }) {
    const images = useSelector(state => state.image.images.items);
    const imagesStatus = useSelector(state => state.image.images.status);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const columnCount = parseInt(localStorage.getItem('columnCount')) || 2;
    const navigate = useNavigate();
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const [open, setOpen] = useState(false);
    const [clickedProduct, setClickedProduct] = useState({});
    const db_code = Cookies.get('db_code') || settingsDBcode;
    const productsRedux = useSelector((state) => state.products);
    const isProductsLoading = productsRedux.products.status === 'loading';
    const isProductsError = productsRedux.products.status === 'error';
    const productsItems = productsRedux.products.items;
    const products = useReduxProducts ? productsItems : categoryProducts;

    const [isVisible, setIsVisible] = useState(false);

    const clickProduct = (product) => {
        setClickedProduct(product);
        setOpen(true);
    };

    useEffect(() => {
        if (isVisible) {
            onProductsView();
        }
    }, [isVisible]);

    const renderProducts = useMemo(() => {
        return products?.length > 0 && imagesStatus === 'loaded' ? (
            <div className={`${display === 'grid' && `grid gap-3 ${marginBottom}`} ${
                isMobile ? (columnCount === 2 ? 'grid-cols-2' : 'grid-cols-1') : 'lg:grid-cols-4 2xl:grid-cols-4'
            } ${
                display === 'flex' && 'flex gap-3 px-3'
            } ${isUpload && 'grid-cols-2 lg:grid-cols-5'} scrollbar-hide overflow-x-scroll`}
            >
                {products.map((product) => (
                    <VisibilitySensor key={product.productId} onChange={(isVisible) => setIsVisible(isVisible)}>
                        <ProductCard
                            art={product.art}
                            isCategory={isCategory}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            images={imagesStatus === 'loaded' ? images : []}
                            productId={product.productId}
                            settingsDB_code={settingsDBcode}
                            brand={product?.brand}
                            category={product.category}
                            onClick={() => clickProduct(product)}
                            isLoading={isLoading}
                            weight={
                                display === 'flex' ? 'w-44' : columnCount === 3 ? 'w-44' : 'w-full'
                            }
                            isUpload={isUpload}
                        />
                    </VisibilitySensor>
                ))}
            </div>
        ) : (
            <div className='w-full mt-52 h-52'>
                <div className={'flex justify-center'}>
                    <span className={'text-xl'}>
                        Ничего не найдено :(
                    </span>
                </div>
            </div>
        );
    }, [products, display, isMobile, columnCount, isUpload, images, isLoading, imagesStatus, isVisible]);

    return (
        <div>
            {renderProducts}
            <ModalWindow scrollBehavior={isMobile ? 'normal' : 'inside'} size={isMobile ? 'full' : '5xl'} isOpen={open}>
                <div className={`${isMobile && 'grid place-items-center place-content-center'}`}>
                    <DetailProduct settingsDBcode={db_code} isUpload={isUpload} images={images}
                                   close={() => setOpen(false)}
                                   id={clickedProduct.productId}/>
                </div>
            </ModalWindow>
        </div>
    );
}

export default ProductList;
