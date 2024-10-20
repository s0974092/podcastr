'use client'

import React from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import EmptyState from '@/components/EmptyState';
import { useUser } from '@clerk/nextjs';


const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();
  
  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });
  
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId });

  const isOwner = user?.id === podcast?.authorId;

  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  return (
    <section className='flex flex-col w-full'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>
          Currently Playing
        </h1>
        <figure className='flex gap-3'>
          <Image 
            src='/icons/headphone.svg'
            height={24}
            width={24}
            alt='headphone'
          />
          <h2 className='text-16 font-bold text-white-1'>
            {podcast?.views}
          </h2>
        </figure>
      </header>
      
      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      />

      <p className='text-16 text-white-2 pb-8 pt-[45px] font-medium max-md:text-center'>{podcast?.podcastDescription}</p>
    
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-16 font-medium text-white-2'>{podcast?.voicePrompt}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Thumbnail</h1>
          <p className='text-16 font-medium text-white-2'>{podcast?.imagePrompt}</p>
        </div>
      </div>
      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className='podcast_grid'>
            {similarPodcasts?.map(({ _id, imageUrl, podcastTitle, podcastDescription }) => (
                <PodcastCard 
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              ))
            }
          </div>
        ) : (
            <EmptyState
              title='No Similar Podcasts Found'
              buttonLink='/discover'
              buttonText='Discover more podcasts'
            />
        )}
      </section>
    </section>
  )
}

export default PodcastDetails