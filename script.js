/* =====================================================================
   MUDRA CANDLES — SITE SCRIPT
   This file is organized so a non-technical owner can make the most
   common edits without touching any HTML:

     1. CONFIG          — phone number, WhatsApp number, address
     2. PRODUCTS        — every candle product/category + its images
     3. Everything below "DO NOT EDIT BELOW THIS LINE" wires the site
        together (nav, gallery, modal, form, etc.) and should not need
        to change for day-to-day updates.

   See README.md for step-by-step instructions with examples.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIG — change your phone number, WhatsApp number or address here.
   If you change the phone/address, also update the JSON-LD block near
   the top of index.html so search engines see the same details.
   --------------------------------------------------------------------- */
const CONFIG = {
  brandName: "Mudra Candles",
  phoneDisplay: "9987240413",
  whatsappNumber: "919987240413", // country code + number, digits only
  address: "20/H/206, Sangharsh Nagar, Chandivali, Powai, Andheri East, Mumbai - 400072, Maharashtra, India"
};

/* ---------------------------------------------------------------------
   2. PRODUCTS — the single source of truth for every candle.

   HOW TO ADD A NEW PRODUCT:
     Copy one block below (the { ... } for an existing candle), paste it
     before the closing "];", then edit every field. Give it a unique
     "slug" (lowercase, no spaces — used as its folder name and ID).

   HOW TO ADD ANOTHER IMAGE to an existing candle:
     Increase "imageCount" by 1, then add a matching file named
     "<slug>-0N.jpg" inside images/<slug>/  (N is padded to 2 digits,
     e.g. daisy-05.jpg). No other code needs to change.

   HOW TO MARK SCENTED/UNSCENTED:
     Set "scented" to "scented", "unscented", or "both".

   "tags" controls which filter buttons a product shows up under on the
   Gallery (All / Daisy / Decorative / Glass / Festival / Scented / Custom).
   --------------------------------------------------------------------- */
const PRODUCTS = [
  {
    slug: "daisy", name: "Daisy Candle", category: "Decorative",
    tags: ["daisy", "decorative", "floral", "custom"],
    scented: "both", customizable: true, imageCount: 4,
    description: "Bright, playful floral candles available in a range of colors, sizes and set combinations.",
    occasions: ["Gifting", "Home decor", "Weddings", "Everyday"]
  },
  {
    slug: "mini-daisy", name: "Mini Daisy Candle", category: "Decorative",
    tags: ["daisy", "decorative", "floral"],
    scented: "both", customizable: true, imageCount: 2,
    description: "A smaller version of our Daisy candle — well suited to gifting, favours and festive decor.",
    occasions: ["Return gifts", "Favours", "Gifting"]
  },
  {
    slug: "bubble", name: "Bubble Candle", category: "Decorative",
    tags: ["decorative"],
    scented: "both", customizable: true, imageCount: 2,
    description: "Rounded, sculptural candles with a soft, contemporary silhouette.",
    occasions: ["Home decor", "Gifting", "Events"]
  },
  {
    slug: "tealight", name: "Tealight Candle", category: "Decorative",
    tags: ["decorative"],
    scented: "both", customizable: true, imageCount: 2,
    description: "Compact, versatile candles suited to everyday use and decor.",
    occasions: ["Everyday", "Events", "Bulk decor"]
  },
  {
    slug: "jaswant", name: "Jaswant Candle", category: "Decorative",
    tags: ["decorative", "floral"],
    scented: "both", customizable: true, imageCount: 2,
    description: "A floral design candle with a distinctive, elegant silhouette.",
    occasions: ["Gifting", "Home decor"]
  },
  {
    slug: "glass", name: "Glass Candle", category: "Decorative",
    tags: ["decorative", "glass"],
    scented: "both", customizable: true, imageCount: 2,
    description: "Candles set in glass containers, designed for a clean, elegant look.",
    occasions: ["Home decor", "Gifting", "Corporate gifting"]
  },
  {
    slug: "small-glass", name: "Small Glass Candle", category: "Decorative",
    tags: ["decorative", "glass"],
    scented: "both", customizable: true, imageCount: 2,
    description: "A petite glass candle, well suited to gifting or everyday use.",
    occasions: ["Gifting", "Return gifts", "Everyday"]
  },
  // ---------- FESTIVAL PRODUCTS ----------
  // All festival photos live in images/festival/ (festival-01.jpg, festival-02.jpg, …).
  // Drop any new festival image in that folder with the next sequential number — the grid picks it up automatically.
  // Increase imageCount if you exceed 50 images.
  {
    // Global festival folder — add future festival images here as festival-01.jpg, festival-02.jpg …
    slug: "festival", name: "Festival Candles", category: "Festival",
    tags: ["festival"],
    scented: "both", customizable: true, imageCount: 50,
    description: "Festive candles for every Indian celebration — Diwali, Ganpati, Janmashtami, Holi and many more.",
    occasions: ["Diwali", "Ganpati", "Janmashtami", "Holi", "Navratri", "Festive gifting", "Corporate hampers"]
  },
];

