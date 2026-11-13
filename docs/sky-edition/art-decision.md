# Static art decision — 2026-11-12

Selected: **B · Sky Ribbon**, theme **Skylight XUANYI**.

Actual Chromium screenshots at 1440×900, 768×1024, 390×844 and 320×740 were inspected before connecting motion. Both are rendered prototypes, with different geometry, diffuse materials, layouts and mobile composition. These are not generated mockups. Source baseline is PR #4 31222d9 whose production homepage remains 2.2.

| Criterion | A · Cloud Silk | B · Sky Ribbon |
| --- | --- | --- |
| Character | Soft white center, broad silk cross-section | More tension and twist, thin visible rim |
| Composition | Centered sentence and sculpture | Left editorial sentence, right sculpture |
| Recognition | Pleasant, but reads as a general soft ribbon | Stronger X silhouette and directional contrast |
| Space | Balanced, slightly static | More open negative space between type and sculpture |
| Phone | Centered, comfortable, a little generic | Asymmetric X with caption in left breathing space |
| Decision | Archive prototype | Continue into interactive preview |

The first capture exposed text/sculpture collisions on phone and an oversized desktop sculpture. The renderer's neighboring strips also showed antialias seams. Those were corrected by allocating separate text/sculpture lanes and drawing a subpixel same-material overlap. Revised static captures are the acceptance baseline. The 320px CTA fits before the first viewport ends.

Palette: cloud white `#f8fbfd`, sky veil `#e6f2fb`, daylight blue `#b9d9f0`, blue ink `#253f55`, air grey `#5b7285`. White ribbon has a very faint warm light cast, rather than an orange second band. Diffuse normal lighting, approximately 4 SVG units of visible edge, localized contact shadow, one soft ground shadow. No metal, plastic specular, sky photos, bubbles or particles.

This is sampled 3D surface geometry projected into SVG, not a WebGL scene. It supports the deliberately shallow views needed here. It does not establish an arbitrary-angle 3D logo or volumetric transparency. That limitation is acceptable for this lightweight validation.

Static approval here is the agent's art decision delegated by the user's brief, not a claim that the user has reviewed or approved a production replacement.
