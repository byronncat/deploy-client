import { useDebounce, useWindowDimensions, windowUtility } from '@global';
import { renderHook, act, fireEvent } from '@testing-library/react';

describe('hooks', () => {
  describe('useDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers('legacy');
      jest.spyOn(global, 'setTimeout');
      jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should debounce the input value after 5s', () => {
      enum USE_DEBOUNCE {
        DEBOUNCED_VALUE = 0,
        SET_VALUE,
        VALUE,
      }

      const { result, rerender } = renderHook(() => useDebounce('t', 5000));

      act(() => {
        result.current[USE_DEBOUNCE.SET_VALUE]('test');
        jest.advanceTimersByTime(1000);
        rerender();
      });

      expect(result.current[USE_DEBOUNCE.DEBOUNCED_VALUE]).toBe('t');
      expect(result.current[USE_DEBOUNCE.VALUE]).toBe('test');

      act(() => {
        jest.runAllTimers();
        rerender();
      });
      expect(setTimeout).toHaveBeenCalledTimes(2);
      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(result.current[USE_DEBOUNCE.DEBOUNCED_VALUE]).toBe('test');
    });
  });

  describe('useWindowDimentsions', () => {
    it('should return the window dimensions', () => {
      const { result } = renderHook(() => useWindowDimensions());
      expect(result.current.width).toBe(window.innerWidth);
      expect(result.current.height).toBe(window.innerHeight);
    });

    it('should return the window dimensions after resizing', async () => {
      const { result } = renderHook(() => useWindowDimensions());
      await act(() => {
        window.innerWidth = 1000;
        window.innerHeight = 1000;
        fireEvent(window, new Event('resize'));
      });
      expect(result.current.width).toBe(1000);
      expect(result.current.height).toBe(1000);
    });

    describe('if window is not defined', () => {
      const realIsWindowDefined = windowUtility.isWindowDefined;

      afterEach(() => {
        windowUtility.isWindowDefined = realIsWindowDefined;
      });

      it('should return 0 for width and height ', () => {
        windowUtility.isWindowDefined = jest.fn().mockReturnValue(false);
        const { result } = renderHook(() => useWindowDimensions());
        expect(result.current.width).toBe(0);
        expect(result.current.height).toBe(0);
      });
    });
  });
});
