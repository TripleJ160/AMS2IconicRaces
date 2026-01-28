import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RaceCard } from './RaceCard';
import type { Race } from '@/lib/types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock useReducedMotion hook
vi.mock('@/lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

// Mock DLCBadge component to make it easier to test
vi.mock('@/components/shared/DLCBadge', () => ({
  DLCBadge: ({ requiredDLC, variant }: any) => (
    <div data-testid="dlc-badge" data-variant={variant} data-dlc={requiredDLC.join(',')}>
      [DLC]
    </div>
  ),
}));

const createMockRace = (overrides?: Partial<Race>): Race => ({
  id: 'test-race',
  title: 'Test Race',
  driver: 'Test Driver',
  team: 'Test Team',
  year: '1988',
  tags: ['F1', 'Historic'],
  description: 'Test description',
  heroImage: '/test-image.jpg',
  youtubeId: 'test-youtube-id',
  raceContext: {
    event: 'Test Event',
    circuit: 'Test Circuit, Location',
    laps: 50,
    distance: '300km',
    conditions: 'Dry',
    wikipediaUrl: 'https://test.com',
    podiumResults: [],
    keyMoments: [],
    significance: 'Test significance',
  },
  ams2: {
    trackId: 1,
    trackName: 'Test Track',
    vehicleClassId: 1,
    vehicleClassName: 'Test Class',
    vehicleId: 1,
    vehicleName: 'Test Vehicle',
    date: '1988-05-15',
    time: '14:00',
    aiCount: 20,
    raceLength: '50 laps',
    weather: [],
  },
  ...overrides,
});

describe('RaceCard - DLC Badge', () => {
  const mockOnClick = vi.fn();

  it('should render DLC badge for races with DLC', () => {
    // Requirements: 4.1, 4.2
    const raceWithDLC = createMockRace({
      ams2: {
        ...createMockRace().ams2,
        requiredDLC: ['Track Pack 1', 'Car Pack 2'],
      },
    });

    render(
      <RaceCard
        race={raceWithDLC}
        layoutId="test-layout"
        gridSpan="col-span-1"
        onClick={mockOnClick}
      />
    );

    const badge = screen.getByTestId('dlc-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-variant', 'card');
    expect(badge).toHaveAttribute('data-dlc', 'Track Pack 1,Car Pack 2');
  });

  it('should not render DLC badge for races without DLC', () => {
    // Requirements: 4.3
    const raceWithoutDLC = createMockRace();

    render(
      <RaceCard
        race={raceWithoutDLC}
        layoutId="test-layout"
        gridSpan="col-span-1"
        onClick={mockOnClick}
      />
    );

    const badge = screen.queryByTestId('dlc-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('should not render DLC badge for races with empty DLC array', () => {
    // Requirements: 4.3
    const raceWithEmptyDLC = createMockRace({
      ams2: {
        ...createMockRace().ams2,
        requiredDLC: [],
      },
    });

    render(
      <RaceCard
        race={raceWithEmptyDLC}
        layoutId="test-layout"
        gridSpan="col-span-1"
        onClick={mockOnClick}
      />
    );

    const badge = screen.queryByTestId('dlc-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('should position DLC badge in top-right corner', () => {
    // Requirements: 4.1
    const raceWithDLC = createMockRace({
      ams2: {
        ...createMockRace().ams2,
        requiredDLC: ['Test DLC'],
      },
    });

    const { container } = render(
      <RaceCard
        race={raceWithDLC}
        layoutId="test-layout"
        gridSpan="col-span-1"
        onClick={mockOnClick}
      />
    );

    // Find the badge container (parent div with positioning classes)
    const badgeContainer = container.querySelector('.absolute.top-3.right-3.z-20');
    expect(badgeContainer).toBeInTheDocument();
    
    // Verify badge is inside the positioned container
    const badge = badgeContainer?.querySelector('[data-testid="dlc-badge"]');
    expect(badge).toBeInTheDocument();
  });
});
