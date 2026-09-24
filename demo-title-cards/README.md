# Demo title cards

Static first-frame cards for OIBSIP demo videos (2 seconds each). Each card matches the art direction of its task (no shared template look).

## Files

| File | Task | Look |
|------|------|------|
| `01-LandingPage.png` | L1 Task 1 - Landing Page | Editorial newspaper |
| `02-PersonalPortfolio.png` | L1 Task 2 - Personal Portfolio | Print CV / lined sheet |
| `03-TemperatureConverter.png` | L1 Task 3 - Temperature Converter | Lab worksheet / graph paper |
| `04-Calculator.png` | L2 Task 1 - Calculator | Physical device / beige + LCD |
| `05-TributePage.png` | L2 Task 2 - Tribute Page | Archive letterpress / oxblood |
| `06-TodoApp.png` | L2 Task 3 - To-Do App | Notebook page / handwriting |
| `07-LoginAuth.png` | L2 Task 4 - Login Auth | Brutalist / hazard yellow |

Each `.png` is **1920x1080**, ready to drop into a video editor.

## How to use in the demo video

1. Place the matching `.png` as the first clip, duration **2 seconds**.
2. Cut straight to the screen recording (page walkthrough, 15-45s).
3. Export MP4 1080p.
4. Upload unlisted (Drive/YouTube) and link in README / LinkedIn.

## Regenerate PNGs

Open the matching `.html` in a browser and screenshot at 1920x1080, or:

```bash
cd demo-title-cards
# example with headless Brave (writes into this folder; snap /tmp is private)
snap run brave --headless=new --screenshot="$PWD/01-LandingPage.png" --window-size=1920,1080 \
  "file://$PWD/01-LandingPage.html"
```

## Author

Bilal Malik / `#oasisinfobyte`
