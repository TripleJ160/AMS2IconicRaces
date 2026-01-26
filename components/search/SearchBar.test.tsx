import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce behavior', () => {
    it('should debounce onChange callback with 150ms delay', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);

      // Type multiple characters rapidly
      fireEvent.change(input, { target: { value: 's' } });
      fireEvent.change(input, { target: { value: 'se' } });
      fireEvent.change(input, { target: { value: 'sen' } });

      // onChange should not be called immediately
      expect(onChange).not.toHaveBeenCalled();

      // Advance timers by 149ms (just before debounce)
      vi.advanceTimersByTime(149);
      expect(onChange).not.toHaveBeenCalled();

      // Advance timers by 1ms more (total 150ms)
      vi.advanceTimersByTime(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('sen');
    });

    it('should reset debounce timer on each keystroke', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);

      // First keystroke
      fireEvent.change(input, { target: { value: 's' } });
      vi.advanceTimersByTime(100);

      // Second keystroke (resets timer)
      fireEvent.change(input, { target: { value: 'se' } });
      vi.advanceTimersByTime(100);

      // onChange should not be called yet (only 100ms since last keystroke)
      expect(onChange).not.toHaveBeenCalled();

      // Advance remaining 50ms
      vi.advanceTimersByTime(50);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('se');
    });
  });

  describe('clear button visibility', () => {
    it('should not show clear button when value is empty', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const clearButton = screen.queryByLabelText(/clear search/i);
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should show clear button when value is non-empty', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="senna" onChange={onChange} onClear={onClear} />);

      const clearButton = screen.getByLabelText(/clear search/i);
      expect(clearButton).toBeInTheDocument();
    });

    it('should show clear button after typing', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);
      fireEvent.change(input, { target: { value: 'test' } });

      const clearButton = screen.getByLabelText(/clear search/i);
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('should call onChange with the input value after debounce', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);
      fireEvent.change(input, { target: { value: 'senna' } });

      vi.advanceTimersByTime(150);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('senna');
    });

    it('should call onChange only once for rapid typing', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);

      // Rapid typing
      fireEvent.change(input, { target: { value: 's' } });
      fireEvent.change(input, { target: { value: 'se' } });
      fireEvent.change(input, { target: { value: 'sen' } });
      fireEvent.change(input, { target: { value: 'senn' } });
      fireEvent.change(input, { target: { value: 'senna' } });

      vi.advanceTimersByTime(150);

      // Should only call onChange once with the final value
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('senna');
    });
  });

  describe('onClear callback', () => {
    it('should call onClear when clear button is clicked', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="senna" onChange={onChange} onClear={onClear} />);

      const clearButton = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should clear the input value when clear button is clicked', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="senna" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i) as HTMLInputElement;
      expect(input.value).toBe('senna');

      const clearButton = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearButton);

      expect(input.value).toBe('');
    });

    it('should cancel pending debounced onChange when clear is clicked', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchBar value="" onChange={onChange} onClear={onClear} />);

      const input = screen.getByPlaceholderText(/search by driver/i);
      fireEvent.change(input, { target: { value: 'test' } });

      // Wait 100ms (before debounce completes)
      vi.advanceTimersByTime(100);

      // Click clear button
      const clearButton = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearButton);

      // Advance remaining time
      vi.advanceTimersByTime(50);

      // onChange should not be called because clear was clicked
      expect(onChange).not.toHaveBeenCalled();
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });
});
