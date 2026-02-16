/* Table of content
--------------------------------------------

========

--------
ANIMATION AFTER PAGE LOAD
MASONRY ON GALLERY PAGE
SLIDER ON HOME PAGE
CURSOR 
NAVIGATION ANIMATION
PAGE TRANSITIONS 
IMAGES SORTING
-----------
==========

*/

// Enable smooth touch scrolling on entire website
if ('ontouchstart' in window) {
  document.addEventListener('touchmove', (e) => {
    // Only prevent default for multi-touch (pinch zoom outside popup)
    if (e.touches.length > 2) {
      e.preventDefault();
    }
  }, { passive: true });
}

// Email sending functionality
async function sendMail() {
  const form = {
    name: document.getElementById("name"),
    subject: document.getElementById("subject"),
    email: document.getElementById("email"),
    body: document.getElementById("body")
  };

  // Validate form fields
  if (!form.name || !form.subject || !form.email || !form.body) {
    console.error('Form fields not found');
    alert("Error: Form fields not found");
    return;
  }

  try {
    const params = {
      name: form.name.value.trim(),
      subject: form.subject.value.trim(),
      email: form.email.value.trim(),
      body: form.body.value.trim()
    };
    
    if (!params.name || !params.email || !params.subject || !params.body) {
      alert("Please fill in all fields");
      return;
    }

    await emailjs.send("service_f943jnr", "template_kdzo5or", params);
    alert("Email Sent Successfully!");
    
    // Clear form
    Object.values(form).forEach(field => field.value = '');
  } catch (error) {
    console.error('Failed to send email:', error);
    alert("Failed to send email. Please try again later.");
  }
}

// Update copyright year
function updateCopyright() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// PAGE EFFECT AFTER LOADING
// Prevent right-click context menu across the entire website
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

$(window).on("load", function () {
  const loadertext = document.querySelector(".loader-text-stroke");
  if (!loadertext) return;

  const timeline = gsap.timeline();
  
  loadertext.addEventListener("animationend", function () {
    timeline
      .to(loadertext, {
        duration: 0.8,
        opacity: 0
      })
      .to(loadertext, {
        duration: 1.8,
        display: "none"
      })
      .to("#loader", {
        duration: 1.2,
        y: "-100%",
        ease: "Expo.easeInOut"
      });
  });
});

//MASONRY ON GALLERY PAGE
$(function () {
  const galleryEl = document.querySelector(".gallery-grid");
  if (!galleryEl) return;
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  // Initialize Masonry with performance optimizations
  const masonryOptions = {
    itemSelector: ".column",
    isAnimated: false,
    transitionDuration: 0,
    initLayout: true,
    resize: true,
    percentPosition: true,
    horizontalOrder: true,
    // Disable Masonry on mobile
    enabled: !isMobile
  };

  let masonryInstance = window._masonryInstance || new Masonry(".gallery-grid", masonryOptions);
  window._masonryInstance = masonryInstance;

  // Optimize layout updates on page changes
  const pagelinks = document.querySelectorAll(".page-link");
  let layoutTimeout;

  pagelinks.forEach(link => {
    link.addEventListener("click", function() {
      // Clear any pending layout updates
      clearTimeout(layoutTimeout);
      
      // Schedule layout update
      layoutTimeout = setTimeout(() => {
        masonryInstance.layout();
      }, 1500);
    });
  });

  // Optimize layout on image load
  const images = document.querySelectorAll('.gallery-img');
  let loadedImages = 0;

  function onImageLoad() {
    loadedImages++;
    if (loadedImages === images.length) masonryInstance.layout();
  }

  images.forEach(img => {
    if (img.complete) {
      onImageLoad();
    } else {
      img.addEventListener('load', onImageLoad);
    }
  });
});
//MASONRY ON GALLERY PAGE

// GALLERY PAGE SLIDER

