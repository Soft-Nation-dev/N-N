# Nwaamaka & Nnaemeka Wedding Website Brief

Working reference for the wedding website. This document should be updated as decisions are finalized.

- Last updated: 10 August 2026
- Current milestone: Review and refine the complete invitation experience against the reference video
- Implementation status: The envelope opening and full responsive invitation page are implemented locally

## Project Identity

- Website title: **Nwaamaka Weds Nnaemeka**
- Subtitle: **The Countdown to “I Do”**
- Wedding story/theme name: **Vanilla Love Story**
- Couple:
  - **Nwaamaka Annastecia Ogba**
  - **Nnaemeka Henry Ngene**
- Proposed seal monogram: **N & N** (working assumption; can be changed)

## Primary Invitation Copy

### VANILLA LOVE STORY

Together with their families

**Mr. & Mrs. Jude Ogba**  
Anaocha Local Government Area, Anambra State

and

**Chief & Mrs. Benjamin Ngene**  
Nkanu Local Government Area, Enugu State

joyfully invite you to witness the Holy Matrimony of their beloved children,

**Nwaamaka Annastecia Ogba**

&

**Nnaemeka Henry Ngene**

---

“Every love story is beautiful, but ours is my favorite.”

---

### Wedding Mass

- Date: Saturday, 19th December 2026
- Time: 12:00 PM
- Venue: Christ the King Chaplaincy, GRA, Enugu

### Reception

- Time: 2:00 PM
- Venue supplied in the invitation copy: Kobbs Civic Event Centre, Polo Park Mall, Enugu
- Alternate venue supplied in the website details: Kolb Civic Event Center, Polo Park (Shoprite), GRA
- Status: **Exact spelling and full reception address need confirmation.**

### Colours of the Day

- Gold
- Dusty Pink
- Olive Green
- Peach
- Dark Blue

### RSVP

- RSVP contact: Both Families
- Inquiry number currently supplied: +234 813 551 4042
- The site should include a guest RSVP form.

### Closing

With love…

“He has made everything beautiful in its time.”  
**Ecclesiastes 3:11**

## Countdown

Display a live countdown to **Saturday, 19 December 2026** showing:

- Days
- Hours
- Minutes

Working timezone assumption: **Africa/Lagos**.

## Hashtags

- #VanillaLoveStory2026
- #TheCountdownToIDo
- #NNLoveStory
- #N&NLovestory was also supplied in the original invitation copy; confirm whether it should remain or be standardized to #NNLoveStory.

## RSVP Requirements

Include a dedicated RSVP section. Exact fields and response destination can be refined later.

Working default fields if not otherwise specified:

- Guest name
- Attendance: attending / unable to attend
- Number of guests
- Optional note
- Submit button

## Contact Section

- Heading: **For more information**
- Leave room for additional phone numbers later.
- Current inquiry number: +234 813 551 4042

## Message to the Couple Form

Required fields:

- Name
- Email Address
- Message
- Send Button

The final delivery destination for messages is still to be decided.

## Visual Direction

- Clean, classy and romantic
- Predominantly white or warm ivory background
- Elegant gold detailing
- Soft accents drawn from dusty pink, olive green, peach and dark blue
- Beautiful display typography paired with highly readable body typography
- Subtle wedding-themed decorative elements
- No photographs of the couple
- Responsive and polished on both phones and computers
- Avoid visual clutter and excessive ornamentation

## Invitation Opening: Implemented Direction

The opening uses code-native CSS and inline SVG for the envelope, with the supplied seal artwork. Initials, colours and proportions remain editable.

Working creative direction:

- Full-screen warm-white embossed envelope
- Refined gold edge highlights rather than a heavily floral cover
- Central wax seal carrying the **N & N** monogram
- Subtle dusty-pink warmth in the shadows
- A restrained olive and peach accent may appear inside the envelope after it opens
- The seal acts as the primary “open invitation” control
- On interaction, the seal warms, cracks and separates before the textured envelope flaps open outward
- The invitation underneath is revealed in a cinematic but concise transition
- Scrolling remains locked until the reveal finishes
- Music may begin from the seal interaction once a soundtrack is supplied
- Provide an accessible reduced-motion version and a way to skip or replay the opening

### Implemented Opening Prototype

- Full-screen warm-ivory embossed paper texture
- Antique-gold envelope edging with natural shadows and no artificial lightning effect
- Supplied wax-seal image with an SVG crack overlay and split-halves animation
- Touch/click and keyboard-accessible opening control
- Four-part envelope choreography and invitation-card reveal
- Ambient gold motes and restrained dusty-pink/olive background accents
- Responsive mobile and desktop composition
- Reduced-motion behavior
- Replay-opening control for review

## Complete Invitation Page: Implemented

- Supplied illustrated backdrop used for the opening hero
- Romantic ivory, blush, burgundy and gold visual system inspired by the reference video
- Family invitation copy and full couple names
- Live days, hours and minutes countdown in the Africa/Lagos timezone
- Wedding Mass and reception schedule with map-direction links
- Colours-of-the-day palette
- RSVP seal and responsive modal form
- Message-to-the-couple form
- RSVP and message submissions currently open a pre-filled WhatsApp message to +234 813 551 4042
- Bible verse, contact number and hashtags in the closing section
- Scroll-reveal motion, subtle falling petals and accessible reduced-motion behavior
- Responsive mobile and desktop layout

## Decisions Still Open

- Confirm the exact reception venue spelling and address.
- Confirm whether the monogram should read `NN`, `N&N`, or use another arrangement.
- Confirm the final hashtag spelling.
- Supply the wedding soundtrack or preferred song later.
- Decide whether WhatsApp remains the final RSVP destination or should be replaced with stored form submissions.
- Decide whether WhatsApp remains the final message destination or should be replaced with email/database delivery.
- Add any additional inquiry phone numbers.
- Confirm whether the countdown should also display seconds.

## Guiding Principle

Use sensible working assumptions for missing details, but keep important content and service decisions configurable so they can be updated later without redesigning the website.
