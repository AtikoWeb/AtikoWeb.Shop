import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@nextui-org/react';
import {MdContactPhone} from 'react-icons/md';
import {FaBagShopping} from 'react-icons/fa6';
import {HiReceiptRefund} from 'react-icons/hi';
import {BsFillPeopleFill} from 'react-icons/bs';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from "../../axios.js";
import {userLoggedOut} from "../../redux/slices/userSlice.js";

export default function Header() {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user.userId);
    const [user, setUser] = useState({name: ''});
    const isAuth = useSelector((state) => state.user.isAuthenticated);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const dispatch = useDispatch();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;

    const onPressButton = () => {
        // Перенаправить на домашнюю страницу, если не аутентифицирован, иначе остаться на текущей странице
        if (!isAuth) {
            navigate('/signin');
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const {data} = await axios.get('/user/get-one', {
                    params: {id: userId},
                });
                setUser({name: data.username});
            } catch (error) {
                console.error('Error fetching user data:', error);
                dispatch(userLoggedOut());
            }
        };
        getUser();
    }, [userId]);


    const firstNameChar = user.name.charAt(0);

    const menuItems = [
        {
            name: 'О компании',
            icon: <BsFillPeopleFill style={{fontSize: 28}}/>,
            link: '/about',
        },
        {
            name: 'Политика возврата',
            icon: <HiReceiptRefund style={{fontSize: 28}}/>,
            link: '/refund',
        },
        {
            name: 'Контакты',
            icon: <MdContactPhone style={{fontSize: 28}}/>,
            link: '/contact',
        },
    ];

    return (
        <Navbar
            position='static'
            className='z-[2] rounded-xl bg-inherit lg:bg-white relative mt-0 lg:mb-5'
        >
            <NavbarContent>
                <NavbarMenuToggle className='block md:hidden'/>
                <NavbarBrand>
                    <div
                        className='hidden lg:block'
                        onClick={() => navigate('/')}
                    >
                        <img
                            src={`${API_URL_IMAGES}logo.png`}
                            alt=''
                            className='h-10 cursor-pointer'
                        />
                    </div>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className='lg:hidden pr-3'
                justify='center'
            >
                <img
                    src={`${API_URL_IMAGES}logo.png`}
                    alt=''
                    className='h-8'
                />
            </NavbarContent>

            <NavbarContent
                className='hidden sm:flex gap-4'
                justify='center'
            >
                {menuItems.map((obj) => (
                    <NavbarItem>
                        <Link
                            color='foreground'
                            to={obj.link}
                            className='text-md'
                        >
                            {obj.name}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify='end'>
                <NavbarItem className='flex gap-3'>
                    <Button
                        onPress={() => navigate('/cart')}
                        size='md'
                        href='#'
                        className='font-medium bg-neutral-200 hidden md:block xl:hidden'
                    >
						<span className='flex gap-3'>
							<FaBagShopping className='text-xl'/>
                            {totalPrice
                                .toString()
                                .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                            <span className='text-black/60'>₸</span>
						</span>
                    </Button>
                    {isAuth ? (
                        <Avatar
                            isBordered
                            name={firstNameChar}
                            className='cursor-pointer text-white text-lg bg-neutral-500/90'
                            onClick={() => navigate('/profile')}
                        />
                    ) : (
                        <Button
                            onPress={onPressButton}
                            size={isMobile ? 'sm' : 'md'}
                            href='#'
                            color='primary'
                            variant={'solid'}
                            className='font-bold'
                        >
                            Войти
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className='pt-5'>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className='w-full flex text-xl mb-5'
                            color={'foreground'}
                            to={item.link}
                        >
                            <span className='text-neutral-500 w-10'>{item.icon}</span>
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
