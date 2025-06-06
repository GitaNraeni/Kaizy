document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if no username is stored
  const username = localStorage.getItem('username');
  const isLoginPage = window.location.pathname.includes('login.html');
  if (!username && !isLoginPage) {
    window.location.href = 'login.html';
  }

  // Update welcome message on all pages
  const welcomeMessage = document.getElementById('welcome-message');
  if (username && welcomeMessage) {
    welcomeMessage.textContent = `Hallo ${username}!`;
    welcomeMessage.addEventListener('click', () => {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('name-change-popup').style.display = 'block';
    });
  }

  // Hamburger menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username').value.trim();
      if (usernameInput) {
        localStorage.setItem('username', usernameInput);
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Verification Successful!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
          window.location.href = 'index.html';
        }, 2000);
      } else {
        alert('Please enter a valid name.');
      }
    });
  }

  // Feedback form handling
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const issue = document.getElementById('issue').value;
      const feedback = document.getElementById('feedback').value;
      const fileInput = document.getElementById('file');
      const file = fileInput.files[0];

      const telegramMessage = `New Feedback:\n\nName: ${name}\nEmail: ${email}\nIssue/Service: ${issue}\nFeedback: ${feedback}`;

      try {
        const textUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(telegramMessage)}`;
        const textResponse = await fetch(textUrl);
        if (!textResponse.ok) {
          throw new Error('Failed to send text message');
        }

        if (file) {
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('document', file);

          const fileUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;
          const fileResponse = await fetch(fileUrl, {
            method: 'POST',
            body: formData
          });
          if (!fileResponse.ok) {
            throw new Error('Failed to send file');
          }
        }

        alert('Feedback sent successfully!');
        feedbackForm.reset();
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to send feedback. Please try again.');
      }
    });
  }

  // Name change popup handling
  const changeBtn = document.querySelector('.change-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const popup = document.getElementById('name-change-popup');
  const overlay = document.getElementById('overlay');

  if (changeBtn && resetBtn && popup && overlay) {
    changeBtn.addEventListener('click', () => {
      const newName = document.querySelector('#name-change-popup input').value.trim();
      if (newName) {
        localStorage.setItem('username', newName);
        location.reload();
      } else {
        alert('Please enter a new name.');
      }
      popup.style.display = 'none';
      overlay.style.display = 'none';
    });

    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('username');
      location.href = 'login.html';
      popup.style.display = 'none';
      overlay.style.display = 'none';
    });

    overlay.addEventListener('click', () => {
      popup.style.display = 'none';
      overlay.style.display = 'none';
    });
  }

  // Update active navigation link based on current page
  const navLinksList = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Get current file name

  // Remove active class from all links first
  navLinksList.forEach(link => {
    link.classList.remove('active');
  });

  // Add active class to the correct link
  navLinksList.forEach(link => {
    // Handle click to update active link
    link.addEventListener('click', () => {
      navLinksList.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });

    // Set active link based on current page
    const href = link.getAttribute('href').split('/').pop(); // Get href file name
    const isHome = (currentPath === 'index.html' || currentPath === '') && (href === 'index.html' || href === '');
    const isExternal = href.startsWith('http'); // Skip external links like Discord

    if (!isExternal && (isHome || currentPath === href)) {
      link.classList.add('active');
    }
  });
});
