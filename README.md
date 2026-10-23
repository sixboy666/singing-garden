# 🎵 Singing Garden — Pixel Garden

**Plant pixel flowers, teach them a tune, and conduct a tiny choir.**

## About

Singing Garden is an HTML5 toy that mixes plant nurturing with music making. Plant flowers in a garden, tap them to hear them sing, water them to enrich their harmony, and drag across the garden to conduct them. Every plant is drawn on a 24×30 pixel grid and every sound is synthesised in the browser.

## Features

- **12 plant species** — Luna Bloom, Ember Lily, Aurora Tulip, Crystal Daisy, Neon Rose, Solar Sun, Frost Fern, Violet Bell, Glow Moss, Star Orchid, Plasma Peony and Comet Vine. Each has its own pixel sprite, rhythm pattern and voice, all tuned to a C-major pentatonic scale so any combination stays in key.
- **Four switchable scenes** — Meadow, Sakura Grove, Desert Oasis and Snowfield. Each has its own palette, sky, ground props and ambient particles.
- **Pixel art everywhere** — hard-edged UI, block shadows, monospace type, stepped frame animation. No external fonts or image assets.
- **Musical toys** — Play a melody, build a Harmony choir, or unleash Chaos. Conduct mode lets you sweep the pointer across plants to make them sing in sequence.
- **Personality** — plants blink, blush, sneeze, gossip, hum and doze off. Overwater one and the sneeze spreads to its neighbours.
- **No external assets** — graphics are inline SVG, particles are canvas rectangles, sound is Web Audio API synthesis.

## How to Play

1. **Plant** — pick a seed in the dock, tap an empty plot.
2. **Sing** — tap a bloomed plant to hear its phrase.
3. **Water** — switch to Water mode and tap a plant; up to three waterings deepen its sound.
4. **Conduct** — switch to Conduct mode and drag across the garden.
5. **Scenes** — tap the flower button in the top bar, or press `N`, to change world.

## Keyboard Shortcuts

`Space` play melody · `1` plant mode · `2` conduct mode · `3` water mode · `N` next scene · `M` mute · `C` clear · `X` chaos · `H` help

## Tech Stack

- Pure HTML5 / CSS3 / JavaScript, no frameworks, no build step
- Web Audio API for all music and sound effects
- Inline SVG (integer grid + `crispEdges`) for plants and scenery
- Canvas rectangles for particles

## Browser Support

Any modern browser with Web Audio API support (Chrome, Firefox, Safari, Edge).

## License

Free to play and modify.
