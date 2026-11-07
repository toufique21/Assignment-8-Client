"use client";

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const SignUpPage = () => {

    const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries()) as { name: string, email: string, password: string };
        console.log(user);

        const { data, error } = await authClient.signIn.email({
            ...user,
            callbackURL: "/",
        });

        if (error) {
            console.log(error);
            toast.error("Check your email and password");
        }
        if (data) {
            console.log(data);
            toast.success("Sign-Up Successfully");
            redirect("/");
        }

    }

    // const handleGoogleSignIn = async () => {
    //     const data = await authClient.signIn.social({
    //         provider: "google",
    //     });
    // };
    // const handleGithubSignIn = async () => {
    //     const data = await authClient.signIn.social({
    //         provider: "github",
    //     });
    // }

    return (
        <div>
            <h2 className='flex justify-center text-2xl mt-10 px-5 font-bold'>সাইন ইন করুন</h2>
            <p className='flex justify-center text-xs text-gray-500 mb-5'>বিস্তারিতদাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্ট খুলুন</p>
            <div className='flex justify-center mb-25'>
                <form onSubmit={handleSubmit}>
                    <fieldset className="fieldset bg-base-200 rounded-box w-sm p-4 gap-5">
                        <div className="grid">
                            <label className="label">ইমেইল</label>
                            <input type="email" name="email" className="input w-sm" placeholder="আপনার নাম@gmail.com" />
                        </div>

                        <div className="grid">
                            <label className="label">পাসওয়ার্ড</label>
                            <input type="password" name="password" className="input w-sm" placeholder="আপনার পাসওয়ার্ড" />
                        </div>
                        <button type="submit" className="font-bold text-sm bg-green-700 rounded-xl text-white px-2 py-3 shadow shadow-green-500">সাইন ইন করুন</button>
                        <div className="grid grid-cols-3 justify-between">
                            <hr className="bg-gray-700" />
                            <p className="flex justify-center items-center text-3xl"></p>
                            <hr />
                        </div>
                        <div className="flex justify-between pt-1">

                            {/* <button onClick={handleGoogleSignIn} className="flex cursor-pointer justify-center items-center bg-base-200 gap-2 border border-gray-200 rounded px-8 py-2"><FaGoogle />সাইন ইন উইথ Google</button>
                            <button onClick={handleGithubSignIn} className="flex cursor-pointer justify-center items-center bg-base-200 gap-2 border border-gray-200 rounded px-8 py-2"><FaGithub />সাইন ইন উইথ GitHub</button> */}
                        </div>
                        <div className="flex justify-center items-center">
                            <p>অ্যাকাউন্ট নেই? <Link href={"/Sign-Up"} className="text-green-700">সাইন আপ করুন</Link></p>
                        </div>
                    </fieldset>
                    <div className="flex justify-center gap-3"><Link href="/" className="flex text-sm text-gray-600 items-center gap-4 mt-8">হোম পেইজে ফিরে যান</Link></div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;