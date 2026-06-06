# Form Builder — Spec-Driven Development (Fluid Engine Edition)

# Vision

Create a premium visual form builder that combines:

* Squarespace Fluid Engine
* Framer
* Canva
* Typeform

The product should feel like a visual design tool first and a form builder second.

Users should be able to visually compose beautiful forms directly on a canvas without dealing with sections, rows, or columns.

The experience must prioritize:

* visual freedom
* simplicity
* responsiveness
* premium aesthetics
* fast editing

---

# Product Positioning

This is NOT:

* Google Forms
* Jotform
* Typeform clone
* Elementor form builder

This IS:

A visual form design platform that allows users to build highly customized and beautiful forms through a Fluid Canvas experience.

---

# Product Goals

## Primary Goals

* Build forms visually
* Create custom layouts without code
* Deliver a premium editing experience
* Support responsive design
* Enable multi-step forms
* Maintain high performance

---

# Non Goals (V1)

* Realtime collaboration
* Marketplace
* White label system
* Workflow automation
* Custom JavaScript
* AI form generation
* Team permissions

---

# Core Architecture

```txt
CANVAS ENGINE
ELEMENT ENGINE
THEME ENGINE
RESPONSIVE ENGINE
FORM ENGINE
```

Everything is built on top of these systems.

---

# Tech Stack

## Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* Zustand
* Framer Motion
* shadcn/ui
* dnd-kit

## Backend

* PostgreSQL
* Prisma
* Next.js Route Handlers

## Services

* Stripe
* Resend
* UploadThing

---

# Core Philosophy

The editor never manipulates React components directly.

Everything is represented by a JSON schema.

```txt
Canvas
→ Elements
→ Theme
→ Form Logic
→ Renderer
```

---

# Form Schema

```ts
type FormSchema = {
  id: string

  title: string

  theme: ThemeConfig

  pages: Page[]

  settings: FormSettings
}
```

---

# Page Schema

```ts
type Page = {
  id: string

  name: string

  canvas: Canvas
}
```

---

# Canvas Schema

```ts
type Canvas = {
  width: number

  minHeight: number

  elements: Element[]
}
```

---

# Fluid Grid System

The canvas is powered by a hidden grid.

Users do not work with rows or columns.

The grid exists only to provide:

* snapping
* alignment
* responsive calculations

Example:

```txt
Desktop:
48 Columns

Tablet:
24 Columns

Mobile:
8 Columns
```

---

# Element Architecture

Everything is an element.

```ts
type Element =
  | TextElement
  | InputElement
  | SelectElement
  | CheckboxElement
  | RadioElement
  | ButtonElement
  | ImageElement
  | DividerElement
  | ShapeElement
  | ContainerElement
```

---

# Position System

Each element stores position data.

```ts
type Position = {
  x: number

  y: number

  width: number

  height: number
}
```

---

# Responsive Positioning

Each breakpoint stores its own layout.

```ts
type ResponsivePosition = {
  desktop: Position

  tablet: Position

  mobile: Position
}
```

This avoids unpredictable responsive behavior.

---

# Canvas Interaction

## Select

Single click:

```txt
Select element
```

Shift click:

```txt
Multi select
```

---

## Drag

Users can freely move elements.

Requirements:

* 60 FPS
* snapping
* alignment guides

---

## Resize

All elements support resize handles.

```txt
Top
Bottom
Left
Right
Corners
```

---

## Duplicate

```txt
CMD + D
```

or

```txt
Duplicate Action
```

---

## Delete

```txt
Delete Key
```

---

# Smart Snapping System

Required feature.

Supports:

* edge snapping
* center snapping
* spacing snapping
* equal width snapping
* equal height snapping

Visual guides appear during drag operations.

---

# Layers Panel

Inspired by Framer.

```txt
Page

 ├─ Heading
 ├─ Image
 ├─ Email Input
 ├─ Button
```

Features:

* reorder
* lock
* hide
* duplicate

---

# Inspector Panel

The right sidebar changes depending on selection.

Sections:

```txt
Content
Layout
Style
Animation
Visibility
Logic
```

---

# Content Controls

Text:

```txt
Text
Typography
Links
```

Input:

```txt
Label
Placeholder
Required
Validation
```

Button:

```txt
Text
Action
```

---

# Layout Controls

Users never edit CSS.

Allowed controls:

```txt
Width
Height
Alignment
Spacing
Layer Order
```

---

# Style Controls

Supported properties:

```txt
Background
Border
Radius
Shadow
Opacity
Typography
```

---

# Theme Engine

Theme controls the entire form.

Users edit tokens instead of individual CSS properties.

---

# Theme Tokens

```ts
type ThemeTokens = {
  colors: {}

  typography: {}

  radius: {}

  shadows: {}

  spacing: {}

  motion: {}
}
```

---

# Theme Presets

V1 includes:

* Minimal
* Startup
* Editorial
* Luxury
* Dark
* Glass

---

# Form Elements

## Input Elements

* Text
* Email
* Phone
* Number
* Password

## Selection Elements

* Select
* Radio
* Checkbox
* Multi Select

## Feedback Elements

* Rating
* NPS
* Slider

## Utility Elements

* Date
* Upload

---

# Content Elements

* Heading
* Paragraph
* Image
* Divider
* Icon

---

# Layout Elements

* Container
* Card
* Stack
* Shape

---

# Container Element

Containers allow grouping.

Users can:

* move group
* duplicate group
* apply styles to group

Similar to Frames in Framer.

---

# Multi-Step Forms

Each step is a page.

```txt
Step 1
Canvas

Step 2
Canvas

Step 3
Canvas
```

Users design each step independently.

---

# Conditional Logic

Supported operators:

```txt
equals
not equals
contains
greater than
less than
```

Conditions may affect:

* field visibility
* page visibility

---

# Animation Engine

Built with Framer Motion.

Supported:

```txt
Fade
Slide
Scale
Reveal
```

Animation goals:

* smooth
* subtle
* conversion focused

---

# Renderer Architecture

```txt
Renderer

 ├─ ThemeProvider
 ├─ PageRenderer
 ├─ CanvasRenderer
 ├─ ElementRenderer
 └─ LogicEngine
```

---

# Templates

Templates include:

```txt
Canvas Layout
Theme
Fields
Animations
```

Categories:

* Waitlist
* Survey
* SaaS Signup
* Lead Generation
* Contact
* Feedback
* Job Application
* Quiz

---

# Analytics (V1)

Track:

* Views
* Starts
* Completions
* Drop Off
* Submissions

---

# Versioning

Every save creates a snapshot.

```txt
past[]
present
future[]
```

Supports:

* undo
* redo
* restore

---

# Performance Requirements

Canvas must remain smooth with:

* 500+ elements
* multiple pages
* animations

Strategies:

* virtualization
* memoization
* Zustand selectors
* lazy loading

---

# Mobile Editing

Editor must work on tablets.

Public forms must be fully responsive.

---

# Accessibility

Required:

* keyboard navigation
* focus states
* aria labels
* WCAG contrast compliance

---

# Security

Required:

* rate limiting
* validation
* upload restrictions
* spam protection
* bot detection

---

# Future Roadmap

## V2

* AI form generation
* collaboration
* webhooks
* integrations
* custom domains
* embeddable forms
* advanced analytics

---

# UX Principle

The user should feel like they are designing a landing page that happens to collect data.

Not configuring a traditional form builder.
