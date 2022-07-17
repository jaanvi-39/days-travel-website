let controller;
let slideScene;
let pageScene;
let detailScene;
function animateSlides() {
  controller = new ScrollMagic.Controller();

  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  slides.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-image");
    const image = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    // gsap.to(revealImg, 1, { x: "100%" });
    const slideTl = gsap.timeline({
      default: {
        duration: 1,
        ease: "power2.inOut",
      },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(image, { scale: 2 }, { scale: 1 }, "-=0.3");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.1");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.8");

    //creating scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.15,
      reverse: false,
    })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);

    const pageTl = gsap.timeline();
    const nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
        indent: 200,
      })
      .addTo(controller);
  });
}
const mouse = document.querySelector(".cursor");
const burger = document.querySelector(".burger");
function cursor(e) {
  //console.log(e);

  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    const text = mouse.querySelector(".cursor-text");
    mouse.classList.add("explore-active");
    text.innerText = "Tap";
    gsap.to(".title-swipe", 1, { y: "0%" });
  } else {
    const text = mouse.querySelector(".cursor-text");
    mouse.classList.remove("explore-active");
    text.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}
function navOpen(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 1, { rotate: "45", y: "6.5", background: "black" });
    gsap.to(".line2", 1, { rotate: "-45", y: "-6.5", background: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    gsap.to("#logo", 1, { color: "black" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 1, { rotate: "0", y: "0", background: "white" });
    gsap.to(".line2", 1, { rotate: "0", y: "0", background: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    gsap.to("#logo", 1, { color: "white" });
    document.body.classList.remove("hide");
  }
}
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailsAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done }
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scroll to top
        window.scrollTo(0, 0);
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});

function detailsAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".fashion-details");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelectorAll("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });

    //scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "detailslide",
        indent: 200,
      })
      .addTo(controller);
  });
}
burger.addEventListener("click", navOpen);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
animateSlides();
