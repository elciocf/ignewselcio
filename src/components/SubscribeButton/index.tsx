import { signIn, useSession, getSession } from 'next-auth/client';
import styles from './styles.module.scss';
import { GetServerSideProps } from "next"

import {api} from '../../services/api'
import { getStripeJs } from '../../services/stripe-js';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';



interface SessionWithActive extends Session{
    activeSubscription?: any
  }




export function SubscribeButton(){
    const [session] = useSession();
    const router = useRouter()

    async function handleSubscribe(){
       if(!session){
           signIn('github')
           return;
       }   
       
       let mySession : SessionWithActive = session
       if (mySession.activeSubscription){
         router.push('/posts') 
         return
       } 

       try {
          const response = await api.post('/subscribe')

          const {sessionId} = response.data

          const stripe = await getStripeJs()

          await stripe.redirectToCheckout({sessionId})          
       }catch(err){
           alert(err.message)
       }

    }

    return(
        <button type="button" 
           className={styles.subscribeButton}
           onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}