# QuikBroker Fix Plan

## 1. Link Component Href String Type Errors

Next.js Link components should use object notation with pathname for href props. These files need to be updated:

### High Priority
- `/Users/gb/github/quikbroker/packages/app/src/app/support/page.tsx`
  - Line 39: `<Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">`
  - Line 217: `Having trouble? <Link href="/support" className="text-primary hover:underline font-medium">Contact support</Link>`

- `/Users/gb/github/quikbroker/packages/app/src/app/verify-email/page.tsx`
  - Line 217: `Having trouble? <Link href="/support" className="text-primary hover:underline font-medium">Contact support</Link>`

- `/Users/gb/github/quikbroker/packages/app/src/app/dashboard/layout.tsx`
  - Line 163: `<Link href="/logout">`

- `/Users/gb/github/quikbroker/packages/app/src/app/login/page.tsx`
  - Line 144: `<Link href="/signup" className="text-primary hover:underline font-medium">`

- `/Users/gb/github/quikbroker/packages/app/src/app/signup/page.tsx`
  - All string href instances

- `/Users/gb/github/quikbroker/packages/app/src/app/dashboard/admin/page.tsx`
  - All string href instances

### Medium Priority
Check all remaining components using Link for string hrefs, including:
- `/Users/gb/github/quikbroker/packages/app/src/app/page.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/app/dashboard/carriers/documents/page.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/app/dashboard/carriers/[carrierId]/documents/page.tsx`
- All other pages with Link components

## 2. Unescaped Entities in JSX

Many files contain unescaped apostrophes that should be replaced with `&apos;` or similar HTML entities:

### High Priority
- `/Users/gb/github/quikbroker/packages/app/src/app/support/page.tsx`
  - Already fixed

### Medium Priority
Check these files for unescaped entities:
- `/Users/gb/github/quikbroker/packages/app/src/components/marketing/Header.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/components/marketing/Footer.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/app/page.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/components/marketing/CtaSection.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/app/verify-email/page.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/components/ui/form-field.tsx`

## 3. Unused Imports

Check these files for unused imports:
- `/Users/gb/github/quikbroker/packages/app/src/app/support/page.tsx` (Label)
- `/Users/gb/github/quikbroker/packages/app/src/components/marketing/Header.tsx`
- `/Users/gb/github/quikbroker/packages/app/src/components/marketing/Footer.tsx`
- All other components flagged by ESLint for unused imports

## Implementation Plan

1. **Fix Link Component Href Types**:
   - Systematically update each file to use object notation for href props
   - Update all array mapping functions to use the pathname property for keys

2. **Fix Unescaped Entities**:
   - Replace all instances of unescaped apostrophes with `&apos;`
   - Review for other HTML entities that need escaping

3. **Remove Unused Imports**:
   - Remove all unused import statements

4. **Verification**:
   - Run ESLint after each set of fixes
   - Run TypeScript type checking after each set of fixes
   - Ensure all pages render correctly

## Success Criteria

- No TypeScript type errors in the codebase
- No ESLint warnings or errors
- All components use consistent patterns according to the `NEXT_JS_BEST_PRACTICES.md` document