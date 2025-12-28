# Angular to React/Next.js Conversion Status

## Completed

### Core Infrastructure
- ✅ Next.js 16 setup with TypeScript
- ✅ MUI (Material-UI) theme provider configured
- ✅ App router structure established  
- ✅ All business logic migrated (dive planner service, algorithms, models)
- ✅ Application Insights service ported
- ✅ React Context provider for dive planner state
- ✅ Build system working successfully

### Pages Converted
- ✅ Home page (`/`) - with YouTube embed and GitHub links
- ⏳ New Dive page (`/new-dive`) - placeholder created, needs full implementation

## Remaining Work

### Components to Convert (from Angular to React)

The following Angular components need to be converted to React functional components with MUI:

#### Core Pages
- [ ] `new-dive` - Gas selection and dive configuration
- [ ] `dive-overview` - Main dive view with all charts and segments
- [ ] `change-depth` - Change depth segment  
- [ ] `change-gas` - Change gas segment
- [ ] `maintain-depth` - Maintain depth segment

#### Display Components  
- [ ] `dive-plan` - Dive segments list
- [ ] `dive-summary` - Summary statistics
- [ ] `current-stats` - Current dive statistics
- [ ] `error-list` - Validation errors display

#### Input Components
- [ ] `standard-gas-list` - Standard gas selection list
- [ ] `custom-gas-input` - Custom gas input form
- [ ] `new-gas-input` - New gas input for segments
- [ ] `dive-settings` - Dive settings configuration

#### Stats Components
- [ ] `start-gas-stats` - Starting gas statistics
- [ ] `new-depth-stats` - New depth statistics  
- [ ] `new-gas-stats` - New gas statistics
- [ ] `new-time-stats` - New time statistics

#### Chart Components (using plotly.js)
- [ ] `depth-chart` - Depth over time chart
- [ ] `po2-chart` - PO2 levels chart
- [ ] `end-chart` - END (Equivalent Narcotic Depth) chart
- [ ] `ceiling-chart` - Ceiling chart
- [ ] `tissues-ceiling-chart` - Tissue ceilings chart
- [ ] `tissues-pn2-chart` - Tissue PN2 chart
- [ ] `tissues-phe-chart` - Tissue PHe chart
- [ ] `graph-dialog` - Chart dialog modal

### Angular to React Conversion Pattern

For each component, follow this pattern:

1. **Convert Component Class to Function Component**
   ```typescript
   // Angular
   @Component({...})
   export class MyComponent {
     constructor(private service: Service) {}
   }
   
   // React
   'use client';
   export default function MyComponent() {
     const service = useService();
   }
   ```

2. **Replace Angular Template with JSX**
   - `*ngIf` → `{condition && <div>...</div>}`
   - `*ngFor` → `{array.map(item => <div key={item.id}>...</div>)}`
   - `[(ngModel)]` → `useState` + `onChange`
   - `(click)` → `onClick`
   - `[property]` → `property={value}`

3. **Convert Angular Material to MUI**
   - `mat-button` → `<Button variant="contained">`
   - `mat-form-field` + `mat-input` → `<TextField>`
   - `mat-radio-group` + `mat-radio-button` → `<RadioGroup>` + `<Radio>`
   - `mat-select` → `<Select>`
   - `mat-list` → `<List>` + `<ListItem>`
   - `mat-dialog` → `<Dialog>`
   - `mat-tooltip` → `<Tooltip>`
   - `mat-icon` → `<Icon>` or Material Icons

4. **Convert SCSS to MUI sx prop or styled components**
   ```typescript
   // Instead of SCSS
   <Box sx={{ 
     padding: 2, 
     display: 'flex', 
     flexDirection: 'column' 
   }}>
   ```

5. **Replace Angular Services with React Hooks**
   - Use `useDivePlanner()` context hook
   - Use `useState` for local state
   - Use `useEffect` for lifecycle
   - Use `useRouter` from `next/navigation` for routing

### Testing
- [ ] Update e2e tests for Next.js routing
- [ ] Playwright tests need minor adjustments for new URLs
- [ ] No component unit tests currently exist (Angular used Jasmine)

### Configuration
- [ ] Update static web app configuration for Next.js
- [ ] Verify deployment settings for Azure
- [ ] Update any CI/CD pipelines

## Notes

- All TypeScript business logic has been successfully ported and is framework-agnostic
- The decompression algorithm and calculations remain unchanged
- MUI provides equivalent or better components for all Angular Material usage
- Next.js app router provides better performance and SEO than Angular's router
