import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

// Mock useReducedMotion hook
vi.mock('@/lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ alt, priority, ...props }: any) => (
    <img alt={alt} data-priority={priority ? 'true' : 'false'} {...props} />
  ),
}))

describe('Home Page Integration Tests', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('Full Homepage Rendering', () => {
    it('should render all major components in correct order', () => {
      const { container } = render(<Home />)
      
      // Check that hero section is rendered first
      const hero = screen.getByRole('button', { name: /View details for/i })
      expect(hero).toBeInTheDocument()
      
      // Check that search and filter panel is rendered
      const searchInput = screen.getByRole('searchbox')
      expect(searchInput).toBeInTheDocument()
      
      // Check that race grid is rendered (via main-content id)
      const mainContent = container.querySelector('#main-content')
      expect(mainContent).toBeInTheDocument()
      
      // Verify order: hero should come before search, search before grid
      const main = container.querySelector('main')
      const children = Array.from(main?.children || [])
      const heroIndex = children.findIndex(child => child.querySelector('[role="button"]'))
      const searchIndex = children.findIndex(child => child.querySelector('[role="searchbox"]'))
      const gridIndex = children.findIndex(child => child.id === 'main-content')
      
      expect(heroIndex).toBeLessThan(searchIndex)
      expect(searchIndex).toBeLessThan(gridIndex)
    })

    it('should render CinematicHero with first race data', () => {
      render(<Home />)
      
      // Hero should display the first race title
      const heroTitle = screen.getByRole('heading', { level: 1, name: /Lap of the Gods/i })
      expect(heroTitle).toBeInTheDocument()
      
      // Hero should display driver name
      expect(screen.getByText(/Ayrton Senna/i)).toBeInTheDocument()
    })

    it('should render SearchAndFilterPanel with all controls', () => {
      render(<Home />)
      
      // Search bar should be present
      const searchInput = screen.getByRole('searchbox')
      expect(searchInput).toBeInTheDocument()
      
      // Filter chips should be present (vehicle classes)
      const filterChips = screen.getAllByRole('button', { name: /Filter by/i })
      expect(filterChips.length).toBeGreaterThan(0)
    })

    it('should render BentoGrid with race cards', () => {
      render(<Home />)
      
      // Multiple race cards should be rendered (check for race titles in h3 elements)
      const raceTitles = screen.getAllByRole('heading', { level: 3 })
      expect(raceTitles.length).toBeGreaterThan(1)
    })
  })

  describe('Search and Filter Integration', () => {
    it('should update grid when search is applied', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Get initial count of race cards
      const initialCards = screen.getAllByRole('heading', { level: 3 })
      const initialCount = initialCards.length
      
      // Apply search filter
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'Donington')
      
      // Grid should show filtered results (fewer cards or specific content)
      expect(screen.getByText(/Donington/i)).toBeInTheDocument()
    })

    it('should update grid when class filter is applied', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Click on a filter chip
      const filterChips = screen.getAllByRole('button', { name: /Filter by/i })
      await user.click(filterChips[0])
      
      // Grid should still render (may have fewer items)
      const hero = screen.getByRole('heading', { level: 1 })
      expect(hero).toBeInTheDocument()
    })

    it('should show empty state when no results match filters', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Apply search that returns no results
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'NonexistentRaceXYZ123')
      
      // Empty state should be displayed
      expect(screen.getByText(/No races found/i)).toBeInTheDocument()
    })

    it('should maintain masonry layout after filtering', async () => {
      const user = userEvent.setup()
      const { container } = render(<Home />)
      
      // Apply a filter
      const filterChips = screen.getAllByRole('button', { name: /Filter by/i })
      await user.click(filterChips[0])
      
      // Check that grid still exists with proper classes
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid?.className).toMatch(/grid-cols-1/)
      expect(grid?.className).toMatch(/md:grid-cols-2/)
      expect(grid?.className).toMatch(/lg:grid-cols-3/)
    })

    it('should clear all filters and search when Clear All is clicked', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Apply search and filter
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'Senna')
      
      const filterChips = screen.getAllByRole('button', { name: /Filter by/i })
      await user.click(filterChips[0])
      
      // Clear All button should appear
      const clearAllButton = await screen.findByRole('button', { name: /Clear all/i })
      expect(clearAllButton).toBeInTheDocument()
      
      // Click Clear All
      await user.click(clearAllButton)
      
      // Search should be cleared
      expect(searchInput).toHaveValue('')
    })
  })

  describe('Navigation Flow', () => {
    it('should navigate to race detail when hero is clicked', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Click on hero
      const hero = screen.getByRole('button', { name: /View details for/i })
      await user.click(hero)
      
      // Router push should be called with correct race ID
      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/race\//))
    })

    it('should navigate to race detail when hero is activated with keyboard', () => {
      render(<Home />)
      
      // Get hero and simulate Enter key
      const hero = screen.getByRole('button', { name: /View details for/i })
      hero.focus()
      hero.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      
      // Router push should be called
      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/race\//))
    })

    it('should have clickable race cards in the grid', () => {
      const { container } = render(<Home />)
      
      // Race cards should have cursor-pointer class indicating they're clickable
      const clickableCards = container.querySelectorAll('.cursor-pointer')
      expect(clickableCards.length).toBeGreaterThan(1) // Hero + race cards
    })
  })

  describe('Responsive Layout', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<Home />)
      
      // Check that grid has responsive column classes
      const grid = container.querySelector('.grid')
      expect(grid?.className).toMatch(/grid-cols-1/)
      expect(grid?.className).toMatch(/md:grid-cols-2/)
      expect(grid?.className).toMatch(/lg:grid-cols-3/)
      expect(grid?.className).toMatch(/xl:grid-cols-4/)
    })

    it('should have responsive gap classes', () => {
      const { container } = render(<Home />)
      
      // Check that grid has responsive gap classes
      const grid = container.querySelector('.grid')
      expect(grid?.className).toMatch(/gap-2/)
      expect(grid?.className).toMatch(/md:gap-4/)
    })

    it('should have responsive hero height classes', () => {
      render(<Home />)
      
      // Hero should have responsive height classes
      const hero = screen.getByRole('button', { name: /View details for/i })
      expect(hero.className).toMatch(/h-\[60vh\]/)
      expect(hero.className).toMatch(/md:h-\[70vh\]/)
      expect(hero.className).toMatch(/lg:h-\[80vh\]/)
    })

    it('should have max-width constraints on search and grid containers', () => {
      const { container } = render(<Home />)
      
      // Search panel container should have max-width
      const searchContainer = container.querySelector('.max-w-\\[1920px\\]')
      expect(searchContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have skip to main content link', () => {
      render(<Home />)
      
      const skipLink = screen.getByText(/Skip to main content/i)
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('should have live region for screen reader announcements', () => {
      const { container } = render(<Home />)
      
      const liveRegion = container.querySelector('[role="status"][aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('should announce filtered results to screen readers', async () => {
      const user = userEvent.setup()
      const { container } = render(<Home />)
      
      // Apply a filter
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'Senna')
      
      // Live region should update with results count
      const liveRegion = container.querySelector('[role="status"][aria-live="polite"]')
      expect(liveRegion?.textContent).toMatch(/Found \d+ race/)
    })

    it('should have proper ARIA labels on search and filter controls', () => {
      render(<Home />)
      
      // Search and filter section should have aria-label
      const searchSection = screen.getByLabelText(/Search and filter controls/i)
      expect(searchSection).toBeInTheDocument()
      
      // Filter group should have aria-label
      const filterGroup = screen.getByRole('group', { name: /Vehicle class filters/i })
      expect(filterGroup).toBeInTheDocument()
    })

    it('should have semantic HTML structure', () => {
      const { container } = render(<Home />)
      
      // Main element should exist
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
      
      // Sections should have proper roles
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })
  })
})
