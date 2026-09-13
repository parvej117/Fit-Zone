/* ==========================================================================
   FitZone Fitness & Gym - Main JavaScript File (script.js)
   Clean, beginner-friendly Vanilla JavaScript for DOM manipulation,
   theme toggling, animations, filtering, BMI calculations, and form validation.
   ========================================================================== */

// Wait for the DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Dark / Light Mode Theme Toggle with localStorage Persistence
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Function to apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }

  // Check saved theme in localStorage or default to dark (modern gym aesthetic)
  const savedTheme = localStorage.getItem('fitzone-theme') || 'dark';
  applyTheme(savedTheme);

  // Toggle theme on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      applyTheme(newTheme);
      localStorage.setItem('fitzone-theme', newTheme);
      showToast(newTheme === 'dark' ? 'ডার্ক মোড সক্রিয় হয়েছে!' : 'লাইট মোড সক্রিয় হয়েছে!', 'info');
    });
  }


  /* --------------------------------------------------------------------------
     2. Responsive Mobile Navigation Menu & Sticky Navbar
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Toggle mobile navigation menu
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when any navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Highlight active link based on scroll position
  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (targetLink) targetLink.classList.add('active');
      }
    });
  }


  /* --------------------------------------------------------------------------
     3. Exercise Filtering Functionality
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const exerciseCards = document.querySelectorAll('.exercise-card');

  filterBtns.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all filter buttons
      filterBtns.forEach(btn => btn.classList.remove('active'));
      // Set active on clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      exerciseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'flex';
          // Subtle fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* --------------------------------------------------------------------------
     4. Interactive Exercise Technique Modal
     -------------------------------------------------------------------------- */
  const exerciseDetailBtns = document.querySelectorAll('.view-exercise-btn');
  const exerciseModal = document.getElementById('exerciseModal');
  const exerciseModalTitle = document.getElementById('exerciseModalTitle');
  const exerciseModalMuscle = document.getElementById('exerciseModalMuscle');
  const exerciseModalDiff = document.getElementById('exerciseModalDiff');
  const exerciseModalDesc = document.getElementById('exerciseModalDesc');
  const exerciseModalTips = document.getElementById('exerciseModalTips');
  const closeExerciseModal = document.getElementById('closeExerciseModal');

  // Sample technique guidance database for exercises
  const exerciseDetailsData = {
    'Push Up': {
      muscle: 'বুক, কাঁধ ও ট্রাইসেপস',
      difficulty: 'শিক্ষানবিস',
      description: 'শরীরের উপরের অংশের পুশিং শক্তি, বুকের পেশী এবং কোরের সামগ্রিক ভারসাম্য বাড়ানোর জন্য আদর্শ বডিওয়েট ব্যায়াম।',
      tips: [
        'হাত কাঁধের চেয়ে সামান্য বেশি চওড়া রাখুন',
        'মাথা থেকে গোড়ালি পর্যন্ত শরীর একদম সোজা রাখুন',
        'বুক মাটি থেকে ২ ইঞ্চি ওপরে থাকা পর্যন্ত নামান',
        'ওপরে ওঠার সময় ধীরে ধীরে শ্বাস ছাড়ুন'
      ]
    },
    'Squat': {
      muscle: 'কোয়াড্রিসেপস, হ্যামস্ট্রিংস ও গ্লুটস',
      difficulty: 'মধ্যবর্তী',
      description: 'শরীরের নিচের অংশের শক্তি ও দৃঢ়তার ভিত্তি, যা পুরো পায়ের পেশী সুগঠিত করে।',
      tips: [
        'পা কাঁধ সমান চওড়া রাখুন, পায়ের পাতা সামান্য বাইরে ফেরান',
        'কোমর পেছন ও নিচের দিকে নামিয়ে গতি শুরু করুন',
        'বুক সোজা এবং মেরুদণ্ড স্বাভাবিক রাখুন',
        'পায়ের পাতার মাঝখানে চাপ দিয়ে সোজা হয়ে দাঁড়ান'
      ]
    },
    'Bench Press': {
      muscle: 'পেক্টোরালিস মেজর ও ট্রাইসেপস',
      difficulty: 'উন্নত',
      description: 'বুকের পেশী চওড়া ও শক্তিশালী করা এবং ট্রাইসেপসের শক্তি বাড়ানোর প্রধান অলিম্পিক বারবেল ব্যায়াম।',
      tips: [
        'পা মেঝের সাথে শক্তভাবে রাখুন এবং পিঠ স্বাভাবিক ধনুকের মতো রাখুন',
        'বারবেল শক্ত করে ধরে ধীরে ধীরে বুকের মাঝে নামিয়ে আনুন',
        'কনুই ৪৫ ডিগ্রি কোণে রাখুন, কব্জি সোজা রাখুন',
        'শ্বাস ছাড়তে ছাড়তে বারবেল ওপরে ঠেলুন'
      ]
    },
    'Deadlift': {
      muscle: 'পোস্টেরিয়র চেইন, পিঠের নিচের অংশ ও হ্যামস্ট্রিংস',
      difficulty: 'উন্নত',
      description: 'পোস্টেরিয়র চেইনের রাজা, যা পিঠের নিচের অংশ, গ্লুটস, হ্যামস্ট্রিংস এবং গ্রিপ শক্তি বাড়ায়।',
      tips: [
        'বারবেলের কাছাকাছি দাঁড়ান যাতে তা পায়ের পাতার ওপরে থাকে',
        'কোমর বাঁকিয়ে হাঁটুর ঠিক বাইরে বারবেল ধরুন',
        'কোর শক্ত করুন, পিঠ সোজা রাখুন এবং বুক ফুলিয়ে তুলুন',
        'মেঝেতে চাপ দিয়ে কোমর সোজা করে একসাথে দাঁড়ান'
      ]
    },
    'Pull Up': {
      muscle: 'ল্যাটিসিমাস ডরসি ও বাইসেপস',
      difficulty: 'মধ্যবর্তী',
      description: 'শরীরের ওজনে পিঠ চওড়া (V-শেপ) করা এবং বাইসেপসের দৃঢ়তা বাড়ানোর সেরা পুলিং ব্যায়াম।',
      tips: [
        'কাঁধের চেয়ে সামান্য চওড়া করে বার ধরুন',
        'কাঁধের ব্লেড নিচের দিকে টেনে পিঠের পেশী সক্রিয় করুন',
        'কনুই নিচের দিকে টেনে বুক বারের দিকে তুলুন',
        'সম্পূর্ণ নিয়ন্ত্রণ বজায় রেখে ধীরে ধীরে নিচে নামুন'
      ]
    },
    'Plank': {
      muscle: 'ট্রান্সভার্স অ্যাবডোমিনিস ও ডিপ কোর',
      difficulty: 'শিক্ষানবিস',
      description: 'পেটের অভ্যন্তরীণ পেশী শক্ত করতে, মেরুদণ্ডের ভারসাম্য এবং সম্পূর্ণ কোরের স্ট্যামিনা বাড়াতে কার্যকর।',
      tips: [
        'কনুই কাঁধের ঠিক নিচে সমান্তরালে রাখুন',
        'গ্লুটস ও উরুর পেশী শক্ত করে নাভি ভেতরের দিকে টানুন',
        'কোমর বেশি ওপরে তোলা বা ঝুলিয়ে দেওয়া পরিহার করুন',
        'টানটান অবস্থায় স্বাভাবিকভাবে শ্বাস নিন ও ছাড়ুন'
      ]
    },
    'Lunges': {
      muscle: 'কোয়াড্রিসেপস, গ্লুটস ও কাফ',
      difficulty: 'শিক্ষানবিস',
      description: 'পায়ের প্রতিটি অংশের আলাদা ভারসাম্য, ভারসাম্য সমন্বয় এবং পেশীর সুষম গঠন নিশ্চিত করে।',
      tips: [
        'শরীর সোজা রেখে এক পা সামনে বাড়ান',
        'উভয় হাঁটু প্রায় ৯০ ডিগ্রি কোণে বাঁকা না হওয়া পর্যন্ত নামুন',
        'সামনের হাঁটু যেন ভেতরের দিকে বেঁকে না যায়',
        'সামনের গোড়ালিতে চাপ দিয়ে আগের অবস্থানে ফিরে আসুন'
      ]
    },
    'Shoulder Press': {
      muscle: 'ডেল্টয়েড ও ট্র্যাপিজিয়াস',
      difficulty: 'মধ্যবর্তী',
      description: 'কাঁধের ডেল্টয়েড পেশী সুগঠিত করতে এবং মাথার উপরে ওজন তোলার শক্তি বৃদ্ধিতে আদর্শ ব্যায়াম।',
      tips: [
        'ডাম্বেল বা বারবেল কাঁধের সমান উচ্চতায় রাখুন',
        'পিঠ বেশি বাঁকানো আটকাতে কোর শক্ত রাখুন',
        'মাথার ওপর সোজা উল্লম্ব রেখায় নিয়ন্ত্রণ সহকারে তুলুন',
        'কনুই নিয়ন্ত্রণে রেখে ধীরে ধীরে নিচে নামিয়ে আনুন'
      ]
    }
  };

  exerciseDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exerciseName = e.target.getAttribute('data-name');
      const details = exerciseDetailsData[exerciseName];

      if (details && exerciseModal) {
        exerciseModalTitle.textContent = exerciseName;
        exerciseModalMuscle.textContent = details.muscle;
        exerciseModalDiff.textContent = details.difficulty;
        exerciseModalDesc.textContent = details.description;
        
        // Render tips list
        exerciseModalTips.innerHTML = '';
        details.tips.forEach(tip => {
          const li = document.createElement('li');
          li.innerHTML = `<i class="fa-solid fa-check" style="color: var(--primary); margin-right: 8px;"></i> ${tip}`;
          exerciseModalTips.appendChild(li);
        });

        exerciseModal.classList.add('active');
      }
    });
  });

  if (closeExerciseModal && exerciseModal) {
    closeExerciseModal.addEventListener('click', () => {
      exerciseModal.classList.remove('active');
    });

    exerciseModal.addEventListener('click', (e) => {
      if (e.target === exerciseModal) {
        exerciseModal.classList.remove('active');
      }
    });
  }


  /* --------------------------------------------------------------------------
     5. BMI Calculator with Real-Time Validation
     -------------------------------------------------------------------------- */
  const bmiForm = document.getElementById('bmiForm');
  const heightInput = document.getElementById('heightInput');
  const weightInput = document.getElementById('weightInput');
  const bmiResetBtn = document.getElementById('bmiResetBtn');

  const bmiError = document.getElementById('bmiError');
  const bmiPlaceholder = document.getElementById('bmiPlaceholder');
  const bmiOutput = document.getElementById('bmiOutput');
  const bmiScore = document.getElementById('bmiScore');
  const bmiCategoryBadge = document.getElementById('bmiCategoryBadge');
  const bmiAdvice = document.getElementById('bmiAdvice');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve values
      const heightVal = parseFloat(heightInput.value.trim());
      const weightVal = parseFloat(weightInput.value.trim());

      // Validation
      if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 50 || heightVal >= 260 || weightVal <= 20 || weightVal >= 350) {
        bmiError.style.display = 'block';
        bmiError.textContent = 'দয়া করে সঠিক মান লিখুন: উচ্চতা (৫০-২৬০ সেমি) এবং ওজন (২০-৩৫০ কেজি)।';
        return;
      }

      bmiError.style.display = 'none';

      // BMI Formula: weight (kg) / [height (m)]^2
      const heightInMeters = heightVal / 100;
      const bmi = (weightVal / (heightInMeters * heightInMeters)).toFixed(1);

      let category = '';
      let badgeClass = '';
      let badgeStyle = '';
      let advice = '';

      if (bmi < 18.5) {
        category = 'কম ওজন (Underweight)';
        badgeStyle = 'background: rgba(0, 122, 255, 0.15); color: #007aff; border: 1px solid #007aff;';
        advice = 'আপনার বিএমআই অনুযায়ী আপনার ওজন স্বাভাবিকের চেয়ে কম। পুষ্টিকর ক্যালোরি সমৃদ্ধ সুষম খাবার গ্রহণ করুন এবং আমাদের ট্রেইনারদের সাথে স্ট্রেংথ ট্রেনিং শুরু করুন।';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'স্বাভাবিক ওজন (Normal Weight)';
        badgeStyle = 'background: rgba(48, 209, 88, 0.15); color: #30d158; border: 1px solid #30d158;';
        advice = 'চমৎকার! আপনার বিএমআই একদম স্বাস্থ্যকর ও আদর্শ সীমার মধ্যে রয়েছে। আপনার বর্তমান স্বাস্থ্যকর জীবনযাপন, পর্যাপ্ত পানি পান ও নিয়মিত ব্যায়াম অব্যাহত রাখুন।';
      } else if (bmi >= 25.0 && bmi <= 29.9) {
        category = 'অতিরিক্ত ওজন (Overweight)';
        badgeStyle = 'background: rgba(255, 149, 0, 0.15); color: #ff9500; border: 1px solid #ff9500;';
        advice = 'আপনার বিএমআই অতিরিক্ত ওজনের নির্দেশ করছে। নিয়মিত কার্ডিও ও স্ট্রেংথ ট্রেনিংয়ের সাথে পরিমিত পুষ্টিকর খাদ্যাভ্যাস গড়ে তুললে দ্রুত দারুণ ফল পাবেন।';
      } else {
        category = 'স্থূলতা (Obesity)';
        badgeStyle = 'background: rgba(255, 59, 48, 0.15); color: #ff3b30; border: 1px solid #ff3b30;';
        advice = 'আপনার বিএমআই স্থূলতার নির্দেশ করছে। একজন পুষ্টিবিদ বা ডাক্তারের পরামর্শ নেওয়ার পাশাপাশি আমাদের দক্ষ ট্রেইনারদের সহায়তায় ধাপে ধাপে নিয়মিত শরীরচর্চা শুরু করুন।';
      }

      // Display result
      bmiScore.textContent = bmi;
      bmiCategoryBadge.textContent = category;
      bmiCategoryBadge.setAttribute('style', badgeStyle);
      bmiAdvice.textContent = advice;

      bmiPlaceholder.style.display = 'none';
      bmiOutput.style.display = 'block';

      showToast(`বিএমআই গণনা সম্পন্ন: ${bmi} (${category})`, 'info');
    });

    // Reset button
    if (bmiResetBtn) {
      bmiResetBtn.addEventListener('click', () => {
        heightInput.value = '';
        weightInput.value = '';
        bmiError.style.display = 'none';
        bmiPlaceholder.style.display = 'flex';
        bmiOutput.style.display = 'none';
      });
    }
  }


  /* --------------------------------------------------------------------------
     6. Membership Plan Selection & Modal Confirmation
     -------------------------------------------------------------------------- */
  const choosePlanBtns = document.querySelectorAll('.choose-plan-btn');
  const planModal = document.getElementById('planModal');
  const selectedPlanName = document.getElementById('selectedPlanName');
  const selectedPlanPrice = document.getElementById('selectedPlanPrice');
  const closePlanModal = document.getElementById('closePlanModal');
  const planConfirmForm = document.getElementById('planConfirmForm');

  choosePlanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      const planPrice = btn.getAttribute('data-price');

      if (planModal) {
        selectedPlanName.textContent = `${planName} মেম্বারশিপ`;
        selectedPlanPrice.textContent = `${planPrice}`;
        planModal.classList.add('active');
      }
    });
  });

  if (closePlanModal && planModal) {
    closePlanModal.addEventListener('click', () => {
      planModal.classList.remove('active');
    });

    planModal.addEventListener('click', (e) => {
      if (e.target === planModal) {
        planModal.classList.remove('active');
      }
    });
  }

  if (planConfirmForm) {
    planConfirmForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const memberName = document.getElementById('planMemberName').value.trim();
      const memberEmail = document.getElementById('planMemberEmail').value.trim();

      if (!memberName || !memberEmail) {
        showToast('দয়া করে আপনার নাম এবং ইমেইল লিখুন!', 'warning');
        return;
      }

      planModal.classList.remove('active');
      planConfirmForm.reset();
      showToast(`অভিনন্দন ${memberName}! আপনার মেম্বারশিপ আবেদন সফলভাবে গ্রহণ করা হয়েছে।`, 'success');
    });
  }


  /* --------------------------------------------------------------------------
     7. Animated Statistics Counters on Scroll (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function runStatsCounter() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + '+';
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current) + '+';
        }
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          runStatsCounter();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }


  /* --------------------------------------------------------------------------
     8. Workout Progress Bar Animations on Scroll
     -------------------------------------------------------------------------- */
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  let progressAnimated = false;

  const progressSection = document.getElementById('progress');
  if (progressSection) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !progressAnimated) {
          progressAnimated = true;
          progressFills.forEach(fill => {
            const percentage = fill.getAttribute('data-width');
            fill.style.width = percentage + '%';
          });
        }
      });
    }, { threshold: 0.2 });

    progressObserver.observe(progressSection);
  }


  /* --------------------------------------------------------------------------
     9. Contact Us Form Validation with Error Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      // Helper function to validate an individual field
      function validateField(inputElement, errorElementId, condition, errorMsg) {
        const errorEl = document.getElementById(errorElementId);
        if (!condition) {
          inputElement.classList.add('input-error');
          if (errorEl) {
            errorEl.textContent = errorMsg;
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          inputElement.classList.remove('input-error');
          if (errorEl) {
            errorEl.style.display = 'none';
          }
        }
      }

      // Name validation: minimum 3 characters
      validateField(
        name,
        'contactNameError',
        name.value.trim().length >= 3,
        'পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে।'
      );

      // Email validation: standard regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(
        email,
        'contactEmailError',
        emailRegex.test(email.value.trim()),
        'দয়া করে একটি সঠিক ইমেইল এড্রেস লিখুন।'
      );

      // Phone validation: numbers and length
      const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
      validateField(
        phone,
        'contactPhoneError',
        phoneRegex.test(phone.value.trim()),
        'দয়া করে একটি সঠিক ফোন নম্বর লিখুন (৭ থেকে ১৫ ডিজিট)।'
      );

      // Subject validation: required
      validateField(
        subject,
        'contactSubjectError',
        subject.value.trim().length > 0,
        'দয়া করে একটি বিষয় নির্বাচন করুন।'
      );

      // Message validation: minimum 10 characters
      validateField(
        message,
        'contactMessageError',
        message.value.trim().length >= 10,
        'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।'
      );

      if (isValid) {
        // Show success alert
        if (contactAlert) {
          contactAlert.className = 'form-alert success';
          contactAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।';
          contactAlert.style.display = 'block';
        }

        showToast('বার্তা সফলভাবে পাঠানো হয়েছে!', 'success');
        contactForm.reset();

        // Hide success alert after 6 seconds
        setTimeout(() => {
          if (contactAlert) contactAlert.style.display = 'none';
        }, 6000);
      } else {
        showToast('দয়া করে সব প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।', 'warning');
      }
    });

    // Clear error highlights on user input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const err = input.parentElement.querySelector('.field-error-msg');
        if (err) err.style.display = 'none';
      });
    });
  }


  /* --------------------------------------------------------------------------
     10. Toast Notification System
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
