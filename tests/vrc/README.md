# Visual Regression Check (VRC) Setup

This directory contains the Visual Regression Check (VRC) system for the Steven Park Eleventy site. VRC helps detect visual changes between development and production versions of the site across multiple devices and browsers.

## Quick Start

1. **Install browsers** (one-time setup):
   ```bash
   npm run test:install
   ```

2. **Run basic VRC tests** (Level 1 pages):
   ```bash
   npm run test:vrc
   ```

## Available Scripts

- `npm run test:vrc` - Run VRC on main pages (Level 1)
- `npm run test:vrc:level2` - Run VRC on main + secondary pages (Level 2)
- `npm run test:vrc:all` - Run VRC on all pages including blog tags (Level 3)
- `npm run test:install` - Install Playwright browsers

## How It Works

The VRC system:

1. **Takes screenshots** of pages on both development (localhost:8080) and production (stevenpark.co.uk) sites
2. **Compares images** pixel-by-pixel using advanced image processing
3. **Generates reports** showing any visual differences found
4. **Tests multiple devices**: Desktop (1600×900), Tablet (768×1024), Mobile (375×812)

## Page Levels

**Level 1** (Core pages - quick test):
- Home, Work, Contact pages
- About section pages
- Key portfolio items
- Utility pages (404, sitemap)

**Level 2** (Extended test):
- Level 1 + all portfolio items
- Additional about pages
- Contact thanks page

**Level 3** (Complete test):
- Level 1 & 2 + all blog tag pages
- Complete site coverage

## Configuration

### URLs
- **Development**: `http://localhost:8080` (configured in `compare-pages.spec.js`)
- **Production**: `https://stevenpark.co.uk` (configured in `compare-pages.spec.js`)

### Thresholds
- **Pixel difference threshold**: 200 pixels (adjustable in `compare-pages.spec.js`)
- **Image comparison sensitivity**: 0.1 (adjustable in pixelmatch options)

## Understanding Results

After running tests, a report opens automatically showing:

- **✅ Pass**: No visual differences detected
- **⚠️ Diff**: Visual differences found (shows comparison images)
- **❌ Error**: Test failed (page load error, etc.)

### Report Features
- Filter results by status (All, Differences Only, Errors Only, Passed Only)
- View side-by-side comparisons for differences
- See exact pixel difference counts
- Navigate directly to problem pages

## File Structure

```
tests/vrc/
├── src/
│   ├── pages-level-1.js     # Main pages definition
│   ├── pages-level-2.js     # Secondary pages
│   └── pages-level-3.js     # All pages including blog tags
├── results/                 # Screenshots and reports (auto-generated)
├── compare-pages.spec.js    # Main test file
├── generateReport.js        # HTML report generator
└── README.md               # This file
```

## Customizing Tests

### Adding New Pages

Edit the appropriate level file in `src/`:

```javascript
// In src/pages-level-1.js
export const pages = [
  {
    path: '/new-page/',
    name: 'new-page'
  },
  // ... existing pages
];
```

### Adjusting Sensitivity

In `compare-pages.spec.js`, modify the pixelmatch threshold:

```javascript
const diffPixelsValue = pixelmatch(
  devImg.data, liveImg.data, diffImg.data,
  minWidth, minHeight, { 
    threshold: 0.1,      // Lower = more sensitive (0.0-1.0)
    includeAA: true 
  }
);
```

### Changing Device Sizes

Modify `deviceConfigs` in `compare-pages.spec.js`:

```javascript
const deviceConfigs = {
  desktop: { width: 1920, height: 1080 },  // Custom size
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 }
};
```

## Troubleshooting

### Common Issues

**"Page load failed"**
- Check if development server is running (`npm start`)
- Verify URLs are accessible
- Check network connectivity

**"Too many differences detected"**
- Fonts may render differently between environments
- Images might have different compression
- Consider adjusting threshold or investigating actual differences

**"Browser not found"**
- Run `npm run test:install` to install Playwright browsers
- Check Playwright installation

### Performance Tips

- Run Level 1 tests during development (faster)
- Use Level 2/3 for comprehensive pre-deployment testing
- Tests run in parallel but may be memory intensive

### Debugging

Enable verbose logging:
```bash
DEBUG=pw:* npm run test:vrc
```

## Best Practices

1. **Run before deployments** to catch visual regressions
2. **Start with Level 1** for quick feedback
3. **Check differences manually** - not all changes are problems
4. **Update baselines** after intentional design changes
5. **Use in CI/CD** for automated regression detection

## Integration with Development Workflow

### Pre-deployment Checklist
1. Run `npm run test:vrc` during development
2. Run `npm run test:vrc:level2` before staging
3. Run `npm run test:vrc:all` before production deployment
4. Review and approve any visual differences

### When to Update Baselines
- After intentional design changes
- When production site is the new reference
- After fixing legitimate visual bugs

The VRC system helps maintain visual consistency across your Eleventy site and catch unintended changes before they reach users.