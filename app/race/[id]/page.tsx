import { notFound } from 'next/navigation'
import { getRaceById, getAllRaces } from '@/lib/raceData'
import { RaceDetailView } from '@/components/race-detail/RaceDetailView'

interface RacePageProps {
  params: {
    id: string
  }
  searchParams: {
    from?: string
  }
}

export default function RacePage({ params, searchParams }: RacePageProps) {
  const race = getRaceById(params.id)
  const allRaces = getAllRaces()

  if (!race) {
    notFound()
  }

  // Determine if this race was accessed from a championship
  const isFromChampionship = searchParams.from === 'championship'

  return <RaceDetailView race={race} allRaces={allRaces} isFromChampionship={isFromChampionship} />
}
