// main.js

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signup-form');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const chatbotMessagesContainer = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSendBtn = document.getElementById('chatbot-send-btn');
  const lazyLoadInstance = new LazyLoad({ elements_selector: ".lazy" });
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  const sections = document.querySelectorAll('section');

  // Initialize smooth scrolling using smooth-scroll library
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 800,
    speedAsDuration: true,
    easing: 'easeInOutCubic'
  });

  navbarToggler.addEventListener('click', function() {
    navbarCollapse.classList.toggle('show');
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
      navbarCollapse.classList.remove('show');
    }
  });

  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const data = { email: email };

    fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Thank you for subscribing!');
        emailInput.value = '';
      } else {
        throw new Error(data.message || 'An error occurred while subscribing.');
      }
    })
    .catch(error => {
      console.error('Error during subscription:', error.message, error.stack);
      alert('Failed to subscribe. Please try again later.');
    });
  });

  // Initialize event listeners for portfolio items to open the portfolio modal
  const portfolioItems = document.querySelectorAll('#portfolioCarousel .carousel-item img');
  portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
      const src = item.dataset.src;
      const title = item.alt;
      const description = item.dataset.description || 'Detailed description not available.';
      $('#portfolioModal').modal('show');
      document.querySelector('#portfolioModal .modal-title').textContent = title;
      document.querySelector('#portfolioModal .modal-body img').src = src;
      document.querySelector('#portfolioModal .modal-body p').textContent = description;
    });
  });
  
  // Initialize carousel functionality for testimonials
  if (testimonialsCarousel) {
    $(testimonialsCarousel).carousel({
      interval: 5000,
      wrap: true
    });
  }

  // AI Chatbot Interaction
  const chatbotPhrases = [
    "Hello! How can I assist you with building your website today?",
    "Sure, I can help with that. What type of website are you looking to create?",
    "Let's add some cool features to your website. What do you have in mind?",
    "Your website is almost ready! Would you like to preview it?"
  ];
  
  let chatbotMessageIndex = 0;
  
  function addChatbotMessage(content, isUser) {
    const div = document.createElement('div');
    div.classList.add('chatbot-message', isUser ? 'user-message' : 'bot-message');
    div.textContent = content;
    chatbotMessagesContainer.appendChild(div);
    chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight;
  }
  
  function simulateTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('chatbot-message', 'typing-indicator');
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      typingIndicator.appendChild(dot);
    }
    chatbotMessagesContainer.appendChild(typingIndicator);
    chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight;
    return typingIndicator;
  }
  
  chatbotSendBtn.addEventListener('click', () => {
    const userInput = chatbotInput.value.trim();
    if (userInput) {
      addChatbotMessage(userInput, true);
      chatbotInput.value = '';
      const typingIndicator = simulateTypingIndicator();
  
      setTimeout(() => {
        chatbotMessagesContainer.removeChild(typingIndicator);
        if (chatbotMessageIndex < chatbotPhrases.length) {
          addChatbotMessage(chatbotPhrases[chatbotMessageIndex], false);
          chatbotMessageIndex++;
        } else {
          addChatbotMessage("That's all for our demo chat. Thank you for participating!", false);
        }
      }, 1500);
    }
  });

  // Event listener for the chatbotInput to handle the "Enter" key
  chatbotInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      chatbotSendBtn.click();
    }
  });

  // Intersection Observer for section visibility
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}); // end of DOMContentLoaded event listener