new Swiper(" .swiper-container", {
  slidesPerView: "auto",
  speed: 1000,
  spaceBetween: 20,
  centeredSlides: true,
  grabCursor: true,
  on: {
    init: function () {
      let swiper = this;
      for (let i = 0; i < swiper.slides.length; i++) {
        $(swiper.slides[i])
          .find(".img-container")
          .attr({
            "data-swiper-parallax": 1 * swiper.width,
          });
      }
    },
    resize: function () {
      this.update();
    },
  },
  autoplay: {
    delay: 8000,
    disableOnInteraction: true,
  },
  pagination: {
    el: "#home .swiper-pagination",
    type: "fraction",
  },
  mousewheel: true,
  observer: true,
  observeParents: true,
});
// SLIDER ON GALLERY PAGE

$(document).ready(function () {
  $(".image-type").lettering();
});

// CURSOR
$(function () {
  var $cursor = $(".cursor");
  var $cursortwo = $(".cursor-two");
  function cursormover(e) {
    gsap.to($cursor, {
      x: e.clientX,
      y: e.clientY,
    });
    gsap.to($cursortwo, {
      x: e.clientX,
      y: e.clientY,
    });
  }
  function cursorhover() {
    gsap.to($cursor, {
      scale: 1.5,
      opacity: 0.4,
      background: "#4F959D",
      border: "none",
      ease: Expo.easeOut,
    });
    gsap.to($cursortwo, {
      scale: 0,
      opacity: 0,
    });
  }
  function linkhover() {
    gsap.to($cursor, {
      width: "100px",
      height: "100px",
      opacity: 1,
      background: "#4F959D",
      border: "none",
      innerHTML: "view&nbsp;gallery",
      top: "-50px",
      left: "-50px",
    });
    gsap.to($cursortwo, {
      width: "110px",
      height: "110px",
      border: "2px solid #4F959D",
      background: "transparent",
      top: "-55px",
      left: "-55px",
    });
  }
  function cursor() {
    gsap.to($cursor, {
      width: "50px",
      height: "50px",
      top: "-25px",
      left: "-25px",
      opacity: 1,
      scale: 1,
      background: "transparent",
      border: "1px solid #4F959D",
      innerHTML: "",
    });
    gsap.to($cursortwo, {
      scale: 1,
      opacity: 1,
      width: "8px",
      height: "8px",
      border: "0px solid #4F959D",
      background: "#4F959D",
      top: "-4px",
      left: "-4px",
    });
  }
  $(window).on("mousemove", cursormover);
  $("#home .img-container").hover(linkhover, cursor);
  $(".hover").hover(cursorhover, cursor);
});
// CURSOR

//DISPLAY NAVIGATION CONTENT ON MENUBAR CLICK
$(function () {
  $(".menu-bar").on("click", function () {
    //WHEN MENUBAR IS CLICKED BRING NAVIGATION UP
    gsap.to("#navigation", 1, {
      y: "0%",
      ease: "Expo.easeInOut",
      onComplete: function () {
        //WHEN NAVIGATION ANIMATION IS COMPLETED DO THE FOLLOWING
        gsap.to(".navigation-opacity", 0.5, {
          //GET ELEMENTS OF CLASS 'NAVIGATION-OPACITY' AND TURN THEIR OPACITY TO 1
          opacity: 1,
          stagger: 0.1,
        });
      },
    });
  });

  $(".navigation-close").on("click", function () {
    //WHEN NAVIGATION CLOSE IS CLICKED ANIMATE NAVIGATION DOWN

    gsap.to(".navigation-opacity", 0.5, {
      //GET ELEMENTS OF CLASS 'NAVIGATION-OPACITY' AND TURN THEIR OPACITY TO 0
      opacity: 0,
      stagger: 0.05,
      onComplete: function () {
        //WHEN OPACITY ANIMATION IS COMPLETED DO THE FOLLOWING
        gsap.to("#navigation", 1, {
          y: "100%",
          ease: "Expo.easeInOut",
        });
      },
    });
  });
});

//PAGE TRANSITIONS

