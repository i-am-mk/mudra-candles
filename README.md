# Mudra Candles — Website

This is your website's source files. You don't need to be a developer to
update it — this guide walks through the common changes in plain language.

The site is three files working together:

- **index.html** — the text/content and page structure
- **style.css** — colors, fonts, spacing (how it looks)
- **script.js** — the phone number/address settings, the candle catalog, and
  the interactive bits (menu, gallery, forms, WhatsApp buttons)

You will do almost all of your day-to-day editing inside **script.js**, in
the section marked `CONFIG` and `PRODUCTS` near the top of the file.

---

## How to add images

1. Find the candle's folder inside `images/` — for example `images/daisy/`.
2. Every folder has a `PUT-IMAGES-HERE.txt` file telling you the exact
   filenames to use, e.g. `daisy-01.jpg`, `daisy-02.jpg`.
3. Save your photos into that folder using those exact filenames
   (JPG works best; keep each photo under ~500KB if you can, so the site
   stays fast).
4. Refresh the page — the photos appear automatically. No code to edit.

**Until real photos are added**, that spot on the site shows a neat "Photo
coming soon" placeholder instead of a broken image — so the site never
looks unfinished.

**Want to add extra photos** beyond what a folder currently expects (say, a
5th Daisy photo)? Open `script.js`, find the block that starts with
`slug: "daisy"`, and change:

```
imageCount: 4,
```

to

```
imageCount: 5,
```

Then add `daisy-05.jpg` to the `images/daisy/` folder. That's it.

### Adding your logo

Save your logo as `images/logo.png` and it will automatically replace the
text logo in the header and footer. See `images/ADD-LOGO-HERE.txt`.

---

## How to add a new candle

Open `script.js` and find the `PRODUCTS` list near the top (it's a list of
`{ ... }` blocks, one per candle). Copy an existing block that's similar to
your new candle, paste it just before the closing `];`, then edit the
copy. For example, to add a new "Rose Candle":

```js
{
  slug: "rose", name: "Rose Candle", category: "Decorative",
  tags: ["decorative", "floral"],
  scented: "both", customizable: true, imageCount: 2,
  description: "A rose-shaped candle, available in a range of colors.",
  occasions: ["Gifting", "Weddings"]
},
```

Then:

1. Create a folder `images/rose/` and add `rose-01.jpg`, `rose-02.jpg`
   (matching whatever `imageCount` you set).
2. Your new candle now automatically appears in the main Gallery section,
   and clicking it opens the full product details.
3. If you want it as its own card in the "Find Your Perfect Candle"
   section, copy one `<article class="collection-card">` block in
   `index.html` (search for `ADD NEW PRODUCT HERE`) and update the text,
   image path and `data-modal-slug="rose"`.

**Field reference:**

| Field | What it means |
|---|---|
| `slug` | Lowercase, no spaces — also your image folder name |
| `name` | The display name customers see |
| `category` | `Decorative`, `Festival`, or `Custom` |
| `tags` | Which Gallery filter buttons should show this candle |
| `scented` | `"scented"`, `"unscented"`, or `"both"` |
| `imageCount` | How many numbered photos this candle has |
| `description` | One or two honest sentences — avoid claims you can't back up |
| `occasions` | A short list shown in the product popup |

---

## How to change your business phone number

Open `script.js` and edit these two lines near the very top:

```js
phoneDisplay: "9987240413",
whatsappNumber: "919987240413",
```

- `phoneDisplay` is what's shown on the page.
- `whatsappNumber` must include the country code with no spaces, `+`, or
  dashes (India is `91`).

Every "Call Us" and "WhatsApp" button on the site updates automatically.

*(If you also want search engines to see the updated number, open
`index.html`, search for `"telephone"` near the top of the file, and update
it there too.)*

---

## How to change your address

Open `script.js` and edit:

```js
address: "20/H/206, Sangharsh Nagar, Chandivali, Powai, Andheri East, Mumbai - 400072, Maharashtra, India",
```

This updates the Contact section, the footer, and the "Get Directions"
button automatically.

*(For search engines: open `index.html`, search for `"PostalAddress"` near
the top of the file, and update the address fields there too.)*

---

## How to change the WhatsApp messages

Most WhatsApp buttons are written directly in `index.html` as a
`data-wa-msg="..."` attribute. For example:

```html
<a class="js-wa" data-wa-msg="Hello Mudra Candles, I would like to enquire about your candles.">WhatsApp Us</a>
```

Just edit the text inside the quotes. Search `index.html` for `data-wa-msg`
to find every button.

Product-specific buttons instead use `data-wa-product="Daisy Collection"` —
these automatically build the message "Hello Mudra Candles, I am interested
in Daisy Collection. Please share the available designs, customization
options and quotation." If you want to change that wording for *all*
product buttons at once, edit the `productWaMessage()` function near the
top of the "do not edit below this line" part of `script.js`.

---

## How to add Instagram later

Find the "See What We're Creating" section in `index.html` (search for
`id="social"`). Replace the `<div class="social-placeholder">...</div>`
block with a link to your profile, e.g.:

```html
<a href="https://instagram.com/your_handle" target="_blank" rel="noopener" class="btn btn--primary">
  Follow us on Instagram
</a>
```

Or paste an official embed snippet from Instagram/Meta if you'd like to
show a live feed.

---

## How to add real testimonials

Real customer reviews should replace the placeholders — never invent one.

1. Open `index.html` and search for `id="testimonials"`.
2. Replace each `[PLACEHOLDER — replace with a real customer quote]` line
   and the `— Customer name, Location` line with a real review (only use
   reviews you actually have permission to publish).
3. Open `script.js`, find this line near the bottom:

   ```js
   const SHOW_TESTIMONIALS = false;
   ```

   and change `false` to `true`. The section will appear on the site.

---

## How to deploy the website

Once you're happy with your changes, you need to put these files online.
All the options below are free to start with.

**Netlify (easiest for beginners)**
1. Go to [netlify.com](https://www.netlify.com) and sign up.
2. Drag the whole `mudra-candles` folder onto the "Deploy" area on your
   dashboard.
3. Netlify gives you a live link within a minute. You can add your own
   domain name later from the site settings.

**Vercel**
1. Go to [vercel.com](https://www.vercel.com) and sign up.
2. Use "Add New Project" → "Upload" (or connect a GitHub repo containing
   these files) and deploy.

**GitHub Pages**
1. Create a new GitHub repository and upload all these files to it.
2. In the repository's Settings → Pages, set the source to your main
   branch, and save.
3. GitHub gives you a live `.github.io` link.

**Any regular web hosting**
Upload the entire `mudra-candles` folder via your host's File Manager or
FTP, so that `index.html` sits at the root of your domain (or the folder
you want the site to live in).

No database or backend server is required — this is a fully static
website; every enquiry is handled by opening WhatsApp with the message
pre-filled.

---

## A note on honesty

Please don't add prices, ratings, fake reviews, or claims like "100%
natural" / "eco-friendly" / "hand-poured" unless they're actually true for
your business — the site is written to avoid promising anything that
isn't confirmed, and it should stay that way as you edit it.
