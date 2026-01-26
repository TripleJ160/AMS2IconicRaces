import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl md:text-8xl text-accent-red mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl text-text-primary mb-6">
          Race Not Found
        </h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The race you&apos;re looking for doesn&apos;t exist or has been removed from the gallery.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full hover:bg-glass-bg transition-colors text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Gallery
        </Link>
      </div>
    </div>
  )
}
