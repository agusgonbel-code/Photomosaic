# PhotoMosaic — TestFlight-style QA + simulated 100-user review
Fecha: 22/08/2026

## Scope
Repository-level TestFlight-style audit plus a structured simulation of 100 user journeys. This is not a claim that 100 real people used a signed TestFlight build. HEIC decoding, Share Sheet, memory pressure and final safe-area behaviour still require real iPhone/iPad hardware.

## TestFlight-style journeys reviewed
- Entry screen choosing Mosaic or Wall Shape.
- Main-photo and tile selection.
- 10–300 image mosaic flows.
- Shape selection and custom drawing.
- Minimum/maximum valid photo count.
- Crop/selection trimming.
- Physical wall dimensions and spacing.
- Preview, numbered plan and CSV coordinates.
- JPEG/PNG export, offline shell and iOS packaging.

## Findings
### P0
No new reproducible P0 defect was found in the current repository-level review.

### P1 / release risks
1. HEIC support depends on the real decoder available on the device/browser and must fail clearly.
2. Large photo selections can create memory pressure and must be checked on small-memory devices.
3. Share/Save behaviour must be verified in both Safari and the native wrapper.
4. Preview, numbered plan and CSV must remain geometrically identical after every wall-size change.

## Simulated 100-user feedback
Aggregate simulated personas included casual collage users, users preparing real wall layouts, users with 10/50/150/300 images, custom-shape users, small-screen users and interrupted generation flows.

Most important themes:
- Users immediately understand the product better when Mosaic and Wall Shape are separate entry paths.
- Wall-shape users care more about exact physical measurements than artistic preview effects.
- Users expect the app to tell them the valid number of photos before they spend time selecting them.
- Large selections need visible progress and safe cancellation without losing the project.
- Export trust depends on preview, plan and CSV agreeing exactly.

## Changes applied in this QA cycle
- Added `.github/workflows/release-stress.yml`.
- Unit suite repeats 10 times in the stress gate.
- Browser journey repeats 10 times in the stress gate.

## Release verdict
Repository candidate: GO WITH PHYSICAL-DEVICE GATE.
Do not submit to App Review until the signed build passes real-device HEIC, memory, custom touch drawing, Share/Save, safe-area and export consistency checks.
