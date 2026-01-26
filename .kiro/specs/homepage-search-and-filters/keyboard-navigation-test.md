# Keyboard Navigation Testing Guide

## Overview
This guide provides step-by-step instructions for testing keyboard navigation and accessibility features of the homepage search and filters.

## Prerequisites
- Application running locally or deployed
- Keyboard only (disconnect mouse or don't use it)
- Optional: Screen reader (NVDA, JAWS, or VoiceOver)

## Test Scenarios

### 1. Skip Link Navigation

**Steps:**
1. Load the homepage
2. Press `Tab` once
3. **Expected:** Skip link appears with text "Skip to main content"
4. Press `Enter`
5. **Expected:** Focus moves to main content area (race grid)

**Pass Criteria:**
- ✅ Skip link is visible when focused
- ✅ Skip link has red background with white text
- ✅ Pressing Enter jumps to main content
- ✅ Focus indicator is clearly visible

---

### 2. Search Input Navigation

**Steps:**
1. Load the homepage
2. Press `Tab` until search input is focused
3. **Expected:** Search input has red focus ring
4. Type "Senna"
5. **Expected:** Results filter after 150ms delay
6. Press `Tab`
7. **Expected:** Clear button (X) receives focus

**Pass Criteria:**
- ✅ Search input has visible focus indicator
- ✅ Can type in search field
- ✅ Results update automatically
- ✅ Clear button is keyboard accessible
- ✅ Screen reader announces "Search races by driver, year, or class"

---

### 3. Clear Search Button

**Steps:**
1. Type text in search input
2. Press `Tab` to focus clear button
3. **Expected:** Clear button (X) has focus ring
4. Press `Enter` or `Space`
5. **Expected:** Search clears and all races return

**Pass Criteria:**
- ✅ Clear button receives focus
- ✅ Both Enter and Space activate the button
- ✅ Search query clears
- ✅ Results update to show all races
- ✅ Screen reader announces "Clear search"

---

### 4. Filter Chip Navigation

**Steps:**
1. Press `Tab` until first filter chip is focused
2. **Expected:** Filter chip has red focus ring
3. Press `Space` or `Enter`
4. **Expected:** Filter activates (red background, white text)
5. Press `Tab` to next filter chip
6. Press `Space` to activate
7. **Expected:** Both filters are active, results show OR logic

**Pass Criteria:**
- ✅ All filter chips are keyboard accessible
- ✅ Both Space and Enter toggle filters
- ✅ Active state is visually clear (red background)
- ✅ Focus indicator visible on all chips
- ✅ Screen reader announces "Filter by [Class], [X] races, pressed/not pressed"

---

### 5. Reset Filters Button

**Steps:**
1. Activate at least one filter chip
2. Press `Tab` until "Reset Filters" button is focused
3. **Expected:** Button has focus ring
4. Press `Enter` or `Space`
5. **Expected:** All filters clear, search remains

**Pass Criteria:**
- ✅ Button only appears when filters are active
- ✅ Button receives focus
- ✅ Both Enter and Space activate button
- ✅ All filters clear
- ✅ Search query remains unchanged
- ✅ Screen reader announces "Reset all filters"

---

### 6. Clear All Button

**Steps:**
1. Type in search AND activate a filter
2. Press `Tab` until "Clear All" button is focused
3. **Expected:** Button has focus ring (red border)
4. Press `Enter` or `Space`
5. **Expected:** Both search and filters clear

**Pass Criteria:**
- ✅ Button appears when search OR filters are active
- ✅ Button receives focus
- ✅ Both Enter and Space activate button
- ✅ Search clears
- ✅ All filters clear
- ✅ All races return
- ✅ Screen reader announces "Clear all search and filters"

---

### 7. Race Card Navigation

**Steps:**
1. Press `Tab` until first race card is focused
2. **Expected:** Race card has visible focus indicator
3. Press `Enter` or `Space`
4. **Expected:** Navigate to race detail page
5. Press browser back button
6. **Expected:** Return to homepage with focus restored

**Pass Criteria:**
- ✅ Race cards are keyboard accessible
- ✅ Focus indicator is visible
- ✅ Enter activates navigation
- ✅ Focus management works correctly

---

### 8. Tab Order Verification

**Complete Tab Order:**
1. Skip link (on first tab)
2. Search input
3. Clear search button (if search has text)
4. Filter chip 1
5. Filter chip 2
6. Filter chip N...
7. Reset Filters button (if filters active)
8. Clear All button (if search or filters active)
9. Race card 1
10. Race card 2
11. Race card N...

**Pass Criteria:**
- ✅ Tab order is logical and predictable
- ✅ No keyboard traps (can tab through entire page)
- ✅ Shift+Tab reverses direction correctly
- ✅ Hidden elements (clear button, reset button) don't receive focus when not visible

---

### 9. Screen Reader Announcements

**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to homepage
3. **Expected:** Hero section announces title and statistics
4. Tab to search input
5. **Expected:** "Search races by driver, year, or class, searchbox"
6. Type "Senna"
7. **Expected:** After delay, "Found 1 race matching your search and filters"
8. Tab to filter chip
9. **Expected:** "Filter by F1, 5 races, button, not pressed"
10. Activate filter
11. **Expected:** "pressed" state announced
12. **Expected:** "Found X races matching your search and filters"

**Pass Criteria:**
- ✅ All interactive elements have descriptive labels
- ✅ Live region announces result count changes
- ✅ Filter state (pressed/not pressed) is announced
- ✅ Buttons announce their purpose
- ✅ Statistics are announced with context

---

### 10. Empty State Navigation

**Steps:**
1. Type search query that returns no results (e.g., "xyz123")
2. **Expected:** Empty state appears
3. Press `Tab` until "Clear All" button in empty state is focused
4. **Expected:** Button has focus ring
5. Press `Enter`
6. **Expected:** Search clears, all races return

**Pass Criteria:**
- ✅ Empty state heading is announced by screen reader
- ✅ Clear All button is keyboard accessible
- ✅ Button has descriptive label
- ✅ Activating button restores all races

---

### 11. Focus Visibility Test

**Steps:**
1. Navigate through entire page using only Tab key
2. Observe focus indicator on each element

**Pass Criteria:**
- ✅ Focus indicator is visible on ALL interactive elements
- ✅ Focus ring is at least 2px wide
- ✅ Focus ring color (#dc0000) contrasts with background
- ✅ Focus ring has offset for better visibility
- ✅ No elements have invisible or unclear focus states

---

### 12. Reduced Motion Test

**Steps:**
1. Enable reduced motion in OS settings:
   - Windows: Settings > Ease of Access > Display > Show animations
   - macOS: System Preferences > Accessibility > Display > Reduce motion
   - Linux: Varies by desktop environment
2. Reload homepage
3. Interact with search and filters

**Pass Criteria:**
- ✅ Page loads without animations
- ✅ Filter changes happen instantly (no animation)
- ✅ All functionality works without animations
- ✅ No jarring motion or transitions

---

## Automated Testing

### Browser DevTools Accessibility Audit

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Run audit
5. **Expected:** Score 95+ with no critical issues

**Firefox:**
1. Open DevTools (F12)
2. Go to Accessibility tab
3. Check for violations
4. **Expected:** No violations

### axe DevTools Extension

1. Install axe DevTools browser extension
2. Navigate to homepage
3. Run scan
4. **Expected:** No violations or only minor issues

---

## Common Issues to Watch For

### ❌ Keyboard Traps
- User cannot tab out of a component
- Focus gets stuck in a loop

### ❌ Invisible Focus
- Focus indicator is too subtle or missing
- User cannot tell which element is focused

### ❌ Incorrect Tab Order
- Tab order doesn't follow visual layout
- Hidden elements receive focus

### ❌ Missing Labels
- Buttons or inputs without descriptive labels
- Screen reader announces generic "button" or "edit"

### ❌ No Keyboard Activation
- Element only responds to mouse clicks
- Space or Enter don't activate buttons

---

## Success Criteria Summary

✅ **All interactive elements are keyboard accessible**
✅ **Tab order is logical and predictable**
✅ **Focus indicators are visible on all elements**
✅ **Screen reader announces all content correctly**
✅ **No keyboard traps exist**
✅ **Skip link allows bypassing navigation**
✅ **Live regions announce dynamic content**
✅ **All buttons respond to Enter and Space**
✅ **Color contrast meets WCAG AA standards**
✅ **Reduced motion preference is respected**

---

## Reporting Issues

If you find any accessibility issues during testing:

1. **Document the issue:**
   - What element is affected
   - What you expected to happen
   - What actually happened
   - Steps to reproduce

2. **Severity levels:**
   - **Critical:** Prevents keyboard-only users from accessing core functionality
   - **High:** Makes functionality difficult but not impossible
   - **Medium:** Minor inconvenience or inconsistency
   - **Low:** Enhancement or nice-to-have

3. **Include context:**
   - Browser and version
   - Screen reader (if applicable)
   - Operating system
   - Any assistive technology used

---

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Keyboard Accessibility](https://webaim.org/articles/keyboard/)
- [MDN ARIA Best Practices](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