$(function pagetransition() {
  var links = [...document.querySelectorAll(".page-link")]; // get all elements with class 'page link'
  var breaker = document.querySelector("#breaker"); //get element with ID Breaker

  links.forEach((link) =>
    link.addEventListener("click", function () {
      //on click on page link element

      var page = link.getAttribute("href"); // get its value of attribute href

      if (document.querySelector(page)) {
        //DISPLAYBREAKER FUNCTION
        function displaybreaker() {
          breaker.style.display = "block"; //display breaker animation

          breaker.addEventListener("animationend", function () {
            this.style.display = "none"; // on animation end set the style of breaker to none
          });

          gsap.to(".navigation-opacity", 0.5, {
            //close navigation
            opacity: 0,
            stagger: -0.05,
            onComplete: function () {
              gsap.to("#navigation", 1, {
                y: "100%",
                ease: "Expo.easeInOut",
              });
            },
          }); //close navigation
        }

        //DISPLAYBREAKER FUNCTION

        displaybreaker(); // CALL DISPLAYBREAKER FUNCTION

        //  CHANGEPAGE FUNCTION
        function changepage() {
          var pages = links.map((a) => a.getAttribute("href")); // GET ALL THE PAGES
          setTimeout(function () {
            pages.forEach(
              (a) => (document.querySelector(a).style.display = "none"),
            ); // SET THE STYLE OF ALL THE PAGES TO NONE
            document.querySelector(page).style.display = "block"; //SET THE STYLE OF THE PAGE THAT HAS BEEN CLICKED TO BLOCK
          }, 1500);
        }
        //  CHANGEPAGE FUNCTION

        changepage(); // CALL CHANGEPAGE FUNCTION
      }
    }),
  );
});

//PAGE TRANSITION

// SORTING OF IMAGES

$(function () {
  var sortingbuttons = document.querySelectorAll(".image-sort-button");
  sortingbuttons.forEach((button) =>
    button.addEventListener("click", function () {
      var sortvalue = button.dataset.sort;
      var images = document.querySelectorAll(".gallery-img");
      images.forEach((image) => (image.style.display = "none"));
      if (sortvalue === "all") {
        images.forEach((image) => (image.style.display = "block"));
      } else {
        var imagestoshown = document.querySelectorAll(`[alt='${sortvalue}']`);
        imagestoshown.forEach((show) => (show.style.display = "block"));
      }
      new Masonry(".gallery-grid", { itemSelector: ".column", isAnimated: true });
      sortingbuttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
    }),
  );
});

