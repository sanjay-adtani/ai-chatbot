import { ChatbotCharacteristics } from '@/types/types'
import React from 'react'
import { OctagonX } from 'lucide-react'
import { useMutation } from '@apollo/client'
import { REMOVE_CHARACTERISTICS } from '@/graphql/mutations/mutations'
import { toast } from 'sonner'

function Characteristic({characteristic}: {
    characteristic: ChatbotCharacteristics
}) {

    const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTICS, {
        refetchQueries: ['GetChatbotById']
    })

    const handelRemove = async (characteristicId: number) => {
        try{
            await removeCharacteristic({
                variables: {
                    characteristicId
                }
            })
        }catch(err) {
            console.log(err);
        }
    }

  return (
    <li className='relative p-10 bg-white border rounded-md'>
        {characteristic.content}
        <OctagonX 
            className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'
            onClick={()=>{
                const promise = handelRemove(characteristic.id);
                toast.promise(promise, {
                    loading: 'Removing...',
                    success: 'Characteristic removed',
                    error: 'Failed to remove Characteristic'
                })
            }}
        />
    </li>
  )
}

export default Characteristic