/* =====================================================================
   DO NOT EDIT BELOW THIS LINE unless you're comfortable with JavaScript.
   ===================================================================== */

const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function pad(n){ return String(n).padStart(2, "0"); }

function productImagePaths(product){
  const folder = product.imageFolder || product.slug;
  const paths = [];
  for(let i = 1; i <= product.imageCount; i++){
    paths.push(`images/${folder}/${folder}-${pad(i)}.jpg`);
  }
  return paths;
}

function mediaEl(src, alt, ratioClass, removeOnError = false){
  const wrap = document.createElement("div");
  wrap.className = `media ${ratioClass}`;
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  if(removeOnError){
    img.addEventListener("error", () => wrap.remove());
  } else {
    img.addEventListener("error", () => phFallback(img));
  }
  wrap.appendChild(img);
  return wrap;
}

function waLink(message){
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function productWaMessage(name){
  return `Hello ${CONFIG.brandName}, I am interested in ${name}. Please share the available designs, customization options and quotation.`;
}

/* ---------------- WhatsApp / tel link wiring ---------------- */
function wireContactLinks(root = document){
  $$(".js-wa", root).forEach(el => {
    const msg = el.dataset.waProduct ? productWaMessage(el.dataset.waProduct) : (el.dataset.waMsg || `Hello ${CONFIG.brandName}, I would like to enquire about your candles.`);
    el.setAttribute("href", waLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  $$(".js-tel", root).forEach(el => {
    el.textContent = CONFIG.phoneDisplay;
    el.setAttribute("href", `tel:+${CONFIG.whatsappNumber}`);
  });
  $$(".js-address", root).forEach(el => { el.textContent = CONFIG.address; });
  $$(".js-directions", root).forEach(el => {
    el.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.address)}`);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* ---------------- "Explore Festival Collection" -> jump to Gallery pre-filtered ---------------- */
function initFilterJumps(){
  $$("[data-filter-jump]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = el.dataset.filterJump;
      const filterBtn = $(`.filter-btn[data-filter="${filter}"]`);
      if(filterBtn){
        $$(".filter-btn").forEach(b => b.classList.toggle("is-active", b === filterBtn));
        applyGalleryFilter(filter);
      }
      const target = $("#gallery");
      if(target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------------- Mobile nav ---------------- */
function initMobileNav(){
  const btn = $("#hamburger-btn");
  const panel = $("#mobile-nav");
  if(!btn || !panel) return;

  function closeNav(){
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });

  // Close when a nav link is tapped
  $$("a", panel).forEach(a => a.addEventListener("click", closeNav));

  // Close when user scrolls (mobile UX: nav shouldn't linger)
  let scrollTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if(btn.getAttribute("aria-expanded") === "true") closeNav();
    }, 80);
  }, { passive: true });
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const items = $$(".reveal");
  if(!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => obs.observe(el));
}

/* ---------------- Festival photo grid ---------------- */
function renderFestivalGrid(){
  const host = $("#festival-grid");
  if(!host) return;
  const festivalProduct = PRODUCTS.find(p => p.slug === "festival");
  if(!festivalProduct) return;

  productImagePaths(festivalProduct).forEach((src, i) => {
    const article = document.createElement("article");
    article.className = "festival-card reveal";
    article.dataset.modalSlug = "festival";

    const wrap = document.createElement("div");
    wrap.className = "media r-1-1";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Festival candle, photo ${i + 1}`;
    img.loading = "lazy";
    // Remove the card entirely if the image is missing — no placeholder, no label
    img.addEventListener("error", () => article.remove());

    wrap.appendChild(img);
    article.appendChild(wrap);
    host.appendChild(article);
  });
}

/* ---------------- Daisy spotlight gallery ---------------- */
function renderDaisyGallery(){
  const host = $("#daisy-gallery");
  if(!host) return;
  const daisy = PRODUCTS.find(p => p.slug === "daisy");
  if(!daisy) return;
  productImagePaths(daisy).forEach((src, i) => {
    // removeOnError=true: only show images that actually exist in the folder
    host.appendChild(mediaEl(src, `Daisy candle, photo ${i + 1}`, "r-4-3", true));
  });
}

/* ---------------- Gallery grid + filters ---------------- */
let galleryItemsCache = [];

function renderGalleryGrid(){
  const host = $("#gallery-grid");
  if(!host) return;
  host.innerHTML = "";
  galleryItemsCache = [];

  PRODUCTS.forEach(product => {
    productImagePaths(product).forEach((src, i) => {
      const el = document.createElement("div");
      el.className = "media r-1-1";
      el.dataset.tags = product.tags.join(",");
      el.dataset.caption = product.name;
      el.dataset.src = src;
      el.addEventListener("click", () => openLightboxFromGallery(el));

      const img = document.createElement("img");
      img.src = src;
      img.alt = `${product.name}, photo ${i + 1}`;
      img.loading = "lazy";
      // Only show images that actually exist — remove the tile if the file is missing
      img.addEventListener("error", () => {
        const idx = galleryItemsCache.indexOf(el);
        if(idx >= 0) galleryItemsCache.splice(idx, 1);
        el.remove();
      });

      el.appendChild(img);
      host.appendChild(el);
      galleryItemsCache.push(el);
    });
  });
}

function applyGalleryFilter(filter){
  galleryItemsCache.forEach(el => {
    const tags = el.dataset.tags.split(",");
    const show = filter === "all" || tags.includes(filter);
    el.classList.toggle("is-hidden", !show);
  });
}

function initGalleryFilters(){
  const group = $("#gallery-filters");
  if(!group) return;
  group.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if(!btn) return;
    $$(".filter-btn", group).forEach(b => b.classList.toggle("is-active", b === btn));
    applyGalleryFilter(btn.dataset.filter);
  });
}

