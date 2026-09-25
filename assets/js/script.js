document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".site-header");
    var navList = document.getElementById("primary-navigation");
    var navToggle = document.getElementById("nav-toggle");
    var navLinks = document.querySelectorAll('.navigation-list a[href^="#"]');
    var internalLinks = document.querySelectorAll('a[href^="#"]');
    var galleryTriggers = Array.prototype.slice.call(document.querySelectorAll(".project-media-item"));
    var galleryImages = galleryTriggers
        .map(function (trigger) {
            return trigger.querySelector("img");
        })
        .filter(Boolean);
    var lightbox = document.getElementById("image-lightbox");
    var lightboxImage = document.getElementById("lightbox-image");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var closeButton = document.getElementById("lightbox-close");
    var prevButton = document.getElementById("lightbox-prev");
    var nextButton = document.getElementById("lightbox-next");
    var activeIndex = -1;
    var lastFocusedElement = null;
    var sectionIds = ["intro", "experience", "projects", "engineering-notes", "about", "tech-stack", "contact"];
    var sections = sectionIds
        .map(function (id) {
            var element = document.getElementById(id);
            return element ? { id: id, element: element } : null;
        })
        .filter(Boolean);

    function updateLightboxImage() {
        var selectedImage = galleryImages[activeIndex];
        if (!selectedImage || !lightboxImage) {
            return;
        }
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = selectedImage.alt;
        }
    }

    function openLightbox(index) {
        if (!lightbox) {
            return;
        }
        lastFocusedElement = document.activeElement;
        activeIndex = index;
        updateLightboxImage();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (closeButton) {
            // Visibility only flips to visible once the open transition starts, so wait for a frame.
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    if (lightbox.classList.contains("is-open")) {
                        closeButton.focus();
                    }
                });
            });
        }
    }

    function closeLightbox() {
        if (!lightbox) {
            return;
        }
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        if (lightboxImage) {
            lightboxImage.src = "";
        }
        activeIndex = -1;
        document.body.style.overflow = "";
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    function showNextImage() {
        if (!galleryImages.length) {
            return;
        }
        activeIndex = (activeIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        if (!galleryImages.length) {
            return;
        }
        activeIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function trapLightboxFocus(event) {
        var focusable = [closeButton, prevButton, nextButton].filter(Boolean);
        if (!focusable.length) {
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        } else if (focusable.indexOf(document.activeElement) === -1) {
            event.preventDefault();
            first.focus();
        }
    }

    function closeNav() {
        if (!navList || !navToggle) {
            return;
        }
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && navList) {
        navToggle.addEventListener("click", function () {
            var isOpen = navList.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            var targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();
            closeNav();
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

            if (targetElement.hasAttribute("tabindex")) {
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    galleryTriggers.forEach(function (trigger, index) {
        trigger.addEventListener("click", function () {
            openLightbox(index);
        });
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeLightbox);
    }
    if (nextButton) {
        nextButton.addEventListener("click", showNextImage);
    }
    if (prevButton) {
        prevButton.addEventListener("click", showPrevImage);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (!lightbox || !lightbox.classList.contains("is-open")) {
            if (event.key === "Escape") {
                closeNav();
            }
            return;
        }
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowRight") {
            showNextImage();
        } else if (event.key === "ArrowLeft") {
            showPrevImage();
        } else if (event.key === "Tab") {
            trapLightboxFocus(event);
        }
    });

    function onScroll() {
        if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 8);
        }

        if (!sections.length || !navLinks.length) {
            return;
        }

        var scrollPos = window.scrollY + 120;
        var currentId = sections[0].id;

        sections.forEach(function (section) {
            if (section.element.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });

        navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            var isActive = href === "#" + currentId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }
});
