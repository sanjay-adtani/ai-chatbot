'use client'
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CREATE_CHATBOT } from '@/graphql/mutations/mutations'
import { useMutation } from '@apollo/client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

function CreateChatbot() {
  const {user} = useUser();
  const [name, setName] = useState('');
  const router = useRouter()

  const [ chatbotName, {data, loading, error} ] = useMutation(CREATE_CHATBOT, {
    variables: {
      clerk_user_id: user?.id,
      name,
      created_at: new Date().toISOString()
    }
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const data = await chatbotName();
      setName('');
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch(err) {
      console.error(err);
      
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className='flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10'>
        <Avatar seed='create-chatbot' />
        <div className=''>
            <h1 className='text-xl lg:text-3xl font-semibold'>Create</h1>
            <h2 className='font-light'>Create a new chatbot to assist you in your conversations with your customers.</h2>
            <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-5 mt-5'>
              <Input 
                placeholder='Chatbot Name' 
                className='max-w-lg' 
                type='text' 
                required  
                value={name}
                onChange={(e)=>setName(e.target?.value)}
              />
              <Button type='submit' disabled={loading || !name}>
                {loading ? 'Creating Chatbot...' : 'Create Chatbot'}
              </Button>
            </form>
        </div>
    </div>
  )
}

export default CreateChatbot