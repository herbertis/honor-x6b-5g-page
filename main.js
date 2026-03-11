document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const PDT_NAME = "HONOR X6b";

  const HTML = document.documentElement,
    MAIN = document.body.querySelector("main");

  let screenWidth = HTML.clientWidth,
    screenHeight = HTML.clientHeight,
    touchMoving = false,
    pageScrolling = false,
    isMob =
      window.matchMedia("(max-aspect-ratio: 12/10)").matches &&
      screenWidth < 1026,
    navHeight = 52,
    scrubTime = isMob ? 0.5 : 0.7;

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  const Support = (function () {
    const UA = navigator.userAgent.toLowerCase(),
      isUC = UA.indexOf("ucbrowser") !== -1,
      isWeChat = UA.indexOf("micromessenger") !== -1,
      isIOS =
        UA.indexOf("safari") !== -1 &&
        UA.indexOf("chrome") < 1 &&
        UA.indexOf("crios") < 1;

    return {
      inlineVideo: !(isUC || isWeChat),
      isUC: isUC,
      isWeChat: isWeChat,
      isIOS: isIOS,
    };
  })();

  const Common = (function () {
    gsap.config({
      nullTargetWarn: false,
    });

    gsap.defaults({
      duration: 1,
    });

    function unUseHandle() {
      let doms;
      if (isMob) doms = MAIN.querySelectorAll(".pc-show");
      else doms = MAIN.querySelectorAll(".mob-show");
      doms.forEach(function (dom) {
        dom.remove();
      });
    }

    function browserHandle() {
      if (Support.isUC) MAIN.classList.add("is-uc");
      if (Support.isWeChat) MAIN.classList.add("is-wechat");
      if (Support.isIOS) MAIN.classList.add("is-ios");
    }

    function buyButtonHrefHandle() {
      let kvBuyBtn = MAIN.querySelector(".kvBuyBtn"),
        navBuyBtn =
          screenWidth < 841
            ? document.querySelector(".btn-buy-mob") ||
              document.querySelector(".btn-buy")
            : document.querySelector(".btn-buy-pc") ||
              document.querySelector(".btn-buy"),
        navBuyBtnTag = navBuyBtn?.tagName.toLowerCase(),
        style = navBuyBtn ? window.getComputedStyle(navBuyBtn) : null,
        timeout = null;

      if (!kvBuyBtn) return;

      if (!navBuyBtn) return (kvBuyBtn.style.display = "none");

      function initKvBuyBtn() {
        kvBuyBtn.style.display = "inline-block";

        kvBuyBtn.style.opacity = "0";

        if (style?.display == "none") kvBuyBtn.style.display = "none";

        if (navBuyBtnTag == "a") {
          let name = navBuyBtn.innerHTML,
            href = navBuyBtn.getAttribute("href"),
            target = navBuyBtn.getAttribute("target");

          kvBuyBtn.innerHTML = name;

          kvBuyBtn.setAttribute("href", href);

          kvBuyBtn.setAttribute("target", target);

          timeout = setTimeout(function () {
            kvBuyBtn.style.opacity = "1";

            clearTimeout(timeout);

            timeout = null;
          }, 300);

          return false;
        } else {
          let name = navBuyBtn.innerHTML;

          kvBuyBtn.innerHTML = name;

          kvBuyBtn.setAttribute("href", "javascript:void(0)");

          timeout = setTimeout(function () {
            kvBuyBtn.style.opacity = "1";

            clearTimeout(timeout);

            timeout = null;
          }, 300);

          return true;
        }
      }

      let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
          if (timeout) clearTimeout(timeout), (timeout = null);

          if (style?.display == "none") kvBuyBtn.style.display = "none";
          else return initKvBuyBtn();
        });
      });

      const config = { attributes: true };

      observer.observe(navBuyBtn, config);

      return initKvBuyBtn();
    }

    function removeClassesStartingWith(element, prefix) {
      element.classList.forEach(function (className) {
        if (className.startsWith(prefix)) element.classList.remove(className);
      });
    }

    function backToTop() {
      const button = document.querySelector(".pdp-backToTopBtn"),
        $footer = document.querySelector(".footer");
      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      window.addEventListener("scroll", function () {
        let footerTop = $footer?.getBoundingClientRect().top || 0;
        if (window.scrollY > 200 && footerTop > screenHeight)
          button.classList.add("is-active");
        else button.classList.remove("is-active");
      });
    }

    function point_click() {
      if (!isMob) {
        var honorPointLinks = MAIN.querySelectorAll(".point-item");
        honorPointLinks.forEach(function (item) {
          item.onclick = function (e) {
            var id = item.getAttribute("data-id");
            var position =
              document
                .querySelector('.point-part[data-id="' + id + '"]')
                .getBoundingClientRect().top + window.scrollY;

            if (id == 1) position += screenHeight * 0;
            if (id == 2) position += screenHeight * 0;
            if (id == 3) position += screenHeight * 0;
            if (id == 4) position += screenHeight * 0;
            if (id == 5) position += screenHeight * 0;
            if (id == 6) position += screenHeight * 0;
            window.scrollTo({
              top: position,
              left: 0,
              behavior: "auto",
            });
            e.preventDefault();
          };
        });
      } else {
        var honorPointLinks = MAIN.querySelectorAll(".point-item");
        honorPointLinks.forEach(function (item) {
          item.onclick = function (e) {
            var id = item.getAttribute("data-id");
            var position =
              document
                .querySelector('.point-part[data-id-mob="' + id + '"]')
                .getBoundingClientRect().top + window.scrollY;

            if (id == 1) position -= screenHeight * 0.05;
            if (id == 2) position -= screenHeight * 0.05;
            if (id == 3) position -= screenHeight * 0.05;
            if (id == 4) position -= screenHeight * 0.05;
            if (id == 5) position -= screenHeight * 0.05;
            if (id == 6) position -= screenHeight * 0.05;

            window.scrollTo({
              top: position,
              left: 0,
              behavior: "auto",
            });
            e.preventDefault();
          };
        });
      }
    }
    function loadVideo(video) {
      const id = video.getAttribute("id");
      const path = video.getAttribute("data-path");

      if (Support.inlineVideo) {
        let poster, src;
        let suffix = isMob ? "-mob" : "-pc";
        poster = path + id + suffix + ".jpg";
        // src = path + id + suffix + '.webm';
        src = path + id + suffix + ".mp4";
        video.setAttribute("poster", poster);
        video.setAttribute("src", src);
        video.load();
      } else {
        let imageEl = document.createElement("img");
        imageEl.setAttribute("id", id);
        imageEl.classList = video.classList;
        imageEl.setAttribute("src", path + id + "-wx.jpg");
        video.parentNode.insertBefore(imageEl, video.nextSibling);
        video.parentNode.removeChild(video);
      }
    }

    return {
      // backToTop: backToTop(),
      unUseHandle: unUseHandle(),
      browserHandle: browserHandle(),
      buyButtonHrefHandle: buyButtonHrefHandle(),
      removeClassesStartingWith,
      pointClick: point_click(),
      // loadVideo,
    };
  })();

  const Animation = (function () {
    function drop() {
      const $angle = MAIN.querySelector(".section-drop");
      const trigger = MAIN.querySelector("#trigger-drop");

      ScrollTrigger.create({
        trigger: trigger,
        start: "top 45%",
        end: "top 45%",
        //   markers: true,
        onEnter: function () {
          $angle.classList.add("is-active");
        },
        onLeaveBack: function () {
          $angle.classList.remove("is-active");
        },
      });
    }
    function splash() {
      if (!isMob) {
        let splash_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-splash",
            start: "top 20%",
            end: "0",
            scrub: 0,
            // markers: true,
          },
        });
        splash_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-splash .splash-text").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-splash .splash-text").removeClass("active");
          },
        });
      } else {
        let splash_mob = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-splash",
            start: "top 20%",
            end: "0",
            scrub: 0,
            // markers: true,
          },
        });
        splash_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-splash .splash-text").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-splash .splash-text").removeClass("active");
          },
        });
      }
    }
    function battery() {
      if (!isMob) {
        let battery_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-sec-battery",
            start: "top 20%",
            end: "+=100%",
            scrub: 0,
            // markers: true,
          },
        });
        battery_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-battery .sec-battery-guang").addClass("active");
            $("#x6b .section-battery .pic-guang").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-battery .sec-battery-guang").removeClass("active");
            $("#x6b .section-battery .pic-guang").removeClass("active");
          },
        });
        battery_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-battery .sec-battery-tit").addClass("active");
            $("#x6b .section-battery .sec-battery-5200mah").addClass("active");
            $("#x6b .section-battery .sec-battery-dc").addClass("active");
            $("#x6b .section-battery .section-battery-txt1").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-battery .sec-battery-tit").removeClass("active");
            $("#x6b .section-battery .sec-battery-5200mah").removeClass(
              "active"
            );
            $("#x6b .section-battery .sec-battery-dc").removeClass("active");
            $("#x6b .section-battery .sec-battery-txt1").removeClass("active");
          },
        });
        battery_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-battery .sec-battery-txt1").addClass("active2");
            $("#x6b .section-battery .sec-battery-txt2").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-battery .sec-battery-txt1").removeClass("active2");
            $("#x6b .section-battery .sec-battery-txt2").removeClass("active");
          },
        });
      } else {
        let battery_mob = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-sec-battery",
            start: "top 20%",
            end: "+=100%",
            scrub: 0,
            // markers: true,
          },
        });
        battery_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-battery .sec-battery-tit").addClass("active");
            $("#x6b .section-battery .sec-battery-5200mah").addClass("active");
            $("#x6b .section-battery .sec-battery-dc").addClass("active");
            $("#x6b .section-battery .sec-battery-txt1").addClass("active");
            $("#x6b .section-battery .sec-battery-txt2").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-battery .sec-battery-tit").removeClass("active");
            $("#x6b .section-battery .sec-battery-5200mah").removeClass(
              "active"
            );
            $("#x6b .section-battery .sec-battery-dc").removeClass("active");
            $("#x6b .section-battery .sec-battery-txt1").removeClass("active");
            $("#x6b .section-battery .sec-battery-txt2").removeClass("active");
          },
        });
      }
    }

    function charge() {
      if (!isMob) {
        let charge_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-charge",
            start: "top 10%",
            end: "+=110%",
            scrub: 0,
            // markers: true,
          },
        });

        charge_pc.to("#x6b", 1, {
          onStart: function () {
            // $('#x6b .section-charge .left-phone2').addClass('active')
            $("#x6b .section-charge .super-line").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .left-phone2").removeClass("active");
            $("#x6b .section-charge .super-line").removeClass("active");
          },
        });
        charge_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-charge .left-phone1").addClass("active");
            // $('#x6b .section-charge .left-phone2').addClass('active')

            $("#x6b .section-charge .left-guang").addClass("active");
            // $('#x6b .section-charge .super-line').addClass('active')
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .left-phone1").removeClass("active");
            // $('#x6b .section-charge .left-phone2').removeClass('active')
            // $('#x6b .section-charge .super-line').removeClass('active')
            $("#x6b .section-charge .left-guang").removeClass("active");
          },
        });

        charge_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-charge .left-out").addClass("active");
            $("#x6b .section-charge .sec-txt1").addClass("active");
            $("#x6b .section-charge .sec-txt2").addClass("active");
            // $('#x6b .section-charge .circle2').addClass('active')
            $("#x6b .section-charge .circle1").addClass("active");

            $("#x6b .section-charge .charge-bg-deep").addClass("active");
            $("#x6b .section-charge .shu").addClass("active");
            $("#x6b .section-charge .charge-phone3").addClass("active");
            $("#x6b .section-charge .charge-phone3-2").addClass("active");

            $("#x6b .section-charge .phone3-y").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .left-out").removeClass("active");
            $("#x6b .section-charge .sec-txt1").removeClass("active");
            $("#x6b .section-charge .sec-txt2").removeClass("active");
            // $('#x6b .section-charge .circle2').removeClass('active')
            $("#x6b .section-charge .circle1").removeClass("active");

            $("#x6b .section-charge .charge-bg-deep").removeClass("active");
            $("#x6b .section-charge .shu").removeClass("active");
            $("#x6b .section-charge .charge-phone3").removeClass("active");
            $("#x6b .section-charge .charge-phone3-2").removeClass("active");

            $("#x6b .section-charge .phone3-y").removeClass("active");
          },
        });
      } else {
        let charge_mob = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-charge",
            start: "top 10%",
            end: "+=90%",
            scrub: 0,
            // markers: true,
          },
        });
        let charge_mob2 = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-charge2",
            start: "top 20%",
            end: "+=30%",
            scrub: 0,
            // markers: true,
          },
        });
        charge_mob2.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-charge .sec-txt2").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .sec-txt2").removeClass("active");
          },
        });
        charge_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-charge .sec-txt1").addClass("active");
            $("#x6b .section-charge .sec-txt3").addClass("active");
            $("#x6b .section-charge .super-line").addClass("active");
            $("#x6b .section-charge .left-phone1").addClass("active");
            $("#x6b .section-charge .left-guang").addClass("active");
            $("#x6b .section-charge .left-phone2").addClass("active");
            // $('#x6b .section-charge .charge-content').addClass('active')
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .sec-txt1").removeClass("active");
            $("#x6b .section-charge .sec-txt3").removeClass("active");
            $("#x6b .section-charge .super-line").removeClass("active");
            $("#x6b .section-charge .left-guang").removeClass("active");
            $("#x6b .section-charge .left-phone1").removeClass("active");
            $("#x6b .section-charge .left-phone2").removeClass("active");
            // $('#x6b .section-charge .charge-content').removeClass('active')
          },
        });

        charge_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-charge .charge-bg").addClass("active");
            $("#x6b .section-charge .left-out").addClass("active");
            $("#x6b .section-charge .sec-txt3").addClass("active2");

            // $('#x6b .section-charge .sec-txt2').addClass('active')
            // $('#x6b .section-charge .circle2').addClass('active')
            $("#x6b .section-charge .circle1").addClass("active");

            $("#x6b .section-charge .charge-bg-deep").addClass("active");
            $("#x6b .section-charge .shu").addClass("active");
            $("#x6b .section-charge .charge-phone3").addClass("active");
            $("#x6b .section-charge .charge-phone3-2").addClass("active");

            $("#x6b .section-charge .phone3-y").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-charge .charge-bg").removeClass("active");
            $("#x6b .section-charge .left-out").removeClass("active");
            $("#x6b .section-charge .sec-txt3").removeClass("active2");

            // $('#x6b .section-charge .sec-txt2').removeClass('active')
            // $('#x6b .section-charge .circle2').removeClass('active')
            $("#x6b .section-charge .circle1").removeClass("active");

            $("#x6b .section-charge .charge-bg-deep").removeClass("active");
            $("#x6b .section-charge .shu").removeClass("active");
            $("#x6b .section-charge .charge-phone3").removeClass("active");
            $("#x6b .section-charge .charge-phone3-2").removeClass("active");

            $("#x6b .section-charge .phone3-y").removeClass("active");
          },
        });
      }
    }

    function large() {
      if (!isMob) {
        let large_pc1 = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-large",
            start: "top 30%",
            end: "+=100%",
            scrub: 0,
            // markers: true,
          },
        });
        large_pc1.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-large .large-bg").addClass("active");
            $("#x6b .section-large .large-content .large-txt .dots").addClass(
              "active"
            );
          },
          onReverseComplete: function () {
            $("#x6b .section-large .large-bg").removeClass("active");
            $(
              "#x6b .section-large .large-content .large-txt .dots"
            ).removeClass("active");
          },
        });

        let large_pc2 = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-large",
            start: "top 0%",
            end: "+=80%",
            scrub: 0.5,
            // markers: true,
          },
        });
        large_pc2.to(".section-large .large-bg", 1, { y: "-80vh" });
      } else {
        let large_mob1 = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-large",
            start: "top 30%",
            end: "+=100%",
            scrub: 0,
            // markers: true,
          },
        });
        large_mob1.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-large .large-txt").addClass("active");
            $("#x6b .section-large .large-bg").addClass("active");
            $("#x6b .section-large .large-content .large-txt .dots").addClass(
              "active"
            );
          },
          onReverseComplete: function () {
            $("#x6b .section-large .large-txt").removeClass("active");
            $("#x6b .section-large .large-bg").removeClass("active");
            $(
              "#x6b .section-large .large-content .large-txt .dots"
            ).removeClass("active");
          },
        });
      }
    }

    function ultra() {
      if (!isMob) {
        let ultra_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-ultra",
            start: "top 20%",
            end: "+=80%",
            scrub: 0,
            // markers: true,
          },
        });
        ultra_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-ultra .ultra-txt").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-ultra .ultra-txt").removeClass("active");
          },
        });
        ultra_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-ultra .card-warper").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-ultra .card-warper").removeClass("active");
          },
        });
        ultra_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-ultra .ultra-wrap").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-ultra .ultra-wrap").removeClass("active");
          },
        });
        // ultra_pc.to('#x6b', 1, {
        //   onStart: function () {
        //     $('#x6b .sec7 .card-warper .card2').addClass('active')
        //   },
        //   onReverseComplete: function () {
        //     $('#x6b .sec7 .card-warper .card2').removeClass('active')
        //   }
        // })
        // ultra_pc.to('#x6b', 1, {
        //   onStart: function () {
        //     $('#x6b .sec7 .card-warper').addClass('active2')
        //   },
        //   onReverseComplete: function () {
        //     $('#x6b .sec7 .card-warper').removeClass('active2')
        //   }
        // })
      } else {
        let ultra_mob = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-ultra",
            start: "top 0%",
            end: "+=20%",
            scrub: 0,
            // markers: true,
          },
        });

        ultra_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-ultra .ultra-txt").addClass("active");
            // $('#x6b .section-ultra .card-warper .card1 .card1-txt').addClass('active')
          },
          onReverseComplete: function () {
            $("#x6b .section-ultra .ultra-txt").removeClass("active");
            // $('#x6b .section-ultra .card-warper .card1 .card1-txt').removeClass('active')
          },
        });
        let ultra_mob2 = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-ultra2",
            start: "top -=30%",
            end: "+=50%",
            scrub: 0,
            // markers: true,
          },
        });
        ultra_mob2.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-ultra .card-warper .card1 .card1-txt").addClass(
              "active"
            );
          },
          onReverseComplete: function () {
            $("#x6b .section-ultra .card-warper .card1 .card1-txt").removeClass(
              "active"
            );
          },
        });
      }
    }
    function high() {
      if (!isMob) {
        let high_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-high",
            start: "top 20%",
            end: "0",
            scrub: 0,
            // markers: true,
          },
        });
        high_pc.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-high .sound-pic").addClass("active");
            $("#x6b .section-high .high-txt").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-high .sound-pic").removeClass("active");
            $("#x6b .section-high .high-txt").removeClass("active");
          },
        });
      } else {
        let high_mob = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-high",
            start: "top 20%",
            end: "0",
            scrub: 0,
            // markers: true,
          },
        });
        high_mob.to("#x6b", 1, {
          onStart: function () {
            $("#x6b .section-high .high-txt").addClass("active");
          },
          onReverseComplete: function () {
            $("#x6b .section-high .high-txt").removeClass("active");
          },
        });
      }
    }
    function brilliant() {
      if (!isMob) {
        // let last4_pc = gsap.timeline({
        //   scrollTrigger: {
        //     trigger: '#trigger-last4',
        //     start: 'top 0%',
        //     end: '+=80%',
        //     scrub: 0,
        //     // markers: true,
        //   }
        // });
        // last4_pc.to('.sec-last4', 1, {
        //   onStart: function () {
        //     $('.sec-last4').addClass('is-active1')
        //   },
        //   onReverseComplete: function () {
        //     $('.sec-last4').removeClass('is-active1')
        //   }
        // })

        // last4_pc.to('.sec-last4', 1, {
        //   onStart: function () {
        //     $('.sec-last4').addClass('is-active2')
        //   },
        //   onReverseComplete: function () {
        //     $('.sec-last4').removeClass('is-active2')
        //   }
        // })

        var mySwiper1 = new Swiper(".brilliant-swiper", {
          allowTouchMove: false,
          speed: 600,
          slidesPerView: "auto",
          centeredSlides: true,
          spaceBetween: screenWidth * 0.031875,
          navigation: {
            nextEl: ".brilliant-swiper-button-next",
            prevEl: ".brilliant-swiper-button-prev",
            disabledClass: "brilliant-button-disabled",
          },
        });
      } else {
        // let last4_mob = gsap.timeline({
        //   scrollTrigger: {
        //     trigger: '#trigger-last4',
        //     start: 'top 0%',
        //     end: '+=80%',
        //     scrub: 0,
        //     // markers: true,
        //   }
        // });
        // last4_mob.to('.sec-last4', 1, {
        //   onStart: function () {
        //     $('.sec-last4').addClass('is-active1')
        //   },
        //   onReverseComplete: function () {
        //     $('.sec-last4').removeClass('is-active1')
        //   }
        // })

        // last4_mob.to('.sec-last4', 1, {
        //   onStart: function () {
        //     $('.sec-last4').addClass('is-active2')
        //   },
        //   onReverseComplete: function () {
        //     $('.sec-last4').removeClass('is-active2')
        //   }
        // })

        const $last4 = MAIN.querySelector(".section-brilliant");
        const $pagination = MAIN.querySelector(
          ".section-brilliant .interactive-wrapper .pagination-line"
        );
        var mySwiper1 = new Swiper(".brilliant-swiper", {
          // allowTouchMove:false,
          speed: 600,
          // slidesPerView: 'auto',
          centeredSlides: true,

          pagination: {
            el: ".swiper-pagination-magicos",
            type: "fraction",
            formatFractionCurrent: function (number) {
              let myNum = 0;
              switch (number) {
                case 1:
                  myNum = "01";
                  break;
                case 2:
                  myNum = "02";
                  break;
                case 3:
                  myNum = "03";
                  break;
                default:
                  myNum = number;
              }
              return myNum;
            },
            formatFractionTotal: function (number) {
              return "03";
            },
          },

          on: {
            slideChangeTransitionStart: function () {
              Common.removeClassesStartingWith($pagination, "is-active");
              $pagination.classList.add("is-active-" + this.activeIndex);
            },
            touchMove: function () {
              touchMoving = true;
              console.log("hua");
            },
            touchEnd: function () {
              setTimeout(() => {
                touchMoving = false;
              }, 100);
            },
            slidePrevTransitionStart: function () {
              if (touchMoving) GA.swiper_touch($last4, "prev");
            },
            slideNextTransitionStart: function () {
              if (touchMoving) GA.swiper_touch($last4, "next");
            },
          },
        });
      }
    }
    function process() {
      if (!isMob) {
        let process_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-process",
            start: "top 10%",
            end: "top 10%",
            scrub: 0,
            // markers: true,
          },
        });
        process_pc.to(".section-process", 1, {
          onStart: function () {
            $(".section-process").addClass("is-active");
          },
          onReverseComplete: function () {
            $(".section-process").removeClass("is-active");
          },
        });
      } else {
        let process_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-process",
            start: "top 40%",
            end: "top 40%",
            scrub: 0,
            // markers: true,
          },
        });
        process_pc.to(".section-process", 1, {
          onStart: function () {
            $(".section-process").addClass("is-active");
          },
          onReverseComplete: function () {
            $(".section-process").removeClass("is-active");
          },
        });
      }
    }
    function intelligence() {
      if (!isMob) {
        let intelligence_pc = gsap.timeline({
          scrollTrigger: {
            trigger: "#trigger-intelligence",
            start: "top 50%",
            end: "top 50%",
            scrub: 0,
            // markers: true,
          },
        });
        intelligence_pc.to(".section-intelligence", 1, {
          onStart: function () {
            $(".section-intelligence").addClass("is-active");
          },
          onReverseComplete: function () {
            $(".section-intelligence").removeClass("is-active");
          },
        });
      } else {
      }
    }

    function secCmf() {
      const $cmf = MAIN.querySelector(".section-cmf");
      if (!isMob) {
        var currentColor = "green";
        const colorBtns = $cmf.querySelectorAll(".section-cmf .every-btn");
        colorBtns.forEach(function (button, i) {
          button.addEventListener("click", function () {
            let color = this.getAttribute("data-color");
            // console.log(currentColor)
            if (currentColor == color) return;
            currentColor = color;
            Common.removeClassesStartingWith($cmf, "is-color");
            $cmf.classList.add("is-color-" + currentColor);
          });
        });
      } else {
        var currentColor = "green";
        const colorBtns = $cmf.querySelectorAll(".section-cmf .every-btn");
        colorBtns.forEach(function (button, i) {
          button.addEventListener("click", function () {
            let color = this.getAttribute("data-color");
            // console.log(currentColor)
            if (currentColor == color) return;
            currentColor = color;
            Common.removeClassesStartingWith($cmf, "is-color");
            $cmf.classList.add("is-color-" + currentColor);
          });
        });
      }
    }
    return {
      // design: design(),
      drop: drop(),
      splash: splash(),
      battery: battery(),
      charge: charge(),
      large: large(),
      ultra: ultra(),
      high: high(),
      brilliant: brilliant(),
      process: process(),
      intelligence: intelligence(),
      secCmf: secCmf(),
    };
  })();
  let a = 1;

  const GA = (function () {
    let productName = PDT_NAME,
      sections = document.querySelectorAll(".ga-section"),
      currentVideoName,
      lang = HTML.getAttribute("lang"),
      objs = [],
      defaultTop = 0;

    function findParentWithClass(element, className) {
      let current = element.parentElement;
      while (current) {
        if (current.classList.contains(className)) return current;
        current = current.parentElement;
      }
    }

    function screen_swipe() {
      sections.forEach(function (section, index) {
        let position = index + 1;
        const title = section.querySelectorAll(".ga-title")[0] || productName;
        let titleName = title.innerHTML || productName;
        titleName = titleName
          .trim()
          .replace(/&nbsp;/g, " ")
          .replace(/<sup>(.*?)<\/sup>/g, "")
          .replace(/<\/?.+?>/g, "")
          .replace(/\s+/g, " ")
          .replace(/^\s*|\s*$/g, "")
          .replace(/\.$/, "");
        const trigger = section.querySelector("#trigger-ga");
        let sectionTop = section.offsetTop,
          sectionHeight = section.offsetHeight,
          triggerTop = trigger?.offsetTop || 0,
          step = sectionTop + triggerTop;

        if (section.classList.contains("ga-section-kv"))
          (titleName += " KV"), (step = 0);

        // if (section.classList.contains('ga-section-cmf')) titleName += ' From the Nature, From Your Inspiration.';
        if (section.classList.contains("ga-section-large"))
          titleName +=
            " Armazenamento supergrande de 256GB. Anos de memórias valiosas.";
        if (section.classList.contains("ga-section-sec6"))
          titleName += " 256GB eXtra Large Storage";
        if (section.classList.contains("ga-section-sec7"))
          titleName += " 12GB RAM in Equivalence";
        if (section.classList.contains("ga-section-note"))
          (titleName = " Notas"), (step = sectionHeight);

        objs.push({
          position: position,
          titleName: titleName,
          step: step,
          flag: false,
        });

        ScrollTrigger.create({
          trigger: trigger,
          start: "top",
          // markers: true,
          onEnter: function () {
            if (objs[index].flag || pageScrolling) return;
            objs[index].flag = true;
            // const step = index > 0
            //   ? index === objs.length - 1
            //     ? objs[index].step
            //     : objs[index].step - objs[index - 1].step
            //   : 0;

            let step = trigger.getBoundingClientRect().top + window.scrollY;
            step = step - defaultTop;
            defaultTop = trigger.getBoundingClientRect().top + window.scrollY;
            if (index === 0) step = 0;
            if (index === objs.length - 1) step = objs[index].step;
            console.log(
              `${productName}_${objs[index].position}_${
                objs[index].titleName
              }_${Math.floor(step)}px`
            );
            try {
              if (lang == "zh-CN") {
                window.sendDapData({
                  actionCode: "screen_swipe",
                  eventType: "2",
                  content: {
                    event_name: "screen_swipe",
                    eventLabel: `${productName}_${objs[index].position}_${
                      objs[index].titleName
                    }_${Math.floor(step)}px`,
                  },
                });
              } else {
                window.dataLayer.push({
                  event: "screen_swipe",
                  position: objs[index].position,
                  product_name: productName,
                  title_name: objs[index].titleName,
                  step: Math.floor(step) + "px",
                });
              }
            } catch (e) {}
          },
        });
      });
    }

    function video_interaction() {
      let videoDuration = 0;

      function sendData(videoName, videoStep, position) {
        try {
          if (lang == "zh-CN") {
            window.sendDapData({
              actionCode: "video_interaction",
              eventType: "2",
              content: {
                event_name: "video_interaction",
                eventLabel: `${videoStep}_${productName}_${position}_${videoName}_${videoDuration}s`,
              },
            });
          } else {
            window.dataLayer.push({
              event: "video_interaction",
              product_name: productName,
              position: position,
              step: videoStep,
              video_name: videoName,
              video_duration: videoDuration + "s",
            });
          }
        } catch (e) {}
      }

      function videoStep(video, videoName, position, percent) {
        const progress = Math.floor((video.currentTime * 100) / videoDuration);

        if (progress >= 0 && progress < 25 && !percent._0) {
          sendData(videoName, "play", position);
          sendData(videoName, "0%-24%", position);
          percent._0 = true;
        } else if (progress >= 25 && progress < 50 && !percent._25) {
          sendData(videoName, "25%-49%", position);
          percent._25 = true;
        } else if (progress >= 50 && progress < 75 && !percent._50) {
          sendData(videoName, "50%-74%", position);
          percent._50 = true;
        } else if (progress >= 75 && progress < 100 && !percent._75) {
          sendData(videoName, "75%-100%", position);
          percent._75 = true;
        }
      }

      function videoStatus(video, videoName, position) {
        video.addEventListener("loadedmetadata", function () {
          videoDuration = parseInt(video.duration);

          let percent = {
            _0: false,
            _25: false,
            _50: false,
            _75: false,
            _100: false,
          };
          video.onpause = function () {
            if (video.currentTime == 0 || video.currentTime == videoDuration)
              return false;
            if (!video.classList.contains("close"))
              sendData(videoName, "pause", position);
          };

          video.ontimeupdate = function () {
            videoStep(video, videoName, position, percent);
          };
        });
      }

      function videoClick(buttonEl, modalEl) {
        const buttons = MAIN.querySelectorAll(buttonEl),
          modal = MAIN.querySelector(modalEl),
          video = modal.querySelector("video"),
          close = modal.querySelector(".popupcloseBtn.is-video") || null;

        let position;
        buttons.forEach(function (button) {
          button.addEventListener("click", function () {
            const parent = findParentWithClass(button, "ga-section");
            position =
              Array.prototype.indexOf.call(
                MAIN.querySelectorAll(".ga-section"),
                parent
              ) + 1;
            currentVideoName = button.getAttribute("data-ga-video-name");
            videoStatus(video, currentVideoName, position);
          });
        });

        close.addEventListener("click", function () {
          sendData(currentVideoName, "close", position);
        });
      }

      videoClick(".playBtn", ".popup .videoWrapper");
    }

    function gaBtn_click() {
      const buttons = MAIN.querySelectorAll(".gaBtn");
      buttons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          let buttonName =
              this.getAttribute("data-btn-name") ||
              this.innerHTML
                .trim()
                .replace(/<\/?.+?>/g, "")
                .replace(/\s+/g, " ")
                .replace(/^\s*|\s*$/g, ""),
            parent = findParentWithClass(this, "ga-section"),
            position =
              Array.prototype.indexOf.call(
                MAIN.querySelectorAll(".ga-section"),
                parent
              ) + 1,
            // title =
            //   parent.querySelectorAll(".ga-title")[0] ||
            //   this.getAttribute("data-title") ||
            //   PDT_NAME,
            title;

          if (position == 0) {
            position = 7;
          }

          if (this.getAttribute("data-title")) {
            title = this.getAttribute("data-title") || PDT_NAME;
          } else {
            title =
              parent.querySelectorAll(".ga-title")[0] ||
              this.getAttribute("data-title") ||
              PDT_NAME;
          }

          let titleName = title.innerHTML || title;
          titleName = titleName
            .trim()
            .replace(/<\/?.+?>/g, "")
            .replace(/\s+/g, " ")
            .replace(/^\s*|\s*$/g, "");

          // console.log(productName,position,titleName,buttonName)

          try {
            if (lang == "zh-CN") {
              window.sendDapData({
                actionCode: "screen_click",
                eventType: "2",
                content: {
                  event_name: "screen_click",
                  eventLabel: `${productName}_${position}_${titleName}_${buttonName}`,
                },
              });
            } else {
              window.dataLayer.push({
                event: "screen_click",
                position: position,
                title_name: titleName,
                product_name: productName,
                button_name: buttonName,
              });
            }
          } catch (e) {}
        });
      });
    }
    function sideNav_click() {
      const buttons = MAIN.querySelectorAll(".sideNavBtn");
      buttons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          let navigationName = this.getAttribute("data-title");

          try {
            if (lang == "zh-CN") {
              window.sendDapData({
                actionCode: "product_detail_side_nav",
                eventType: "2",
                content: {
                  event_name: "product_detail_side_nav",
                  eventLabel: `${productName}_${navigationName}`,
                },
              });
            } else {
              window.dataLayer.push({
                event: "product_detail_side_nav",
                product_name: productName,
                nav_name: navigationName,
              });
            }
          } catch (e) {}
        });
      });
    }
    function kvBuyBtn_click() {
      const button = MAIN.querySelector(".kvBuyBtn");
      if (!button) return;
      button.addEventListener("click", function (e) {
        e.stopPropagation();

        if (Common.buyButtonHrefHandle) {
          const $container = document.querySelector(".width-container"),
            malls = $container.querySelectorAll(".mall-img");

          if (malls?.length > 0) {
            malls.forEach(function (mall) {
              let img = mall.querySelector("img"),
                src = img.getAttribute("flag");
              img.setAttribute("src", src);
            });
          }
          $container.style.display = "flex";
        }

        let buttonName = this.innerHTML
            .trim()
            .replace(/<\/?.+?>/g, "")
            .replace(/\s+/g, " ")
            .replace(/^\s*|\s*$/g, ""),
          parent = findParentWithClass(this, "ga-section"),
          position =
            Array.prototype.indexOf.call(
              MAIN.querySelectorAll(".ga-section"),
              parent
            ) + 1,
          _productName = this.getAttribute("data-product-name") || productName;

        try {
          if (lang == "zh-CN") {
            window.sendDapData({
              actionCode: "buy",
              eventType: "2",
              content: {
                event_name: "buy",
                eventLabel: `${buttonName}_${position}_${_productName}`,
              },
            });
          } else {
            window.dataLayer.push({
              event: "buy",
              button_name: buttonName,
              position: position,
              product_name: _productName,
            });
          }
        } catch (e) {}
      });
    }

    function cmfBtn_click() {
      const $cmf = MAIN.querySelector(".section-cmf"),
        buttons = $cmf.querySelectorAll(".colorBtn");

      buttons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          let buttonName = this.getAttribute("data-title"),
            parent = findParentWithClass(this, "ga-section"),
            position =
              Array.prototype.indexOf.call(
                MAIN.querySelectorAll(".ga-section"),
                parent
              ) + 1,
            titleName = `${productName} CMF`;

          try {
            if (lang == "zh-CN") {
              window.sendDapData({
                actionCode: "screen_click",
                eventType: "2",
                content: {
                  event_name: "screen_click",
                  eventLabel: `${productName}_${position}_${titleName}_${buttonName}`,
                },
              });
            } else {
              window.dataLayer.push({
                event: "screen_click",
                position: position,
                title_name: titleName,
                product_name: productName,
                button_name: buttonName,
              });
            }
          } catch (e) {}
        });
      });
    }

    function makeupBtn_click() {
      const $photography = MAIN.querySelector(".section-photography"),
        buttons = $photography.querySelectorAll(".makeupBtn");

      buttons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          let buttonName = this.innerHTML
              .trim()
              .replace(/<\/?.+?>/g, "")
              .replace(/\s+/g, " ")
              .replace(/^\s*|\s*$/g, ""),
            parent = findParentWithClass(this, "ga-section"),
            position =
              Array.prototype.indexOf.call(
                MAIN.querySelectorAll(".ga-section"),
                parent
              ) + 1,
            titleName = this.getAttribute("data-title");

          try {
            if (lang == "zh-CN") {
              window.sendDapData({
                actionCode: "screen_click",
                eventType: "2",
                content: {
                  event_name: "screen_click",
                  eventLabel: `${productName}_${position}_${titleName}_${buttonName}`,
                },
              });
            } else {
              window.dataLayer.push({
                event: "screen_click",
                position: position,
                title_name: titleName,
                product_name: productName,
                button_name: buttonName,
              });
            }
          } catch (e) {}
        });
      });
    }

    function swiper_touch(section, direction) {
      let position =
          Array.prototype.indexOf.call(
            MAIN.querySelectorAll(".ga-section"),
            section
          ) + 1,
        titleName = "Brilliant in Daylight, Gentle at Night Time.";

      try {
        if (lang == "zh-CN") {
          let _direction = direction === "next" ? "向后" : "向前";

          window.sendDapData({
            actionCode: "screen_click",
            eventType: "2",
            content: {
              event_name: "screen_click",
              eventLabel: `${productName}_${position}_${titleName}_拖拽${_direction}`,
            },
          });
        } else {
          let _direction = direction === "next" ? "Next" : "Prev";

          window.dataLayer.push({
            event: "screen_click",
            position: position,
            title_name: titleName,
            product_name: productName,
            button_name: "Swipe " + _direction,
          });
        }
      } catch (e) {}
    }
    return {
      screen_swipe: screen_swipe(),
      // video_interaction: video_interaction(),
      gaBtn_click: gaBtn_click(),
      // sideNav_click: sideNav_click(),
      kvBuyBtn_click: kvBuyBtn_click(),
      // cmfBtn_click: cmfBtn_click(),
      // makeupBtn_click: makeupBtn_click(),
      swiper_touch,
    };
  })();
});
