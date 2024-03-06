import React, {useEffect, useState} from 'react';
import {IoCloseSharp} from 'react-icons/io5';
import {Button, Radio, RadioGroup, Skeleton, Slider} from "@nextui-org/react";
import axios from "../../axios.js";
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../../redux/slices/productSlice.js";

function Filter({close}) {
    const [checkedFilter, setCheckedFilter] = useState('popular');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceValue, setPriceValue] = useState([0, 250000]);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [brands, setBrands] = useState([]);
    const token = process.env.REACT_APP_API_TOKEN;
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const selectedCategory = useSelector(
        (state) => state.categories.selectedCategory
    );

    // Загрузка фильтров из localStorage при монтировании компонента
    useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem('filters')) || {};
        setCheckedFilter(storedFilters.checkedFilter || 'popular');
        setSelectedBrands(storedFilters.selectedBrands || []);
        setPriceValue(storedFilters.priceValue || [0, 250000]);
    }, []);


    // Сохранение фильтров в localStorage при изменении состояний

    const saveFilters = () => {
        const filtersToSave = {
            checkedFilter,
            selectedBrands,
            priceValue  // Сохраняем только значения, а не функцию setPriceValue
        };
        localStorage.setItem('filters', JSON.stringify(filtersToSave));
    }


    const handleBrandClick = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands((prevBrands) => prevBrands.filter((item) => item !== brand));
        } else {
            setSelectedBrands((prevBrands) => [...prevBrands, brand]);
        }
    };

    const submit = () => {
        dispatch(fetchProducts({
            categoryId: selectedCategory,
            sort: checkedFilter,
            minPrice: priceValue[0],
            maxPrice: priceValue[1],
            brandIds: selectedBrands
        }))
        saveFilters();
        close();

    };

    const variants = [
        {id: 0, name: 'Самые популярные', value: 'popular'},
        {id: 1, name: 'Cамые дорогие', value: 'maxPrice'},
        {id: 2, name: 'Самые дешевые', value: 'minPrice'},
    ];

    const fetchBrands = () => {
        axios
            .get(`/brand/brands`, {
                headers: {
                    'x-auth-token': token,
                },
            })
            .then((res) => {
                setBrands(res.data.brands);
                setIsLoading(false);
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className='mb-20'>
            <div className='pt-10 mx-3 mb-3'>
                <span className='text-xl font-bold'>Сортировка</span>

                <div className={'bg-neutral-200 cursor-pointer absolute right-2 top-2.5 p-1 rounded-full'}><IoCloseSharp
                    className='text-2xl'
                    onClick={close}
                /></div>

                <RadioGroup
                    className={'mx-3 mt-3'}
                    value={checkedFilter}
                    defaultValue={'popular'}
                    onValueChange={setCheckedFilter}
                >
                    {variants.map((obj) => (
                        <Radio
                            className={'mb-1'}
                            size={'md'}
                            key={obj.id}
                            value={obj.value}>{obj.name}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>


            <div className='mb-3'>
                <span className='text-xl mx-3 font-bold'>Бренд</span>

                <div
                    className={'mt-3 px-5 gap-3 grid grid-cols-3'}
                >
                    {isLoading ? (
                        <>
                            {Array.from({length: 6}).map((_, index) => (
                                <>
                                    <Skeleton className="rounded-lg">
                                        <Button size={"md"}></Button>
                                    </Skeleton>
                                </>
                            ))}
                        </>
                    ) : (
                        <>
                            {brands.map((obj) => (
                                <>
                                    <Button className={'font-semibold'}
                                            color={selectedBrands.includes(obj.id) ? 'primary' : 'default'}
                                            variant={"bordered"}
                                            onPress={() => handleBrandClick(obj.id)} size={"md"}>
                                        {obj.name}
                                    </Button>
                                </>
                            ))}
                        </>
                    )}

                </div>

            </div>

            <div className='mb-3 mt-5'>
                <div className={'flex justify-between'}>
                    <span className='text-xl mx-3 font-bold'>Цена</span>
                    <span className="text-default-500 mx-5 mt-3 font-medium text-small">
                        {Array.isArray(priceValue) && priceValue.map((b) => `${b.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} ₸`).join(" – ")}
                    </span>
                </div>


                <div className={''}>
                    <Slider
                        label=""
                        step={5000}
                        minValue={0}
                        maxValue={500000}
                        value={priceValue}
                        onChange={setPriceValue}
                        defaultValue={priceValue}
                        className={'mt-3 px-5'}
                    />


                </div>

            </div>


            {isMobile ? (
                <>
                    <div className='fixed bottom-5 right-5 left-5 bg-white/[.8]'>
                        <Button
                            color='primary'
                            fullWidth={true}
                            size='lg'
                            onPress={submit}
                            className='btn btn-primary font-bold flex-1 normal-case text-md'
                        >
                            Применить
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className={'mt-10 mx-3'}>
                        <Button
                            color='primary'
                            fullWidth={true}
                            size='lg'
                            onPress={submit}
                            className='btn btn-primary font-bold flex-1 normal-case text-md'
                        >
                            Применить
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Filter;
