import React, {useEffect, useState} from 'react';
import {Button, Input, Radio, RadioGroup, Skeleton, Slider} from "@nextui-org/react";
import axios from "../../axios.js";
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../../redux/slices/productSlice.js";
import Cookies from "js-cookie";
import {fetchCategory} from "../../redux/slices/categorySlice.js";

function Filter({
                    close, filtersCount, onSetFilter = number => {
    }
                }) {
    const [checkedFilter, setCheckedFilter] = useState('popular');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceValue, setPriceValue] = useState([0, 250000]);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [brands, setBrands] = useState([]);
    const token = process.env.REACT_APP_API_TOKEN;
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const selectedCategory = useSelector(
        (state) => state.categories.selectedCategory
    );

    useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem('filters')) || {};
        setCheckedFilter(storedFilters.checkedFilter || 'popular');
        setSelectedBrands(storedFilters.selectedBrands || []);
        setPriceValue(storedFilters.priceValue || [0, 250000]);
    }, []);


    // Сохранение фильтров в localStorage при изменении состояний

    const saveFilters = () => {
        // Сохранение фильтров в localStorage и вызов функции onSetFilter для обновления количества фильтров в родительском компоненте
        const filtersToSave = {
            checkedFilter,
            selectedBrands,
            priceValue
        };
        localStorage.setItem('filters', JSON.stringify(filtersToSave));
        onSetFilter(calculateFiltersCount(filtersToSave));
    };

    // Функция для вычисления количества установленных фильтров
    const calculateFiltersCount = (filters) => {
        let count = 0;
        // Проходим по объекту filters и увеличиваем count для каждого установленного фильтра
        // Пример: если checkedFilter !== 'popular', увеличиваем count на 1
        if (filters.checkedFilter !== 'popular') {
            count++;
        }

        if (filters.selectedBrands.length !== 0) {
            count++;
        }

        if (filters.priceValue[0] !== 0 || filters.priceValue[1] !== 250000) {
            count++;
        }
        // Аналогично для остальных фильтров...
        return count;
    };


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
            brandIds: selectedBrands,
            limit: 10,
        }))

        dispatch(fetchCategory({
            sortProducts: checkedFilter,
            minPrice: priceValue[0],
            maxPrice: priceValue[1],
            brandIds: selectedBrands
        }));
        saveFilters();
        window.scrollTo(0, 0);
        close();
    };

    const handlePriceInputChange = (index, value) => {
        let newValue = value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        if (newValue !== '' && newValue !== '0') {
            newValue = newValue.replace(/^0+(?=\d)/, ''); // Удаляем все начальные нули, кроме последнего
        }

        // Проверяем, не превышает ли новое значение 500 000
        if (newValue !== '' && parseInt(newValue) > 500000) {
            newValue = '500000'; // Если превышает, устанавливаем значение на 500 000
        }

        const newPriceValue = [...priceValue];
        newPriceValue[index] = newValue === '' ? '0' : newValue;
        setPriceValue(newPriceValue);
    };


    const variants = [
        {id: 0, name: 'Самые популярные', value: 'popular'},
        {id: 1, name: 'Cамые дорогие', value: 'maxPrice'},
        {id: 2, name: 'Самые дешевые', value: 'minPrice'},
    ];

    const fetchBrands = () => {
        axios
            .get(`/brand/brands`, {
                params: {
                    db_code
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

    const onClear = () => {
        setCheckedFilter('popular');
        setSelectedBrands([]);
        setPriceValue([0, 250000]);
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    return (
        <div className='mb-40 relative'>
            <div className='pt-10 mb-3'>
                <span className='text-xl font-bold'>Показать сначала</span>

                <RadioGroup
                    className={'mt-3'}
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

            <div className='mb-3 mt-5'>
                <div className={'flex justify-between'}>
                    <span className='text-xl font-bold'>Цена</span>
                    <span className="text-default-500 mt-3 font-medium text-small">
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
                        className={'mt-3'}
                    />

                    <div className={'flex gap-3 mt-5'}>
                        <Input
                            size={isMobile ? 'lg' : 'md'}
                            type='tel'
                            onChange={(e) => handlePriceInputChange(0, e.target.value)}
                            value={formatPrice(priceValue[0])} // Форматируем значение перед выводом
                            variant={"bordered"}
                            color={"primary"}
                            startContent={<span className={'text-neutral-500'}>От</span>}
                        />

                        <Input
                            size={isMobile ? 'lg' : 'md'}
                            type='tel'
                            onChange={(e) => handlePriceInputChange(1, e.target.value)}
                            value={formatPrice(priceValue[1])} // Форматируем значение перед выводом
                            variant={"bordered"}
                            color={"primary"}
                            startContent={<span className={'text-neutral-500'}>До</span>}
                        />

                    </div>


                </div>

            </div>

            <div className={`mb-3 mt-5 ${brands.length === 0 && 'hidden'}`}>
                <span className='text-xl font-bold'>Бренд</span>

                <div
                    className={'mt-3 gap-3 grid grid-cols-3'}
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
                                    <Button className={'font-semibold text-[12px] md:text-md'}
                                            color={selectedBrands.includes(obj.id) ? 'primary' : 'default'}
                                            variant={"bordered"}
                                            onPress={() => handleBrandClick(obj.id)} size={"md"}>
                                      <span className={'text-ellipsis truncate w-20'}>
                                            {obj.name}
                                      </span>
                                    </Button>

                                </>
                            ))}
                        </>
                    )}

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

                        {filtersCount > 0 && (
                            <div className={`mt-5`}>
                                <Button
                                    fullWidth={true}
                                    size='lg'
                                    variant={"light"}
                                    onPress={onClear}
                                    className='text-primary font-bold flex-1 normal-case text-md'
                                >
                                    Сбросить все
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className={'mt-10'}>
                        <Button
                            color='primary'
                            size='lg'
                            onPress={submit}
                            className='btn btn-primary w-full font-bold flex-1 normal-case text-md'
                        >
                            Применить
                        </Button>
                    </div>

                    {filtersCount > 0 && (
                        <div className={`mt-5`}>
                            <Button
                                fullWidth={true}
                                size='lg'
                                variant={"light"}
                                onPress={onClear}
                                className='text-primary font-bold flex-1 normal-case text-md'
                            >
                                Сбросить все
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Filter;
