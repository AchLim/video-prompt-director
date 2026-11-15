# Cinematic Bible: one film's visual identity

Contents:
1. What it is for
2. Layered on the project look
3. Keep the components separate
4. Translate references into what a frame shows
5. Light and grade per location
6. The sent paragraph
7. Template
8. Checks before approval

## 1. What it is for

A Cinematic Bible fixes how one film looks before any storyboard is drawn, so that every shot is photographed by the same eye. Each clip is generated on its own and can't see the others: without a bible, every prompt invents its own lens, light and grade, and the cut-together film looks like a collection of clips. The bible is written once per film, approved, and then read by the breakdown, the storyboard and every prompt.

A bible is not a list of brand names. A static close-up with good acting, composition, light and timing is more cinematic than an elaborate move; the bible exists to make those choices consistent, not to add technique.

## 2. Layered on the project look

A channel or series usually has a baseline (production quality, face treatment, no text on screen). The film's bible says which of those it **keeps** and which it **overrides** for its own story, and why. Don't force every film into one look, and don't silently drop the project's baseline either. See `references/visual-direction.md` for project looks.

## 3. Keep the components separate

These are different decisions. Choose each for the story; don't buy them as a bundle.

| Component | Decides | Example choices |
|---|---|---|
| Camera reference | The overall image response the film imitates | a digital cinema camera with a gentle, filmic roll-off; 16 mm reversal; clean broadcast video |
| Lenses | Character of the optics | spherical primes with soft falloff; anamorphic only when the story earns the oval bokeh and flares |
| Focal range | What each size is for | 35 mm for geography, 50 mm for two people, 85 mm for faces and inserts |
| Depth of field | How much of the world stays readable | moderate for social scenes; shallow only for isolation |
| Movement | When the camera may move | locked off by default; one motivated move per scene at most |
| Composition and height | Point of view | at a child's eye height; the hero small in big frames outside, close at home |
| Ratio and frame rate | Delivery | 16:9 24 fps; 9:16 for vertical drama |
| Stock-like response | Highlights, contrast, grain, colour, skin, saturation, sharpness | a daylight stock response for exteriors (for example Kodak Vision3 250D) and a tungsten one at night (500T), as references only |
| Lighting | Key, fill, back, practicals, natural versus artificial, direction | every light motivated by a source in the scene |
| Grade | Palette, highlight and shadow colour, skin, white balance, contrast | cold exteriors, amber interiors, one accent colour reserved for the hero |
| Production design | Environment, architecture, furniture, props, wardrobe, appearance | worn and specific, never catalogue-new |

Don't apply one stock or camera to every production. Pick per film, and per time of day inside a film when the story moves from day to night.

## 4. Translate references into what a frame shows

Video models render descriptions of images, not equipment. "Shot on ARRI Alexa 35 with Kodak 500T" may change nothing, or may pull in unrelated looks. Keep the reference names in the bible for the humans, and translate each into visible properties for the model:

| Reference | Translate into |
|---|---|
| A filmic digital cinema camera | soft highlight roll-off, gentle contrast, natural skin texture, no oversharpening |
| Kodak Vision3 500T-like at night | warm tungsten practicals, cool blue-green shadows, fine visible grain, highlights that bloom slightly |
| Spherical primes, 35 mm | moderate perspective, the room readable behind the actors, round out-of-focus lights |
| Anamorphic | horizontal flares from bare bulbs, oval bokeh, slightly soft edges (only if chosen) |

These are visual references, not claims that a video model reproduces the equipment.

## 5. Light and grade per location

Give every location and time of day one line: where the key comes from (screen side), the practicals, and the grade. Keep it identical in every shot there. A prompt that lacks it lets the model choose a new exposure and grade per clip (one production observed about 10% brightness and 30% saturation drift between adjacent clips in one room).

## 6. The sent paragraph

The bible ends with one short paragraph that is actually sent in every prompt (around 400 to 900 characters): the visible look only, no brand or stock names, no shot-specific choices. The per-location line from section 5 is sent with the shots in that location. Everything else in the bible guides the storyboard and the prompt writer, not the model directly.

## 7. Template

```
Channel layer kept: <...>            Overridden for this film: <... and why>
Camera: reference <...>; lenses <...>; focal range <...>; depth of field <...>; movement <...>; composition <...>; height <...>; ratio <...>; fps <...>
Image: reference <...>; highlights <...>; contrast <...>; grain <...>; colour <...>; skin <...>; saturation <...>; sharpness <...>
Lighting: approach <...>; key <...>; fill <...>; back <...>; practicals <...>; continuity <...>
Grade: palette <...>; highlights <...>; shadows <...>; skin <...>; white balance <...>; contrast <...>
Locations: | location | time | light | grade |
Design: environment <...>; architecture <...>; furniture <...>; props <...>; wardrobe <...>; appearance <...>
Sent: <one paragraph of visible properties>
Avoid: <only concrete faults this look tends to produce>
```

## 8. Checks before approval

- Every scene's location and time has a light-and-grade line.
- The sent paragraph names no equipment or stock, and describes properties a frame can show.
- Each choice can be justified by the story (why locked off, why this height, why this palette).
- Nothing contradicts the reference images (wardrobe, faces, sets).
- The ratio matches the storyboard and the delivery.