/* ---------------- Lightbox ---------------- */
const lightbox = {
  el: null, img: null, caption: null, items: [], index: 0
};

function initLightbox(){
  lightbox.el = $("#lightbox");
  lightbox.img = $("#lightbox-image");
  lightbox.caption = $("#lightbox-caption");
  if(!lightbox.el) return;

  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox-prev").addEventListener("click", () => stepLightbox(-1));
  $("#lightbox-next").addEventListener("click", () => stepLightbox(1));
  lightbox.el.addEventListener("click", (e) => { if(e.target === lightbox.el) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if(lightbox.el.hidden) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") stepLightbox(-1);
    if(e.key === "ArrowRight") stepLightbox(1);
  });

  // Basic swipe support on mobile
  let touchStartX = null;
  lightbox.el.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.el.addEventListener("touchend", (e) => {
    if(touchStartX === null) return;
    const dx = e.changedTouches[0].screenX - touchStartX;
    if(Math.abs(dx) > 40) stepLightbox(dx > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });
}

function openLightboxFromGallery(clickedEl){
  const visible = galleryItemsCache.filter(el => !el.classList.contains("is-hidden"));
  lightbox.items = visible.length ? visible : galleryItemsCache;
  lightbox.index = Math.max(0, lightbox.items.indexOf(clickedEl));
  showLightboxItem();
  lightbox.el.hidden = false;
  document.body.style.overflow = "hidden";
}

function showLightboxItem(){
  const el = lightbox.items[lightbox.index];
  if(!el) return;
  lightbox.img.src = el.dataset.src;
  lightbox.img.alt = el.dataset.caption;
  lightbox.caption.textContent = el.dataset.caption;
}

function stepLightbox(dir){
  if(!lightbox.items.length) return;
  lightbox.index = (lightbox.index + dir + lightbox.items.length) % lightbox.items.length;
  showLightboxItem();
}

function closeLightbox(){
  lightbox.el.hidden = true;
  document.body.style.overflow = "";
}

/* ---------------- Product detail modal ---------------- */
function buildModalContent(product){
  const wrap = document.createElement("div");

  const hero = mediaEl(productImagePaths(product)[0], product.name, "r-4-3");
  wrap.appendChild(hero);

  if(product.imageCount > 1){
    const gal = document.createElement("div");
    gal.className = "modal__gallery";
    // removeOnError=true — silently skips missing images instead of showing placeholders
    productImagePaths(product).slice(1).forEach((src, i) => {
      gal.appendChild(mediaEl(src, `${product.name}, photo ${i + 2}`, "r-1-1", true));
    });
    wrap.appendChild(gal);
  }

  const title = document.createElement("h3");
  title.id = "modal-title";
  title.textContent = product.name;
  wrap.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = product.description;
  wrap.appendChild(desc);

  const tags = document.createElement("div");
  tags.className = "modal__tags";
  const scentLabel = product.scented === "both" ? "Scented & unscented available" : (product.scented === "scented" ? "Scented" : "Unscented");
  const labels = [scentLabel];
  if(product.customizable) labels.push("Customizable");
  labels.push("Retail & wholesale");
  labels.concat(product.occasions || []).forEach(l => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = l;
    tags.appendChild(chip);
  });
  wrap.appendChild(tags);

  const priceNote = document.createElement("p");
  priceNote.className = "modal__price-note";
  priceNote.textContent = "Price available on enquiry";
  wrap.appendChild(priceNote);

  const ctas = document.createElement("div");
  ctas.className = "modal__ctas";
  const quoteBtn = document.createElement("a");
  quoteBtn.href = waLink(`Hello ${CONFIG.brandName}, I would like a quote for ${product.name}. Here are my requirements:`);
  quoteBtn.target = "_blank"; quoteBtn.rel = "noopener";
  quoteBtn.className = "btn btn--primary";
  quoteBtn.textContent = "Get a Quote";
  const waBtn = document.createElement("a");
  waBtn.href = waLink(productWaMessage(product.name));
  waBtn.target = "_blank"; waBtn.rel = "noopener";
  waBtn.className = "btn btn--outline";
  waBtn.textContent = "WhatsApp Enquiry";
  ctas.appendChild(quoteBtn);
  ctas.appendChild(waBtn);
  wrap.appendChild(ctas);

  return wrap;
}

