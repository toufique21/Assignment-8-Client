import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <div className='flex justify-between container mx-auto'>
            <div className=' mt-2'>
                <div className='flex justify-center items-center'><Image src="/5078755.png" alt='' width="50" height="50" /></div>
                <p className='text-gray-500 font-bold'>BookNook</p>
            </div>
            <div className='flex justify-center items-center'>
                <ul className='flex gap-3 text-sm text-gray-500'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="All-Books">All Books</Link></li>
                    <li><Link href="Add-Books">Add Books</Link></li>
                    <li><Link href="My-Books">My Books</Link></li>
                    <li><Link href="My-Borrows">My Borrows</Link></li>
                </ul>
            </div>
            <div>
                User Info
            </div>
        </div>
    );
};

export default Navbar;