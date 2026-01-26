import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CinematicHero } from './CinematicHero';
import type { Race } from '@/lib/types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock useReducedMotion hook
vi.mock('@/lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ alt, priority, ...props }: any) => (
    <img alt={alt} data-priority={priority} {...props} />
  ),
}));

const mockRace: Race = {
  id: 'test-race',
  title: 'Monaco Grand Prix',
  driver: 'Ayrton Senna',
  year: 1988,
  heroImage: '/test-image.jpg',
  raceContext: {
    circuit: 'Monaco, Monte Carlo',
    date: '1988-05-15',
    weather: 'Wet',
  },
  ams2: {
    vehicleClassName: 'Formula Classic Gen 3',
    date: '1988-05-15',
  },
  tags: ['wet', 'street-circuit'],
};

describe('CinematicHero Accessibility', () => {
  it('should have proper ARIA label', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const hero = screen.getByRole('button');
    expect(hero).toHaveAttribute('aria-label', 'View details for Monaco Grand Prix - Ayrton Senna, 1988');
  });

  it('should be keyboard navigable with tabIndex', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const hero = screen.getByRole('button');
    expect(hero).toHaveAttribute('tabIndex', '0');
  });

  it('should handle Enter key press', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const hero = screen.getByRole('button');
    hero.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle Space key press', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const hero = screen.getByRole('button');
    hero.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have priority loading on hero image', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const image = screen.getByAltText(/Monaco Grand Prix/);
    expect(image).toHaveAttribute('data-priority', 'true');
  });

  it('should have proper alt text on image', () => {
    const onClick = vi.fn();
    render(<CinematicHero race={mockRace} onClick={onClick} />);
    
    const image = screen.getByAltText('Monaco Grand Prix - Ayrton Senna at Monaco, Monte Carlo');
    expect(image).toBeInTheDocument();
  });
});