function openProductModal(slug){
  const product = PRODUCTS.find(p => p.slug === slug);
  const dialog = $("#product-modal");
  const body = $("#modal-body");
  if(!product || !dialog || !body) return;
  body.innerHTML = "";
  body.appendChild(buildModalContent(product));
  if(typeof dialog.showModal === "function"){
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function initModal(){
  const dialog = $("#product-modal");
  if(!dialog) return;
  $("#modal-close-btn").addEventListener("click", () => dialog.close ? dialog.close() : dialog.removeAttribute("open"));
  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if(!inside) dialog.close ? dialog.close() : dialog.removeAttribute("open");
  });

  $$("[data-modal-slug]").forEach(el => {
    el.addEventListener("click", (e) => {
      // avoid double-firing when a card and its inner button both carry the attribute
      if(el.matches("article") && e.target.closest("a, button")) return;
      openProductModal(el.dataset.modalSlug);
    });
  });
}

/* ---------------- Home / scroll-to-top links ---------------- */
function initHomeLinks(){
  $$('a[href="#top"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---------------- Scroll-target cards (e.g. Festival Collection card) ---------------- */
function initScrollTargets(){
  $$("[data-scroll-target]").forEach(el => {
    el.addEventListener("click", (e) => {
      if(e.target.closest("a, button")) return;
      const target = $(el.dataset.scrollTarget);
      if(target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------------- Contact form -> WhatsApp ---------------- */
function initInquiryForm(){
  const form = $("#inquiry-form");
  if(!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const lines = [
      `Hello ${CONFIG.brandName}, I would like to send an inquiry.`,
      `Name: ${data.get("name") || "-"}`,
      `Phone: ${data.get("phone") || "-"}`,
      data.get("email") ? `Email: ${data.get("email")}` : null,
      `Looking for: ${data.get("product") || "-"}`,
      data.get("quantity") ? `Quantity: ${data.get("quantity")}` : null,
      `Preference: ${data.get("scent") || "No preference"}`,
      data.get("color") ? `Preferred color: ${data.get("color")}` : null,
      data.get("occasion") ? `Occasion: ${data.get("occasion")}` : null,
      data.get("message") ? `Message: ${data.get("message")}` : null
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });
}

/* ---------------- Testimonials toggle ----------------
   Flip this to true once you have real customer reviews to show, and
   replace the placeholder text inside the #testimonials section in
   index.html. */
const SHOW_TESTIMONIALS = false;
function initTestimonials(){
  const section = $("#testimonials");
  if(section) section.hidden = !SHOW_TESTIMONIALS;
}

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  wireContactLinks();
  initMobileNav();
  renderFestivalGrid();
  renderDaisyGallery();
  renderGalleryGrid();
  initGalleryFilters();
  initLightbox();
  initModal();
  initHomeLinks();
  initScrollTargets();
  initFilterJumps();
  initInquiryForm();
  initTestimonials();
  initReveal();
});
