import { notFound } from 'next/navigation'
import { getRaceById } from '@/lib/raceData'
import { RaceDetailView } from '@/components/race-detail/RaceDetailView'

interface RacePageProps {
  params: {
    id: string
  }
}

export default function RacePage({ params }: RacePageProps) {
  const race = getRaceById(params.id)

  if (!race) {
    notFound()
  }

  return <RaceDetailView race={race} />
}
