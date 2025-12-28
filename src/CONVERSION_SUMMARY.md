# Angular to React/Next.js Conversion - Summary

## Overview
This PR converts the DiveIntelligence application from Angular 18 to React 19 with Next.js 16, using MUI (Material-UI) instead of Angular Material.

## What Has Been Completed

### ✅ Core Infrastructure (100%)
- **Next.js 16** with TypeScript and App Router
- **React 19** with modern hooks and patterns
- **MUI v6** (Material-UI) for React components
- **Emotion** for styling (MUI's styling solution)
- Build system fully configured and working
- TypeScript configuration updated for Next.js
- Package dependencies migrated

### ✅ Business Logic Migration (100%)
All core business logic has been successfully migrated from Angular services to framework-agnostic TypeScript:

- `DivePlannerService` - Main dive planning service
- `DiveSettingsService` - Dive configuration settings
- `ChartGeneratorService` - Chart data generation
- `DiveSegmentFactoryService` - Dive segment creation
- `DiveProfile` - Dive profile management
- `DiveSegment` - Individual dive segments
- `BreathingGas` - Gas calculations and standard gases
- `Tissue` - Tissue compartment calculations
- `BuhlmannZHL16C` - Decompression algorithm
- Utility functions (ceiling, floor calculations)
- Duration formatting (human-readable and colon format)
- Application Insights service

### ✅ React Context & State Management
- Created `DivePlannerProvider` React Context
- Custom hook `useDivePlanner()` for accessing dive planner throughout the app
- Proper service instantiation and dependency injection

### ✅ Pages Converted
1. **Home Page (`/`)** - Fully functional with:
   - YouTube video embed
   - "Plan a Dive" button linking to `/new-dive`
   - GitHub issue and discussion links
   - MUI Button components
   - Responsive layout

2. **New Dive Page (`/new-dive`)** - Placeholder created, ready for full implementation

### ✅ Components Created
- `MUIProvider` - Theme provider with Material Design configuration
- `StandardGasList` - Standard gas selection list with MUI List components

### ✅ Assets Migrated
- All images and icons copied to `public/` directory
- Favicon migrated
- GitHub logo SVG available

## What Needs to Be Completed

### Remaining Component Conversions (~40 components)

The Angular application has approximately 40 components that need to be converted to React. The pattern is established and straightforward:

#### Priority 1: Core User Flow Components
1. **NewDive Page Components**:
   - `CustomGasInput` - Custom gas input form
   - `DiveSettings` - Settings configuration panel
   - `StartGasStats` - Starting gas statistics display

2. **DiveOverview Page Components**:
   - `DiveOverview` - Main dive planning view
   - `DivePlan` - List of dive segments
   - `DiveSummary` - Dive statistics summary
   - `CurrentStats` - Current dive state display
   - `ErrorList` - Validation errors

#### Priority 2: Dive Segment Components
3. **Segment Input Pages**:
   - `ChangeDepth` - Depth change segment
   - `ChangeGas` - Gas change segment
   - `MaintainDepth` - Time at depth segment

4. **Segment Input Components**:
   - `NewDepthStats` - New depth calculations
   - `NewGasInput` - Gas selection for segments
   - `NewGasStats` - New gas statistics
   - `NewTimeStats` - Time-based calculations

#### Priority 3: Chart Components
5. **Plotly.js Charts**:
   - `DepthChart` - Depth profile over time
   - `PO2Chart` - Oxygen partial pressure
   - `ENDChart` - Equivalent narcotic depth
   - `CeilingChart` - Decompression ceiling
   - `TissuesCeilingChart` - Tissue compartment ceilings
   - `TissuesPN2Chart` - Nitrogen in tissues
   - `TissuesPHeChart` - Helium in tissues
   - `GraphDialog` - Chart dialog modal

### Conversion Pattern

Each component follows this pattern:

```typescript
// 1. Convert Angular component class to React function component
'use client';  // For client-side interactivity

import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useDivePlanner } from '@/lib/dive-planner-context';

export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 2. Convert @Input() to props
  // 3. Convert @Output() to callback props
  // 4. Use useState for local state
  const [value, setValue] = useState(initialValue);
  
  // 5. Use custom hooks for services
  const divePlanner = useDivePlanner();
  
  // 6. Convert methods to functions
  const handleClick = () => {
    // Logic here
  };
  
  // 7. Return JSX (converted from Angular template)
  return (
    <div>
      {/* Convert Angular Material to MUI components */}
      <Button onClick={handleClick}>Click Me</Button>
      <TextField value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}
```

### Angular to React/MUI Component Mapping

| Angular Material | MUI React Equivalent |
|-----------------|---------------------|
| `<mat-button>` | `<Button>` |
| `<mat-form-field>` + `<input matInput>` | `<TextField>` |
| `<mat-radio-group>` + `<mat-radio-button>` | `<RadioGroup>` + `<Radio>` |
| `<mat-select>` | `<Select>` + `<MenuItem>` |
| `<mat-list>` | `<List>` + `<ListItem>` |
| `<mat-dialog>` | `<Dialog>` |
| `<mat-tooltip>` | `<Tooltip>` |
| `<mat-icon>` | Material Icons or `<Icon>` |
| `<mat-slide-toggle>` | `<Switch>` |
| `mat-elevation-z2` | `<Paper elevation={2}>` |

### Template Syntax Conversion

| Angular | React/JSX |
|---------|-----------|
| `*ngIf="condition"` | `{condition && <div>...</div>}` |
| `*ngFor="let item of items"` | `{items.map(item => <div key={item.id}>...</div>)}` |
| `[(ngModel)]="value"` | `value={value} onChange={(e) => setValue(e.target.value)}` |
| `(click)="onClick()"` | `onClick={() => onClick()}` |
| `[property]="value"` | `property={value}` |
| `[class.active]="isActive"` | `className={isActive ? 'active' : ''}` |

### Styling Approach

Instead of SCSS files, use MUI's `sx` prop for styling:

```typescript
<Box sx={{
  padding: 2,  // theme.spacing(2)
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.dark',
  }
}}>
```

### Testing
- Playwright e2e tests need minimal updates (mostly URL changes)
- No unit tests currently exist (Angular app used Jasmine/Karma but tests were minimal)
- Consider adding React Testing Library for component tests

### Deployment
- Update `staticwebapp.config.json` for Next.js routing
- Azure Static Web Apps supports Next.js
- Build command: `npm run build`
- Output directory: `.next`

## Build Status
✅ **Application builds successfully**
- No TypeScript errors
- No linting errors
- Production build generates optimized output
- All routes compile correctly

## Next Steps

1. **Complete NewDive page** with all child components
2. **Convert DiveOverview page** (main planning interface)
3. **Convert chart components** (use react-plotly.js)
4. **Convert segment pages** (ChangeDepth, ChangeGas, MaintainDepth)
5. **Update e2e tests** for new routing
6. **Test deployment** to Azure Static Web Apps

## Time Estimate

Based on the established pattern:
- **Simple components** (stats displays): 15-30 min each
- **Form components** (inputs): 30-60 min each  
- **Complex components** (charts, main views): 1-2 hours each

**Total estimated time**: 20-30 hours for complete conversion of all ~40 components

## References

- **Next.js Documentation**: https://nextjs.org/docs
- **MUI Documentation**: https://mui.com/material-ui/getting-started/
- **React Documentation**: https://react.dev/
- **Plotly.js React**: https://plotly.com/javascript/react/

## Notes

- All business logic is framework-agnostic and fully functional
- The decompression algorithm (Bühlmann ZHL-16C) is unchanged
- No breaking changes to dive planning calculations
- MUI provides better TypeScript support than Angular Material
- Next.js App Router provides better performance and SEO
- The conversion maintains 100% feature parity capability
