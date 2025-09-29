import React from 'react'
import {motion} from "framer-motion";
import {Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {BsThreeDots} from "react-icons/bs";

function ClientCard({domain, onClick, onDelete, onUpdate, status, db_code = ''}) {

    return (
        <motion.div
            key='ClientCard'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1, delay: 0.2}}
        >
            <Card
                shadow='none'
                className={`z-0 mb-3 w-full h-44`}
                isPressable={true}
                onClick={onClick}
            >

                <CardBody className='overflow-hidden flex justify-center items-center gap-5'>


                    <Dropdown>
                        <DropdownTrigger>

                            <Button variant={'light'} size={"sm"}
                                    className={'absolute right-1 top-1'}>
                                <BsThreeDots className={'text-2xl'}/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions">
                            <DropdownItem
                                onPress={onUpdate}
                                color={"default"}
                            >
                                {status === 'active' ? 'Отключить' : 'Включить'}
                            </DropdownItem>

                            <DropdownItem onPress={onDelete} color={"danger"}
                                          className={'text-danger'}>
                                Удалить
                            </DropdownItem>


                        </DropdownMenu>
                    </Dropdown>


                    <div
                        className={`${status === 'active' ? 'bg-green-500' : 'bg-red-500'} absolute left-3 top-3 rounded-full h-5 w-5`}>
                    </div>

                    <span className='text-center truncate text-4xl opacity-40 font-semibold'>
					{db_code.toUpperCase()}
				</span>

                </CardBody>
            </Card>


            <span className='text-ellipsis truncate text-xl font-semibold'>
					{domain}
				</span>
        </motion.div>
    )
}

export default ClientCard
