"use client"

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from 'react-datepicker'

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = 
    useState<'isSheduleMeeting' | 'isJoiningMeeting' | 
    'isInstantMeeting' | undefined>()

    const {user} = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
      dateTime: new Date(),
      description:'',
      link:''
    })

    const [callDetails, setCallDetails] = useState<Call>()
    const { toast } = useToast()
    const createMeeting=async()=>{
      if(!client || !user) return

      try {

        if(!values.dateTime){
          toast({
            title: "Por Favor selecciona fecha y hora",
            
            
          })
          return

        }

        const id = crypto.randomUUID()
        const call = client.call('default',id)

        if(!call) throw new Error('Failed to create call')

        const startsAt= values.dateTime.toISOString() || 
        new Date(Date.now()).toISOString()

        const description = values.description || 'reunion instantanea'

        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description
            }
          }
        })
        setCallDetails(call)

        if(!values.description){
          router.push(`/meeting/${call.id}`)
          toast({
            title: "Reunion creada",
            
          })
        }
        
      } catch (error) {
        console.log(error)
        toast({
          title: "Error  al crear reunion",
          
        })
      }
    }

    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className="grid grid-cols-1 gap-5
    md:grid-cols-2 xl:grid-cols-4">
       <HomeCard 
        img="/icons/add-meeting.svg"
        title="Nueva Reunion"
        description="Iniciar una reunión instantánea"
        handleClick={()=>setMeetingState('isInstantMeeting')}
        className="bg-orange-1"
       />
       <HomeCard 
        img="/icons/schedule.svg"
        title="Programar Reunion"
        description="planifica tu reunión"
        handleClick={()=>setMeetingState('isSheduleMeeting')}
         className="bg-blue-1"
       />
       <HomeCard 
         img="/icons/recordings.svg"
         title="ver grabaciones"
         description="Mira tus grabaciones"
         handleClick={()=>router.push('/recordings')}
          className="bg-purple-1"
       />
       <HomeCard 
         img="/icons/join-meeting.svg"
         title="Unirse a la reunión"
         description="A través de un enlace de invitación"
         handleClick={()=>setMeetingState('isJoiningMeeting')}
          className="bg-yellow-1"
       />

       {!callDetails ? (
         <MeetingModal 
         isOpen={meetingState==='isSheduleMeeting'}
         onClose={()=>setMeetingState(undefined)}
         title="Crear una reunion "
         
         handleClick={createMeeting}
 
        >

          <div className="flex flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">
                Agregar descripcion
              </label>
              <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e)=>{
                  setValues({
                    ...values,
                    description:e.target.value
                  })
                }}
              />
          </div>
          <div className="flex w-full flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2">
                Selecciona Fecha y Hora
              </label>
              <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date)=>setValues({
                  ...values,
                  dateTime:date!
                })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
          </div>
        </MeetingModal>
       ) : (
        <MeetingModal 
        isOpen={meetingState==='isSheduleMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title=" reunion Creada"
        className="text-center"
        
        handleClick={()=>{
          navigator.clipboard.writeText(meetingLink)
          toast({title:"enlace copiado"})
        }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copiar Enlace de la Reunion"
        

       />
       )}
       <MeetingModal 
        isOpen={meetingState==='isInstantMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title="Inicia una reunion Istantanea"
        className="text-center"
        buttonText="Iniciar Reunion"
        handleClick={createMeeting}

       />

    </section>
  )
}

export default MeetingTypeList