// Initialize gallery when DOM is loaded
// Setup popup modal functionality
function setupPopupModal() {
  const galleryImages = document.querySelectorAll(".gallery-img");
  const popupModal = document.getElementById("popup-modal");
  const popupImage = document.getElementById("popup-image");
  const popupCaption = document.getElementById("popup-caption");
  const popupClose = document.querySelector(".popup-close");
  const popupLoader = document.getElementById("popup-loader");
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomResetBtn = document.getElementById("zoom-reset");

  if (!popupModal || !popupImage || !popupCaption || !popupClose || !popupLoader) {
    console.warn('Popup modal elements not found');
    return;
  }

  let currentScale = 1;
  const ZOOM_STEP = 0.25;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;

  function updateImageScale() {
    popupImage.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
  }

  // Touch zoom functionality
  let touchStartDistance = 0;
  let touchStartScale = 1;
  let lastTapTime = 0;

  function getTouchDistance(event) {
    return Math.hypot(
      event.touches[0].pageX - event.touches[1].pageX,
      event.touches[0].pageY - event.touches[1].pageY
    );
  }

  // Prevent default zoom behavior on mobile devices
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  popupImage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchStartDistance = getTouchDistance(e);
      touchStartScale = currentScale;
    } else if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
        // Double tap to reset zoom
        currentScale = 1;
        updateImageScale();
      }
      lastTapTime = currentTime;
    }
  });

  popupImage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e);
      const scale = (distance / touchStartDistance) * touchStartScale;
      currentScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
      updateImageScale();
    }
  });

  // Zoom button controls
  zoomInBtn.addEventListener('click', () => {
    currentScale = Math.min(currentScale + ZOOM_STEP, MAX_SCALE);
    updateImageScale();
  });

  zoomOutBtn.addEventListener('click', () => {
    currentScale = Math.max(currentScale - ZOOM_STEP, MIN_SCALE);
    updateImageScale();
  });

  const INITIAL_SCALE = 0.6;

  zoomResetBtn.addEventListener('click', () => {
    currentScale = INITIAL_SCALE;
    updateImageScale();
  });

  galleryImages.forEach((image) => {
    image.addEventListener("click", function () {
      popupModal.style.display = "block";
      popupLoader.style.display = "block";
      const highResSrc = this.getAttribute("data-highres");
      popupImage.src = "";
      popupImage.style.display = "none";
      popupCaption.textContent = this.alt;
      currentScale = INITIAL_SCALE;
      updateImageScale();

      popupImage.onload = function () {
        popupLoader.style.display = "none";
        popupImage.style.display = "block";
      };
      popupImage.src = highResSrc;
    });
  });

  popupClose.addEventListener("click", function () {
    popupModal.style.display = "none";
    currentScale = 1;
    updateImageScale();
    document.body.style.overflow = 'auto';
  });

  popupModal.addEventListener("click", function (event) {
    if (event.target === popupModal) {
      popupModal.style.display = "none";
      currentScale = 1;
      updateImageScale();
      document.body.style.overflow = 'auto';
    }
  });

  // Prevent context menu on the popup image
  popupImage.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Mouse wheel zoom
  popupImage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    currentScale = Math.min(Math.max(currentScale + delta, MIN_SCALE), MAX_SCALE);
    updateImageScale();
  });
}

// Initialize gallery functionality
function initializeGallery() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) {
    console.warn('Gallery container not found');
    return;
  }

  const masonry = window._masonryInstance || new Masonry('.gallery-grid', { itemSelector: '.column', isAnimated: true });
  window._masonryInstance = masonry;

  function applyHideList(hidden) {
    if (!Array.isArray(hidden) || hidden.length === 0) return;
    const imgs = document.querySelectorAll('.gallery-img');
    imgs.forEach(img => {
      const src = img.getAttribute('src') || '';
      const hide = hidden.some(h => src.endsWith(h) || src === h);
      if (hide) {
        const col = img.closest('.column');
        if (col) col.style.display = 'none';
      }
    });
    masonry.reloadItems();
    masonry.layout();
  }

  function loadDynamicGallery() {
    const existingSrcs = new Set(Array.from(document.querySelectorAll('.gallery-img')).map(i => i.getAttribute('src') || i.src || ''));
    window._blobUrls = window._blobUrls || new Set();
    function debouncedLayout() {
      clearTimeout(window._layoutT);
      window._layoutT = setTimeout(() => masonry.layout(), 50);
    }

    fetch('/api/list').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (!data || !Array.isArray(data.items)) return;
      const frag = document.createDocumentFragment();
      const newCols = [];
      for (const item of data.items) {
        if (existingSrcs.has(item.url) || window._blobUrls.has(item.url)) continue;
        const col = document.createElement('div');
        col.className = 'column';
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.loading = 'lazy';
        img.src = item.url;
        img.setAttribute('data-highres', item.url);
        img.alt = item.alt || 'portfolio';
        img.addEventListener('load', debouncedLayout);
        col.appendChild(img);
        frag.appendChild(col);
        newCols.push(col);
        window._blobUrls.add(item.url);
        existingSrcs.add(item.url);
      }
      if (newCols.length) {
        galleryGrid.insertBefore(frag, galleryGrid.firstChild);
        masonry.reloadItems();
        debouncedLayout();
        setupPopupModal();
      } else {
        setupPopupModal();
      }
    }).catch(() => {
      setupPopupModal();
    });

    fetch('/api/hide-list')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(j => applyHideList(j.items || []))
      .catch(() => {});
  }

  loadDynamicGallery();
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  updateCopyright(); // Update the copyright year
  initializeGallery(); // Initialize the gallery
});

