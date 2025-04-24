// app/rooms/[id]/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getRoom } from '@/src/services/roomService';
import RoomDetailsSkeleton from '@/src/components/skeletons/RoomDetailsSkeleton';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

// Dynamically import the components that aren't needed immediately
const RoomDetails = dynamic(() => import('@/src/components/rooms/RoomDetails'), {
  loading: () => <RoomDetailsSkeleton />
});

const BookingForm = dynamic(() => import('@/src/components/BookingForm'), {
  loading: () => <div className="bg-gray-100 p-6 rounded-lg animate-pulse h-96"></div>
});

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const room = await getRoom(params.id);
    
    if (!room) {
      return {
        title: 'Room Not Found',
      };
    }
    
    return {
      title: `${room.name} - MRS Hotel Reservation`,
      description: room.description,
      openGraph: {
        title: `${room.name} - MRS Hotel Reservation`,
        description: room.description,
        images: room.images?.[0] ? [room.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Room Details - MRS Hotel Reservation',
    };
  }
}

// Define static params for common rooms to improve build time
export async function generateStaticParams() {
  try {
    const rooms = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`)
      .then(res => res.json());
    
    return rooms.map((room: any) => ({
      id: room.id,
    }));
  } catch (error) {
    return [];
  }
}

export default async function RoomPage({ params }: { params: { id: string } }) {
  try {
    const room = await getRoom(params.id);
    
    if (!room) {
      notFound();
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<RoomDetailsSkeleton />}>
          <RoomDetails room={room} />
        </Suspense>
        
        <div className="mt-8">
          <Suspense fallback={<div className="bg-gray-100 p-6 rounded-lg animate-pulse h-96"></div>}>
            <BookingForm roomId={params.id} roomPrice={room.price} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Failed to load room details. Please try again later.</span>
        </div>
      </div>
    );
  }
}