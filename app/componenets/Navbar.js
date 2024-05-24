import Image from 'next/image'
import React from 'react'
import useGlobalContextProvider from '../ContextApi'

function Navbar() {
    const {userObject,userXPObject} = useGlobalContextProvider();
    const {user,setUser} = userObject;
    const {userXP} = userXPObject;

    function changeTheLoginState(){
        const userCopy = {...user};
        userCopy.isLogged =!userCopy.isLogged;
        setTimeout(()=>{
            setUser(userCopy);
        },600);
    }
  return (
    <div>
            <nav className='mx-auto max-w-screen-xl p-4 sm:px-8 sm:py-5 lg:px-10'>
                <div className='sm:flex sm:items-center sm:justify-between'>
                    <div className='text-center sm:text-left'>
                        <a className='flex gap-1 items-center'>
                            <Image
                                src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                                alt='Workflow'
                                width={60}
                                height={60}
                            />
                            <h2 className='text-2xl font-bold flex gap-2'>Quiz <span className='text-violet-700'>World</span></h2>
                        </a>
                    </div>
                    <div className='mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center'>
                        {user.isLogged && (
                            <div className='flex gap-2'>
                                <span>Welcome: {user.name}</span>
                                <span className='font-bold text-green-700'>{userXP} XP</span>
                            </div>
                        )}
                        <button type='button' onClick={()=>changeTheLoginState()}
                         className='block rounded-lg bg-gray-600 px-7 py-3 text-sm font-medium text-white'>
                            {user.isLogged?'Log out':'Log in'}
                            </button>
                    </div>
                </div>
            </nav>
        </div>
  )
}

export default Navbar
