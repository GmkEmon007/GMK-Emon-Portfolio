/* =======================================================
   GMK Emon Portfolio — main.js
   Replication Engine for gmkemon-boost.lovable.app
   ======================================================= */

(function() {
  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const startTime = Date.now();
    const minDuration = 1800; // Duration matches css bar loader
    document.body.style.overflowY = 'hidden';

    function hidePreloader() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflowY = '';
      }, remaining);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      // Safety timeout: force hide preloader after 4 seconds
      setTimeout(hidePreloader, 4000);
    }
  }

  /* ---------- CUSTOM CURSOR + MOUSE GLOW ---------- */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  const mouseGlow = document.getElementById('mouse-glow');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
    if (mouseGlow) {
      mouseGlow.style.left = mouseX + 'px';
      mouseGlow.style.top = mouseY + 'px';
    }
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    if (cursorTrail) {
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover expansion triggers
  const hoverTargets = 'a, button, .card-outline, .chat-tab-btn, .faq-accordion-btn, .budget-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      if (cursor) {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
      }
      if (cursorTrail) {
        cursorTrail.style.width = '48px';
        cursorTrail.style.height = '48px';
        cursorTrail.style.borderColor = 'var(--primary)';
      }
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      if (cursor) {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.backgroundColor = 'var(--primary)';
      }
      if (cursorTrail) {
        cursorTrail.style.width = '32px';
        cursorTrail.style.height = '32px';
        cursorTrail.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      }
    }
  });

  /* ---------- HASH SPA ROUTER ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const pageViews = document.querySelectorAll('.page-view');

  function handleRoute() {
    let hash = window.location.hash || '#home';
    let activeRouteId = 'page-' + hash.substring(1);
    let isArticle = false;
    let articleSlug = '';

    // Intercept blog article routes (#blog/slug) or query routes (#blog?category=slug)
    if (hash.startsWith('#blog/')) {
      activeRouteId = 'page-blog-article';
      isArticle = true;
      articleSlug = hash.substring(6);
    } else if (hash.startsWith('#blog?')) {
      activeRouteId = 'page-blog';
    } else if (hash.startsWith('#service/')) {
      const serviceSlug = hash.substring(9);
      activeRouteId = 'page-service-' + serviceSlug;
    }

    // Update Page container active states
    let matched = false;
    pageViews.forEach(view => {
      if (view.id === activeRouteId) {
        view.style.display = 'block';
        setTimeout(() => view.classList.add('active'), 20);
        matched = true;
      } else {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });

    // Reset fallback if no section matches
    if (!matched && pageViews.length > 0) {
      pageViews[0].style.display = 'block';
      setTimeout(() => pageViews[0].classList.add('active'), 20);
    }

    // Sync header links highlighting
    let targetHighlightHash = hash;
    if (hash.startsWith('#case-study-')) {
      targetHighlightHash = '#portfolio';
    } else if (hash.startsWith('#blog')) {
      targetHighlightHash = '#blog';
    } else if (hash.startsWith('#service/')) {
      targetHighlightHash = '#services';
    }

    navLinks.forEach(link => {
      if (link.getAttribute('href') === targetHighlightHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Sync mobile menu links
    mobileLinks.forEach(link => {
      if (link.getAttribute('href') === targetHighlightHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top of viewport on routing swap
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile overlay on routing
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) overlay.classList.remove('open');

    // Trigger counters trigger check if Home is loaded
    if (hash === '#home' || hash === '' || hash === '#') {
      renderHomeInsights();
    }

    // Render logic for Blog pages
    if (activeRouteId === 'page-blog') {
      const catSlug = hash.includes('?category=') ? hash.split('?category=')[1] : null;
      renderBlogLanding(catSlug);
    } else if (activeRouteId === 'page-blog-article' && isArticle) {
      renderBlogArticle(articleSlug);
    } else if (hash.startsWith('#service/')) {
      const serviceSlug = hash.substring(9);
      renderServiceRelatedBlogs(serviceSlug);
    }
  }

  /* ---------- BLOG RENDERING ENGINE ---------- */
  const CATEGORIES = [
    { name: "All", slug: "all" },
    { name: "Web Design", slug: "web-design" },
    { name: "WordPress", slug: "wordpress" },
    { name: "Development", slug: "development" },
    { name: "AI & ML", slug: "ai-ml" },
    { name: "Design", slug: "design" },
    { name: "Learning", slug: "learning" }
  ];

  function renderHomeInsights() {
    const homeGrid = document.getElementById('home-insights-grid');
    if (!homeGrid) return;
    const allPosts = window.BLOG_POSTS || [];
    const latestPosts = allPosts.slice(0, 3);
    if (latestPosts.length > 0) {
      homeGrid.innerHTML = latestPosts.map(post => `
        <article class="blog-card">
          <div class="blog-card-img-wrapper">
            <img class="lazy-blog-img" data-src="${post.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="${post.title}" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
          </div>
          <div class="blog-card-content">
            <span class="blog-tag">${post.category}</span>
            <h4 class="blog-card-title">
              <a href="#blog/${post.slug}">${post.title}</a>
            </h4>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <div class="blog-card-footer">
              <span class="blog-card-date">${post.date} · ${post.readingTime} MIN READ</span>
              <a href="#blog/${post.slug}" class="blog-read-link">Read <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </article>
      `).join('');
      initLazyBlogImages();
    } else {
      homeGrid.innerHTML = `
        <div class="text-center" style="grid-column: 1 / -1; padding: 2rem 0;">
          <p style="color: var(--muted-foreground);">No articles published yet.</p>
        </div>
      `;
    }
  }

  const servicePages = {
    wordpress: {
      container: "page-service-wordpress",
      gridId: "wordpress-related-blogs",
      blogTags: ["WordPress", "Development"]
    },
    graphics: {
      container: "page-service-graphics",
      gridId: "graphics-related-blogs",
      blogTags: ["Design", "Web Design"]
    },
    "ai-ml": {
      container: "page-service-ai-ml",
      gridId: "aiml-related-blogs",
      blogTags: ["AI & ML", "Machine Learning"]
    }
  };

  function renderServiceRelatedBlogs(serviceSlug) {
    const config = servicePages[serviceSlug];
    if (!config) return;

    const container = document.getElementById(config.gridId);
    if (!container) return;

    const allPosts = window.BLOG_POSTS || [];
    const relatedPosts = allPosts.filter(post => {
      const catLower = post.category.toLowerCase();
      return config.blogTags.some(tag => catLower.includes(tag.toLowerCase()));
    }).slice(0, 3);

    if (relatedPosts.length > 0) {
      container.innerHTML = relatedPosts.map(post => `
        <article class="blog-card">
          <div class="blog-card-img-wrapper">
            <img class="lazy-blog-img" data-src="${post.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="${post.title}" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
          </div>
          <div class="blog-card-content">
            <span class="blog-tag">${post.category}</span>
            <h4 class="blog-card-title">
              <a href="#blog/${post.slug}">${post.title}</a>
            </h4>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <div class="blog-card-footer">
              <span class="blog-card-date">${post.date} · ${post.readingTime} MIN READ</span>
              <a href="#blog/${post.slug}" class="blog-read-link">Read <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </article>
      `).join('');
      initLazyBlogImages();
    } else {
      container.innerHTML = `
        <div class="text-center" style="grid-column: 1 / -1; padding: 2rem 0;">
          <p style="color: var(--muted-foreground);">More insights coming soon</p>
        </div>
      `;
    }
  }

  function renderBlogLanding(categorySlug) {
    const activeCatSlug = categorySlug || "all";
    
    // 1. Render filter pills
    const filterContainer = document.getElementById('blog-category-filters');
    if (filterContainer) {
      filterContainer.innerHTML = CATEGORIES.map(cat => {
        const isActive = cat.slug === activeCatSlug;
        return `<button class="blog-filter-btn ${isActive ? 'active' : ''}" data-slug="${cat.slug}">${cat.name}</button>`;
      }).join('');
    }

    // 2. Filter posts lists
    const allPosts = window.BLOG_POSTS || [];
    const searchInput = document.getElementById('blog-search-input');
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filteredPosts = activeCatSlug === "all"
      ? allPosts
      : allPosts.filter(post => {
          const postCatSlug = post.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
          return postCatSlug === activeCatSlug;
        });

    if (searchQuery) {
      filteredPosts = filteredPosts.filter(post => {
        return post.title.toLowerCase().includes(searchQuery) ||
               post.excerpt.toLowerCase().includes(searchQuery) ||
               post.category.toLowerCase().includes(searchQuery);
      });
    }

    // 3. Find featured spotlight post (first featured post in full list)
    const featuredPost = allPosts.find(p => p.featured) || allPosts[0];

    // 4. Render featured spotlight card
    const featuredContainer = document.getElementById('blog-featured-container');
    if (featuredContainer) {
      if (activeCatSlug === "all" && featuredPost) {
        featuredContainer.style.display = 'block';
        featuredContainer.innerHTML = `
          <div class="blog-featured-card">
            <div class="featured-img-wrapper">
              <img src="${featuredPost.image}" alt="${featuredPost.title}" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="featured-content">
              <span class="blog-tag">${featuredPost.category}</span>
              <h3 class="featured-title">
                <a href="#blog/${featuredPost.slug}">${featuredPost.title}</a>
              </h3>
              <p class="featured-excerpt">${featuredPost.excerpt}</p>
              <div class="featured-meta">
                <span>${featuredPost.date}</span>
                <span>·</span>
                <span>${featuredPost.readingTime} MIN READ</span>
              </div>
            </div>
          </div>
        `;
      } else {
        featuredContainer.style.display = 'none';
        featuredContainer.innerHTML = '';
      }
    }

    // 5. Render standard grid list
    const gridPosts = (activeCatSlug === "all" && featuredPost)
      ? filteredPosts.filter(p => p.slug !== featuredPost.slug)
      : filteredPosts;

    const gridContainer = document.getElementById('blog-latest-grid');
    if (gridContainer) {
      if (gridPosts.length > 0) {
        gridContainer.innerHTML = gridPosts.map(post => `
          <article class="blog-card">
            <div class="blog-card-img-wrapper">
              <img class="lazy-blog-img" data-src="${post.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="${post.title}" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="blog-card-content">
              <span class="blog-tag">${post.category}</span>
              <h4 class="blog-card-title">
                <a href="#blog/${post.slug}">${post.title}</a>
              </h4>
              <p class="blog-card-excerpt">${post.excerpt}</p>
              <div class="blog-card-footer">
                <span class="blog-card-date">${post.date} · ${post.readingTime} MIN READ</span>
                <a href="#blog/${post.slug}" class="blog-read-link">Read <i class="fa-solid fa-arrow-right"></i></a>
              </div>
            </div>
          </article>
        `).join('');
        initLazyBlogImages();
      } else {
        gridContainer.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
            <p style="color: var(--muted-foreground);">No articles found in this category.</p>
          </div>
        `;
      }
    }
  }

  function renderBlogArticle(slug) {
    const allPosts = window.BLOG_POSTS || [];
    const post = allPosts.find(p => p.slug === slug);

    const headerArea = document.getElementById('article-header-area');
    const heroImgArea = document.getElementById('article-hero-image-area');
    const bodyContent = document.getElementById('article-body-content');
    const tocNav = document.getElementById('article-toc-nav');
    const footerArea = document.getElementById('article-footer-area');

    if (!post) {
      // 404 NOT FOUND STATE
      document.title = "Article Not Found | GMK Emon";
      if (headerArea) {
        headerArea.innerHTML = `
          <div class="text-center" style="padding: 4rem 0;">
            <span class="blog-tag" style="color: #ef4444; font-weight: 700;">ERROR 404</span>
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--foreground); margin-top: 1rem;">Article not found.</h1>
            <p style="color: var(--muted-foreground); max-width: 500px; margin: 1rem auto 2rem;">The article you are looking for does not exist or has been moved.</p>
            <a href="#blog" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px;"><i class="fa-solid fa-arrow-left"></i> Back to Insights</a>
          </div>
        `;
      }
      if (heroImgArea) heroImgArea.innerHTML = '';
      if (bodyContent) bodyContent.innerHTML = '';
      if (tocNav) tocNav.innerHTML = '';
      if (footerArea) footerArea.innerHTML = '';
      return;
    }

    // Dynamic metadata update
    document.title = `${post.title} | GMK Emon`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.excerpt);
    
    // Update Header
    if (headerArea) {
      headerArea.innerHTML = `
        <span class="blog-tag">${post.category}</span>
        <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; line-height: 1.15; color: var(--foreground); margin: 1rem 0;">${post.title}</h1>
        <p style="margin: 1rem 0 2rem; max-width: 800px; font-size: 1.15rem; color: var(--muted-foreground); line-height: 1.5;">${post.excerpt}</p>
        <div class="featured-meta" style="font-size: 0.85rem;">
          <span>Published: ${post.date}</span>
          <span>·</span>
          <span>${post.readingTime} MIN READ</span>
        </div>
      `;
    }

    // Update Hero image
    if (heroImgArea) {
      heroImgArea.innerHTML = `
        <img src="${post.image}" alt="${post.title}" style="width: 100%; height: auto; display: block; max-height: 480px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
      `;
    }

    // Render content block array
    let headingsList = [];
    if (bodyContent) {
      let contentHTML = '';
      let headingCount = 0;
      post.content.forEach(block => {
        if (block.type === 'paragraph') {
          contentHTML += `<p>${block.text}</p>`;
        } else if (block.type === 'heading') {
          headingCount++;
          const headingId = `heading-${headingCount}`;
          headingsList.push({ id: headingId, text: block.text });
          contentHTML += `<h${block.level || 2} id="${headingId}">${block.text}</h${block.level || 2}>`;
        } else if (block.type === 'quote') {
          contentHTML += `<blockquote>${block.text}</blockquote>`;
        }
      });
      bodyContent.innerHTML = contentHTML;
    }

    // Render TOC
    if (tocNav) {
      if (headingsList.length > 0) {
        tocNav.innerHTML = headingsList.map(h => `
          <a href="#${h.id}" class="toc-link" data-target="${h.id}">${h.text}</a>
        `).join('');
      } else {
        tocNav.innerHTML = `<span style="font-size: 0.8rem; color: var(--muted-foreground);">No sections.</span>`;
      }
    }

    // Render Related posts list
    const relatedPosts = allPosts
      .filter(p => p.slug !== post.slug)
      .sort((a, b) => {
        if (a.category === post.category && b.category !== post.category) return -1;
        if (b.category === post.category && a.category !== post.category) return 1;
        const overlapA = a.tags.filter(t => post.tags.includes(t)).length;
        const overlapB = b.tags.filter(t => post.tags.includes(t)).length;
        if (overlapA !== overlapB) return overlapB - overlapA;
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, 3);

    const relatedHTML = relatedPosts.map(rp => `
      <article class="blog-card">
        <div class="blog-card-img-wrapper">
          <img src="${rp.image}" alt="${rp.title}" onerror="this.src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'">
        </div>
        <div class="blog-card-content">
          <span class="blog-tag">${rp.category}</span>
          <h4 class="blog-card-title">
            <a href="#blog/${rp.slug}">${rp.title}</a>
          </h4>
          <div class="blog-card-footer">
            <span class="blog-card-date">${rp.date}</span>
            <a href="#blog/${rp.slug}" class="blog-read-link">Read <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </article>
    `).join('');

    // Takeaways box HTML
    let takeawaysHTML = '';
    if (post.takeaways && post.takeaways.length > 0) {
      takeawaysHTML = `
        <div class="article-takeaways-card">
          <div class="takeaways-title">
            <i class="fa-solid fa-circle-info"></i> Key Takeaways
          </div>
          <ul class="takeaways-list">
            ${post.takeaways.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Combine into footer area
    if (footerArea) {
      footerArea.innerHTML = `
        ${takeawaysHTML}

        <div class="share-section">
          <span class="share-label">Share This</span>
          <div class="share-links">
            <a class="share-btn share-linkedin" target="_blank" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}">
              <i class="fa-brands fa-linkedin-in"></i> LinkedIn
            </a>
            <a class="share-btn share-twitter" target="_blank" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}">
              <i class="fa-brands fa-x-twitter"></i> X
            </a>
            <button class="share-btn copy-link-btn" id="article-copy-btn">
              <i class="fa-solid fa-link"></i> Copy Link
              <span class="copied-tooltip" id="copy-tooltip">Link copied</span>
            </button>
          </div>
        </div>

        <div class="related-insights-section" style="margin-top: 5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--foreground); margin-bottom: 2rem;">You Might Also Like</h3>
          <div class="blog-articles-grid">
            ${relatedHTML}
          </div>
        </div>
      `;
    }
  }

  /* ---------- MOBILE OVERLAY PANEL ---------- */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      const open = menuOverlay.classList.toggle('open');
      menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  /* ---------- CHAT SIMULATOR ENGINE (NEW LOOP TYPING MODEL) ---------- */
  const CHAT_STEPS = ["Say hello", "Send it over", "Refine", "Ship & measure"];

  const CHAT_SCRIPT = [
    { step: 0, side: "you", text: "need a site that actually sells 🚀", time: "10:02" },
    { step: 0, side: "gk",  text: "you're in 👋 what's the offer and who's buying?", time: "10:03" },

    { step: 1, side: "you", text: "brief's in. probably too much detail", time: "10:31", attach: "growth-brief.pdf" },
    { step: 1, side: "gk",  text: "never too much. first draft in 48h", time: "10:32" },

    { step: 2, side: "gk",  text: "v1 live on staging + heatmap plan attached", time: "14:18" },
    { step: 2, side: "you", text: "checkout flow is 🔥. tighten the hero copy?", time: "14:22" },

    { step: 3, side: "gk",  text: "launched. tracking conversions from day one", time: "09:05" },
    { step: 3, side: "you", text: "3 new leads before lunch 🎉", time: "09:48" },
  ];

  const threadBox = document.getElementById("chat-widget-thread-box");

  let isChatSimulatorInView = false;
  let isTabVisible = true;
  let isLoopRunning = false;
  let lastRenderedStep = -1;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderTimelineDivider(stepIdx) {
    if (!threadBox) return;
    const div = document.createElement("div");
    div.className = "chat-timeline-divider";
    div.innerHTML = `<span>${String(stepIdx + 1).padStart(2, "0")} · ${CHAT_STEPS[stepIdx]}</span>`;
    threadBox.appendChild(div);
    scrollThreadDown();
  }

  function scrollThreadDown() {
    if (threadBox) {
      threadBox.scrollTo({ top: threadBox.scrollHeight, behavior: "smooth" });
    }
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Bind key elements
  function makeRowElement(side) {
    const row = document.createElement("div");
    row.className = "chat-row " + side;
    const mini = document.createElement("div");
    mini.className = "chat-row-mini";
    mini.textContent = side === "gk" ? "GK" : "Y";
    row.appendChild(mini);
    return row;
  }

  async function typeMessage(msg) {
    if (!threadBox) return;

    // Bypassing animations completely for prefers-reduced-motion
    if (prefersReducedMotion()) {
      const row = makeRowElement(msg.side);
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      
      const span = document.createElement("span");
      span.className = "typed";
      span.textContent = msg.text;
      bubble.appendChild(span);

      if (msg.attach) {
        const a = document.createElement("div");
        a.className = "chat-bubble-attach";
        a.innerHTML = "📎 " + msg.attach;
        bubble.appendChild(a);
      }

      const t = document.createElement("span");
      t.className = "chat-bubble-time";
      t.textContent = msg.time;
      bubble.appendChild(t);

      row.appendChild(bubble);
      threadBox.appendChild(row);
      scrollThreadDown();
      return;
    }

    // 1) Render typing indicator dots
    const row = makeRowElement(msg.side);
    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.innerHTML = "<span class='d'></span><span class='d'></span><span class='d'></span>";
    row.appendChild(typing);
    threadBox.appendChild(row);
    scrollThreadDown();

    const thinkTime = Math.min(1400, 450 + msg.text.length * 18);
    await sleep(thinkTime);

    // 2) Replace typing dots with real bubble and type character-by-character
    row.removeChild(typing);
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    const span = document.createElement("span");
    span.className = "typed";
    const cursor = document.createElement("span");
    cursor.className = "chat-cursor";
    bubble.appendChild(span);
    bubble.appendChild(cursor);
    row.appendChild(bubble);
    threadBox.appendChild(row);
    scrollThreadDown();

    for (let i = 0; i < msg.text.length; i++) {
      // Pause typing if widget scrolled away or tab invisible
      while (!isChatSimulatorInView || !isTabVisible) {
        await sleep(500);
      }
      span.textContent += msg.text[i];
      if (i % 3 === 0) scrollThreadDown();
      await sleep(16 + Math.random() * 28);
    }
    cursor.remove();

    if (msg.attach) {
      const a = document.createElement("div");
      a.className = "chat-bubble-attach";
      a.innerHTML = "📎 " + msg.attach;
      bubble.appendChild(a);
    }

    const t = document.createElement("span");
    t.className = "chat-bubble-time";
    t.textContent = msg.time;
    bubble.appendChild(t);

    scrollThreadDown();
    await sleep(500);
  }

  async function playChatLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;

    while (true) {
      // Pause loop if widget is not visible in viewport or tab is backgrounded
      if (!isChatSimulatorInView || !isTabVisible) {
        await sleep(500);
        continue;
      }

      if (threadBox) threadBox.innerHTML = "";
      lastRenderedStep = -1;
      await sleep(400);

      for (const msg of CHAT_SCRIPT) {
        // Double-check visibility and focus mid-script
        while (!isChatSimulatorInView || !isTabVisible) {
          await sleep(500);
        }

        // Render step divider if we moved to a new step
        if (msg.step !== lastRenderedStep) {
          lastRenderedStep = msg.step;
          renderTimelineDivider(msg.step);
          if (!prefersReducedMotion()) {
            await sleep(650);
          }
        }

        await typeMessage(msg);
        if (!prefersReducedMotion()) {
          await sleep(400);
        }
      }

      // Final pause before loop restart
      let endPause = 5000;
      while (endPause > 0) {
        await sleep(200);
        if (isChatSimulatorInView && isTabVisible) {
          endPause -= 200;
        }
      }
    }
  }

  // Set up intersection observer to trigger/pause typing loop when scrolled into view
  const chatContainerWidget = document.getElementById('chat-widget-container');
  if (chatContainerWidget && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isChatSimulatorInView = true;
          playChatLoop();
        } else {
          isChatSimulatorInView = false;
        }
      });
    }, { threshold: 0.1 });
    observer.observe(chatContainerWidget);
  } else {
    isChatSimulatorInView = true;
    playChatLoop();
  }

  /* ---------- FAQ ACCORDION ENGINE ---------- */
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-accordion-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const active = item.classList.contains('active');
        faqItems.forEach(el => el.classList.remove('active'));
        if (!active) {
          item.classList.add('active');
        }
      });
    }
  });



  /* ---------- CONTACT FORM AND BUDGET CONTROLS ---------- */
  const budgetBtns = document.querySelectorAll('.budget-btn');
  const budgetInput = document.getElementById('form-budget');

  budgetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      budgetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (budgetInput) {
        budgetInput.value = btn.getAttribute('data-val');
      }
    });
  });

  /* ---------- BUDGET CALCULATOR LOGIC ---------- */
  const scopeTypeBtns = document.querySelectorAll('.scope-type-btn');
  const scopeSlider = document.getElementById('scope-pages-slider');
  const scopeSliderVal = document.getElementById('scope-slider-val');
  const estimatedPriceEl = document.getElementById('calc-estimated-price');
  const messageInput = document.getElementById('form-message');

  function updateCalculator() {
    if (!scopeSlider || !estimatedPriceEl || !scopeSliderVal) return;

    const activeTypeBtn = document.querySelector('.scope-type-btn.active');
    if (!activeTypeBtn) return;

    const rate = parseInt(activeTypeBtn.getAttribute('data-rate'), 10);
    const typeLabel = activeTypeBtn.textContent.trim();
    const pages = parseInt(scopeSlider.value, 10);

    scopeSliderVal.textContent = `${pages} ${pages === 1 ? 'Page' : 'Pages'}`;

    const basePrice = pages * rate;
    const maxPrice = basePrice + 250;

    const formattedBase = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(basePrice);
    const formattedMax = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(maxPrice);

    estimatedPriceEl.textContent = `${formattedBase} - ${formattedMax}`;

    let budgetVal = '2.5k-5k';
    if (basePrice < 1000) {
      budgetVal = 'under-1k';
    } else if (basePrice >= 1000 && basePrice < 2500) {
      budgetVal = '1k-2.5k';
    } else if (basePrice >= 2500 && basePrice <= 5000) {
      budgetVal = '2.5k-5k';
    } else {
      budgetVal = '5k-plus';
    }

    const matchingBtn = document.querySelector(`.budget-btn[data-val="${budgetVal}"]`);
    if (matchingBtn && budgetInput) {
      budgetBtns.forEach(b => b.classList.remove('active'));
      matchingBtn.classList.add('active');
      budgetInput.value = budgetVal;
    }

    if (messageInput) {
      const currentVal = messageInput.value.trim();
      const defaultPrefix = "Hi Emon, I want to build a";
      if (currentVal === "" || currentVal.startsWith(defaultPrefix)) {
        messageInput.value = `${defaultPrefix} ${typeLabel} consisting of roughly ${pages} sections. Our estimated flat-rate budget range is ${formattedBase} to ${formattedMax}. We would love to discuss...`;
      }
    }
  }

  if (scopeSlider) {
    scopeSlider.addEventListener('input', updateCalculator);
  }

  scopeTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scopeTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCalculator();
    });
  });

  updateCalculator();

  const contactForm = document.getElementById('contact-form');
  const successBox = document.querySelector('.form-success-box');

  if (contactForm && successBox) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.style.pointerEvents = 'none';

      // Simulate network request duration
      setTimeout(() => {
        contactForm.style.display = 'none';
        successBox.style.display = 'flex';
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = '';
      }, 1200);
    });
  }

  /* ---------- LIGHT / DARK THEME ENGINE ---------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
  // Set default theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-moon';
    }
  } else {
    document.documentElement.classList.remove('light-mode');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', e => {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--theme-toggle-x', `${x}px`);
      document.documentElement.style.setProperty('--theme-toggle-y', `${y}px`);

      const toggleTheme = () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (themeIcon) {
          themeIcon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
      };

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          toggleTheme();
        });
      } else {
        toggleTheme();
      }
    });
  }

  /* ---------- FLOATING STATUS FOOTER CLOCK ---------- */
  function updateLiveTime() {
    const timeEl = document.getElementById('footer-live-time');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }
  setInterval(updateLiveTime, 1000);
  updateLiveTime();

  /* ---------- INTERACTIVE PITCH DECK SLIDE VIEWER ---------- */
  const SLIDES = [
    {
      title: "SaaS Brand Strategy & Visual Direction",
      tag: "01 / COVER PLATFORM",
      body: "High-performance visual frameworks engineered for digital product launches. Establishing instant authority through calculated design layout systems.",
      accent: "#22c55e"
    },
    {
      title: "Modern Typography & Layout Grid Systems",
      tag: "02 / STRUCTURE & GEOMETRY",
      body: "Importing DM Sans for optimal reading comfort coupled with Space Grotesk's geometric headlines. Using 96px workbench block guides for visual alignment.",
      accent: "#3b82f6"
    },
    {
      title: "Telemetry Performance Dashboards",
      tag: "03 / HIGH-FIDELITY DESIGN",
      body: "Translating complex metric aggregates into defined Buy Scores and Regret Ratings. Fully structured, scalable vector layers designed for dev handoff.",
      accent: "#a855f7"
    },
    {
      title: "Design Handoff & Asset Checklist",
      tag: "04 / PRODUCTION HANDOVER",
      body: "Figma files, editable PPT templates, and pre-packaged scalable SVGs aligned for developer engineering. Direct collaboration with no project layers.",
      accent: "#eab308"
    }
  ];

  let currentSlideIndex = 0;
  const slideContentEl = document.getElementById('deck-slide-content');
  const deckCounterEl = document.getElementById('deck-counter');
  const deckPrevBtn = document.getElementById('deck-prev-btn');
  const deckNextBtn = document.getElementById('deck-next-btn');

  function renderSlide() {
    if (!slideContentEl || !deckCounterEl) return;
    const slide = SLIDES[currentSlideIndex];
    
    slideContentEl.innerHTML = `
      <span class="portfolio-item-tag" style="color: ${slide.accent}; border-color: rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); margin-bottom: 1.5rem;">${slide.tag}</span>
      <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 700; color: var(--foreground); margin-bottom: 1rem; max-width: 600px; line-height: 1.25;">${slide.title}</h2>
      <p style="font-size: 0.95rem; color: var(--muted-foreground); max-width: 500px; line-height: 1.6; margin: 0;">${slide.body}</p>
    `;

    deckCounterEl.textContent = `Slide ${currentSlideIndex + 1} of ${SLIDES.length}`;
  }

  if (deckPrevBtn) {
    deckPrevBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + SLIDES.length) % SLIDES.length;
      renderSlide();
    });
  }

  if (deckNextBtn) {
    deckNextBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % SLIDES.length;
      renderSlide();
    });
  }

  renderSlide();

  /* ---------- INTERACTIVE TECH STACK CONSOLE ---------- */
  const TECH_STACK_DATA = {
    wordpress: {
      title: "WordPress Custom Theme",
      tag: "ACTIVE STAGE",
      desc: "Building custom block themes, optimizing database query layers, caching SQL responses, and structuring clean metadata architectures using ACF Pro for client administrators.",
      proof: "E-Commerce Rebuild WooCommerce Migrate",
      speed: "95%",
      seo: "98%",
      maintain: "90%"
    },
    nextjs: {
      title: "Next.js Frontend & React",
      tag: "CORE FRAMEWORK",
      desc: "Creating high-performance SPAs and SSR apps utilizing Next.js 15 App Router, React Server Components (RSC), static incremental builds, and framer-motion transitions.",
      proof: "BuyWise 2.0 AI-Powered SaaS Front",
      speed: "99%",
      seo: "96%",
      maintain: "94%"
    },
    fastapi: {
      title: "FastAPI / Python REST APIs",
      tag: "BACKEND STACK",
      desc: "Developing fast async REST API interfaces using Python. Built with Pydantic typing guards, neonatal serverless database transactions, and Upstash Redis rate limiters.",
      proof: "BuyWise 2.0 Telemetry Analytics API",
      speed: "96%",
      seo: "90%",
      maintain: "92%"
    },
    tailwind: {
      title: "Tailwind CSS & Theme Styling",
      tag: "VISUAL STACK",
      desc: "Crafting fluid utility-first layouts, customizing dark theme variables, configuring responsive spacing constraints, and structuring visual systems.",
      proof: "SaaS Visual Identity UI System",
      speed: "98%",
      seo: "99%",
      maintain: "96%"
    }
  };

  const pillBtns = document.querySelectorAll('.console-pill-btn');
  const techTitleEl = document.getElementById('console-tech-title');
  const techTagEl = document.getElementById('console-tech-tag');
  const techDescEl = document.getElementById('console-tech-desc');
  const techProofEl = document.getElementById('console-tech-proof');
  
  const gaugeSpeedEl = document.getElementById('console-gauge-speed');
  const barSpeedEl = document.getElementById('console-bar-speed');
  
  const gaugeSeoEl = document.getElementById('console-gauge-seo');
  const barSeoEl = document.getElementById('console-bar-seo');
  
  const gaugeMaintainEl = document.getElementById('console-gauge-maintain');
  const barMaintainEl = document.getElementById('console-bar-maintain');

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const techKey = btn.getAttribute('data-tech');
      const data = TECH_STACK_DATA[techKey];
      if (!data) return;

      if (techTitleEl) techTitleEl.textContent = data.title;
      if (techTagEl) {
        techTagEl.textContent = data.tag;
        techTagEl.style.color = 'var(--primary)';
      }
      if (techDescEl) techDescEl.textContent = data.desc;
      if (techProofEl) techProofEl.textContent = data.proof;

      if (gaugeSpeedEl) gaugeSpeedEl.textContent = data.speed;
      if (barSpeedEl) barSpeedEl.style.width = data.speed;

      if (gaugeSeoEl) gaugeSeoEl.textContent = data.seo;
      if (barSeoEl) barSeoEl.style.width = data.seo;

      if (gaugeMaintainEl) gaugeMaintainEl.textContent = data.maintain;
      if (barMaintainEl) barMaintainEl.style.width = data.maintain;
    });
  });

  /* ---------- DESIGN-TO-CODE INSPECT TOGGLES ---------- */
  document.addEventListener('click', e => {
    const tabBtn = e.target.closest('.inspect-tab-btn');
    if (!tabBtn) return;

    const card = tabBtn.closest('.portfolio-item-card');
    if (!card) return;

    const view = tabBtn.getAttribute('data-view');
    const tabs = card.querySelectorAll('.inspect-tab-btn');
    const designView = card.querySelector('.inspect-content-design');
    const codeView = card.querySelector('.inspect-content-code');

    if (!designView || !codeView) return;

    tabs.forEach(t => t.classList.remove('active'));
    tabBtn.classList.add('active');

    if (view === 'design') {
      codeView.style.display = 'none';
      designView.style.display = 'block';
    } else {
      designView.style.display = 'none';
      codeView.style.display = 'block';
    }
  });

  /* ---------- BLOG STATIC EVENT LISTENERS ---------- */
  const pageBlog = document.getElementById('page-blog');
  if (pageBlog) {
    pageBlog.addEventListener('click', e => {
      const filterBtn = e.target.closest('.blog-filter-btn');
      if (filterBtn) {
        const slug = filterBtn.getAttribute('data-slug');
        window.location.hash = slug === 'all' ? '#blog' : `#blog?category=${slug}`;
        return;
      }

      const topicCard = e.target.closest('.topic-card');
      if (topicCard) {
        const category = topicCard.getAttribute('data-category');
        const slug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        window.location.hash = `#blog?category=${slug}`;
      }
    });

    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const activeBtn = document.querySelector('.blog-filter-btn.active');
        const activeSlug = activeBtn ? activeBtn.getAttribute('data-slug') : 'all';
        renderBlogLanding(activeSlug);
      });
    }
  }

  const pageArticle = document.getElementById('page-blog-article');
  if (pageArticle) {
    pageArticle.addEventListener('click', e => {
      const tocLink = e.target.closest('.toc-link');
      if (tocLink) {
        e.preventDefault();
        const targetId = tocLink.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navbarHeight = 80;
          const targetOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: targetOffset, behavior: 'smooth' });
          
          pageArticle.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
          tocLink.classList.add('active');
        }
        return;
      }

      const copyBtn = e.target.closest('.copy-link-btn');
      if (copyBtn) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const tooltip = document.getElementById('copy-tooltip');
          if (tooltip) {
            tooltip.classList.add('show');
            setTimeout(() => {
              tooltip.classList.remove('show');
            }, 2000);
          }
        }).catch(err => {
          console.error("Clipboard copy failed: ", err);
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    const pageArticle = document.getElementById('page-blog-article');
    if (!pageArticle || pageArticle.style.display === 'none') return;

    const headings = pageArticle.querySelectorAll('#article-body-content h2, #article-body-content h3');
    const tocLinks = pageArticle.querySelectorAll('.toc-link');
    if (headings.length === 0 || tocLinks.length === 0) return;

    let activeHeadingId = '';
    const scrollPosition = window.scrollY + 120;

    headings.forEach(heading => {
      if (scrollPosition >= heading.offsetTop) {
        activeHeadingId = heading.id;
      }
    });

    if (activeHeadingId) {
      tocLinks.forEach(link => {
        if (link.getAttribute('data-target') === activeHeadingId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // Initialize comparison sections so their cards are added to the DOM before spotlight registration
  initComparisonSections();

  /* ---------- ADVANCED CARD SPOTLIGHT EFFECT ---------- */
  const cards = document.querySelectorAll('.card-outline, .bento-box, .service-image-card');
  cards.forEach(card => {
    let rect = null;
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });
    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ---------- FLOATING BACK TO TOP BUTTON ---------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    let isScrollTicked = false;
    window.addEventListener('scroll', () => {
      if (!isScrollTicked) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          isScrollTicked = false;
        });
        isScrollTicked = true;
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- SCROLL-LINKED PORTFOLIO CATEGORY HIGHLIGHTS ---------- */
  const portfolioSections = document.querySelectorAll('#portfolio-wordpress, #portfolio-graphics, #portfolio-ai-ml');
  const categoryLinks = document.querySelectorAll('.category-nav-btn');
  if (portfolioSections.length > 0 && categoryLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          categoryLinks.forEach(link => {
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);
    portfolioSections.forEach(section => observer.observe(section));
  }

  /* ---------- SYNCHRONIZED COMPARISON TOGGLE COMPONENT ---------- */
  function initComparisonSections() {
    const placeholders = document.querySelectorAll('.comparison-section-placeholder');
    if (placeholders.length === 0) return;

    let isPositiveState = false;
    let hasInteractedWithToggle = false;

    function generateComparisonHTML(index) {
      return `
        <section class="section-padding border-t" style="background: var(--bg0); border-bottom: 1px solid rgba(255,255,255,0.02);">
          <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; margin-bottom: 4rem;">
              <div style="flex: 1; min-width: 280px;">
                <h2 style="font-size: 2.8rem; font-family: var(--font-heading); font-weight: 700; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 0; line-height: 1.25;">
                  <span>When people</span>
                  <span id="comp-text-${index}" style="color: #ef4444; transition: color 0.3s ease; font-weight: 700;">don't</span>
                  <span style="position: relative; display: inline-flex; align-items: center; margin: 0 4px;">
                    <button id="comp-toggle-${index}" class="comparison-switch" aria-label="Toggle comparison" style="width: 60px; height: 32px; border-radius: 100px; background: #3f3f46; border: none; position: relative; cursor: pointer; transition: background 0.3s ease; padding: 0; outline: none; display: inline-flex; align-items: center;">
                      <span id="comp-knob-${index}" style="position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; background: #ffffff; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"></span>
                    </button>
                    <!-- Hint Arrow Tooltip -->
                    <div class="comparison-hint-arrow" style="position: absolute; top: -38px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center; pointer-events: none; transition: all 0.3s ease; animation: arrow-bounce-down 1.5s ease-in-out infinite;">
                      <span style="font-family: ui-monospace, monospace; font-size: 0.55rem; color: var(--primary); text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); padding: 3px 7px; border-radius: 4px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">Click to Toggle</span>
                      <i class="fa-solid fa-chevron-down" style="color: var(--primary); font-size: 0.65rem; margin-top: 1px;"></i>
                    </div>
                  </span>
                  <span>work with me.</span>
                </h2>
              </div>
              <div style="max-width: 450px; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; text-align: left;">
                <p style="font-size: 0.95rem; color: var(--muted-foreground); margin: 0; line-height: 1.5;">
                  Expect creative solutions, clear communication, and results tailored to your vision when working with me.
                </p>
                <a href="#about" class="btn-outline btn-sm" style="border-radius: 50px; padding: 0.6rem 1.25rem;">About Me</a>
              </div>
            </div>

            <!-- Negative Grid (Problems) -->
            <div id="comp-grid-neg-${index}" class="comparison-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; transition: opacity 0.3s ease, transform 0.3s ease;">
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-clone" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Generic Designs</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Using the same old uninspired templates that don't set your brand apart in a competitive market.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-thumbs-down" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Poor User Experience</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Websites that are difficult to navigate and fail to guide visitors toward booking or purchasing.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-eye-slash" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Low Visibility</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">A lack of optimization that limits your reach, making you invisible on search engine results pages.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-face-frown" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Limited Functionality</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Rigid structures that cannot handle custom features, integrations, or business growth metrics.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Missed Deadlines</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Poorly executed timelines that waste time and money, leaving you stuck with unfinished work.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-user-xmark" style="font-size: 1.75rem; color: #ef4444; margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Inadequate Support</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Slow or nonexistent communication that disrupts progress and halts site performance fixes.</p>
              </div>
            </div>

            <!-- Positive Grid (Benefits, Hidden initially) -->
            <div id="comp-grid-pos-${index}" class="comparison-grid" style="display: none; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease;">
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-pen-to-square" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Creative Skills</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Unique, custom designs crafted specifically for your brand, engaging users with clean modern visuals.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-expand" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Responsive Designs</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Delivering flawless experiences on every device, maximizing visitor engagement and retention.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">SEO Optimization</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Enhancing your search visibility with organic strategies that drive relevant traffic and leads.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-users" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Exceptional Support</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Committed post-launch support and regular check-ins to ensure your site runs flawlessly 24/7.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-arrow-right-long" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Quick Turnaround</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Consistently meeting milestones and shipping your project quickly without cutting quality corners.</p>
              </div>
              <div class="card-outline" style="padding: 2.5rem; border-color: rgba(34, 197, 94, 0.12); position: relative; overflow: hidden; text-align: left;">
                <i class="fa-solid fa-code" style="font-size: 1.75rem; color: var(--primary); margin-bottom: 1.5rem; display: block;"></i>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.75rem;">Custom Solutions</h4>
                <p style="font-size: 0.88rem; color: var(--muted-foreground); line-height: 1.6; margin: 0;">Designing custom websites tailored to your needs, improving functionality and user experience.</p>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    placeholders.forEach((placeholder, idx) => {
      placeholder.innerHTML = generateComparisonHTML(idx);
    });

    function updateAllToggles() {
      if (hasInteractedWithToggle) {
        document.querySelectorAll('.comparison-hint-arrow').forEach(arrow => {
          arrow.style.opacity = '0';
          arrow.style.transform = 'translateX(-50%) translateY(-10px)';
          setTimeout(() => {
            arrow.style.display = 'none';
          }, 300);
        });
      }
      placeholders.forEach((_, idx) => {
        const toggleBtn = document.getElementById(`comp-toggle-${idx}`);
        const knob = document.getElementById(`comp-knob-${idx}`);
        const stateText = document.getElementById(`comp-text-${idx}`);
        const gridNeg = document.getElementById(`comp-grid-neg-${idx}`);
        const gridPos = document.getElementById(`comp-grid-pos-${idx}`);

        if (!toggleBtn || !knob || !stateText || !gridNeg || !gridPos) return;

        if (isPositiveState) {
          toggleBtn.style.background = '#22c55e';
          knob.style.transform = 'translateX(28px)';
          stateText.textContent = 'do';
          stateText.style.color = '#22c55e';

          gridNeg.style.opacity = '0';
          gridNeg.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            if (isPositiveState) {
              gridNeg.style.display = 'none';
              gridPos.style.display = 'grid';
              setTimeout(() => {
                gridPos.style.opacity = '1';
                gridPos.style.transform = 'translateY(0)';
              }, 50);
            }
          }, 300);
        } else {
          toggleBtn.style.background = '#3f3f46';
          knob.style.transform = 'translateX(0)';
          stateText.textContent = "don't";
          stateText.style.color = '#ef4444';

          gridPos.style.opacity = '0';
          gridPos.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (!isPositiveState) {
              gridPos.style.display = 'none';
              gridNeg.style.display = 'grid';
              setTimeout(() => {
                gridNeg.style.opacity = '1';
                gridNeg.style.transform = 'translateY(0)';
              }, 50);
            }
          }, 300);
        }
      });
    }

    placeholders.forEach((_, idx) => {
      const toggleBtn = document.getElementById(`comp-toggle-${idx}`);
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          isPositiveState = !isPositiveState;
          hasInteractedWithToggle = true;
          updateAllToggles();
        });
      }
    });

    updateAllToggles();
  }

  /* ---------- LAZY LOAD IMAGES HELPER ---------- */
  function initLazyBlogImages() {
    const lazyImages = document.querySelectorAll('.lazy-blog-img');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            }
            obs.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => observer.observe(img));
    } else {
      lazyImages.forEach(img => {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  /* ---------- SIMULATED API PING BADGE ---------- */
  function startPingSimulator() {
    const pingBadge = document.getElementById('api-ping-badge');
    if (!pingBadge) return;
    setInterval(() => {
      const ping = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
      pingBadge.textContent = `API: ${ping}ms`;
    }, 4000);
  }

  startPingSimulator();

  /* ---------- INTERACTIVE TERMINAL CONSOLE (emon.sh) ---------- */
  function initTerminalConsole() {
    const form = document.getElementById('terminal-query-form');
    const input = document.getElementById('terminal-query-input');
    const log = document.getElementById('terminal-stream-log');
    const queryButtons = document.querySelectorAll('.terminal-query-btn');

    if (!form || !input || !log) return;

    const database = {
      'what is your stack?': 'Emon works extensively with <strong>WordPress, Elementor Pro, and WooCommerce</strong> for conversion-focused websites. On the frontend, he builds custom solutions using <strong>HTML5, CSS3, JavaScript (ES6+), React, and Tailwind CSS</strong>. For backend APIs and scripting, he utilizes <strong>PHP, MySQL, and Python (FastAPI/Flask)</strong>.',
      'are you available for hire?': 'Emon is currently <strong>active and accepting freelance projects and select developer retainers</strong> for Q3/Q4 2026. Staging slots are limited to ensure extreme quality on every project. For direct inquiries, feel free to get in touch at <a href="mailto:business.gmkemon@gmail.com" style="color: var(--primary); text-decoration: underline;">business.gmkemon@gmail.com</a>.',
      'tell me about your process': `Emon's 5-stage development cycle ensures high conversion rates:<br><br>
1. <strong>Discovery</strong>: Mapping page assets, content strategies, and conversion scopes.<br>
2. <strong>Blueprint</strong>: Designing layout mockups and assets in Figma.<br>
3. <strong>Production</strong>: Writing clean code using WordPress or a modern custom frontend stack.<br>
4. <strong>Optimization</strong>: Page speed hardening and security audit diagnostics.<br>
5. <strong>Deploy</strong>: Hands-on client delivery and developer workspace portal activation.`,
      'show developer rates': `Project pricing depends on scope and specific requirements:<br><br>
- <strong>Custom Landing Pages</strong>: Starting at <strong>$300</strong><br>
- <strong>WordPress Website Redesigns</strong>: Starting at <strong>$600</strong><br>
- <strong>WooCommerce E-Commerce Builds</strong>: Starting at <strong>$1,000</strong><br>
- <strong>PageSpeed Optimization Checks</strong>: Starting at <strong>$200</strong><br><br>
Let's schedule a call to finalize your project scope and get a custom quote!`
    };

    function appendMessage(sender, text) {
      const line = document.createElement('div');
      
      if (sender === 'user') {
        line.style.alignSelf = 'flex-end';
        line.style.textAlign = 'right';
        line.style.maxWidth = '80%';
        line.style.marginBottom = '1.5rem';
        line.innerHTML = `
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); margin-bottom: 4px; padding-right: 4px;">› you</div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border); border-radius: 12px; padding: 10px 18px; display: inline-block; color: var(--foreground); font-size: 14px; text-align: left; line-height: 1.5;">
            ${escapeHtml(text)}
          </div>
        `;
      } else {
        line.style.alignSelf = 'flex-start';
        line.style.textAlign = 'left';
        line.style.maxWidth = '85%';
        line.style.marginBottom = '1.5rem';
        
        const isBotResponse = text.startsWith('Emon works') || text.startsWith('Emon is') || text.startsWith("Emon's 5-stage") || text.startsWith('Project pricing') || text.startsWith('Command not found');
        const formattedText = isBotResponse ? text : escapeHtml(text);
        
        line.innerHTML = `
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--primary); margin-bottom: 4px;">› emon-bot</div>
          <div style="color: var(--foreground); font-size: 14px; line-height: 1.6;">
            ${formattedText}
          </div>
        `;
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function runQuery(command) {
      appendMessage('user', command);
      
      const loading = document.createElement('div');
      loading.style.alignSelf = 'flex-start';
      loading.style.marginBottom = '1.5rem';
      loading.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--primary); margin-bottom: 4px;">› emon-bot</div>
        <div style="color: var(--muted-foreground); font-family: var(--font-mono); font-size: 13px; font-style: italic;">
          typing...
        </div>
      `;
      log.appendChild(loading);
      log.scrollTop = log.scrollHeight;

      setTimeout(() => {
        loading.remove();
        const response = database[command.toLowerCase()];
        if (response) {
          appendMessage('system', response);
        } else {
          appendMessage('system', `Command not found: "${command}". For direct queries, please email Emon at <a href="mailto:business.gmkemon@gmail.com" style="color: var(--primary); text-decoration: underline;">business.gmkemon@gmail.com</a> or select a preset diagnostic check above.`);
        }
      }, 500);
    }

    queryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) runQuery(query);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const command = input.value.trim();
      if (!command) return;
      runQuery(command);
      input.value = '';
    });
  }

  initTerminalConsole();

  // Set up routing event listener and run initial load route trigger
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

})();
