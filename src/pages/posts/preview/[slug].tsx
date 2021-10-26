import { signIn, useSession, getSession } from 'next-auth/client';
import { GetStaticPaths, GetStaticProps } from "next"
import Link, {LinkProps} from 'next/link'
import Head from "next/head"

import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../../services/prismic"

import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import styles from '../post.module.scss'
import { Session } from "next-auth"
import { useRouter } from 'next/router';
import { useEffect } from 'react';


interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string    
  }
}

interface SessionWithActive extends Session{
  activeSubscription?: any
}


export default function  PostPreview({post}: PostPreviewProps){
  const [session] = useSession();
  const router = useRouter()
  
  useEffect(()=>{    
    let mySession : SessionWithActive = session
    if (mySession?.activeSubscription){
        router.push(`/posts/${post.slug}`) 
    }   
  }, [session])
  


  return (
    <>
     <Head>
        <title>{post.title} | Ignews</title>
     </Head>
     <main className={styles.container}>
        <article className={styles.post}>
            <h1>{post.title}</h1>
            <span>{post.updatedAt}</span>
            <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content}} />                         

            <div className={styles.continueReading}>
               Wanna continue reading?
               <Link href="/">
                  <a href="">Subscribe now 🤗</a>
               </Link>
            </div>
        </article>
     </main>
    </>
  )
}

export const getStaticPaths : GetStaticPaths = async () => {
   return {
      paths: [],
      fallback: 'blocking'
   }
}

export const getStaticProps: GetStaticProps = async ({ params}) => {
   
   const {slug} = params

  
   const prismic = getPrismicClient()
   const response = await prismic.getByUID('post', String(slug), {})
   const post = {
     slug,
     title : RichText.asText(response.data.title),
     content: RichText.asHtml(response.data.content.splice(0,3)),
     updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
   }

   return {
     props: {
        post
     },
     revalidate: 60 * 30
   }


}