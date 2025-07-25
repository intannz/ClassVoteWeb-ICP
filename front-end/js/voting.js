import { createActor } from "./actor.js";
import { AuthClient } from 'https://esm.sh/@dfinity/auth-client';

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    const openMenu = () => { mobileMenu?.classList.add('active'); menuOverlay?.classList.add('active'); };
    const closeMenuFunc = () => { mobileMenu?.classList.remove('active'); menuOverlay?.classList.remove('active'); };

    mobileMenuToggle?.addEventListener('click', openMenu);
    closeMenu?.addEventListener('click', closeMenuFunc);
    menuOverlay?.addEventListener('click', closeMenuFunc);
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}

const main = async () => {
  const loginView = document.getElementById('login-view');
  const mainAppView = document.getElementById('main-app-view');
  const loginButton = document.getElementById('login-btn');
  const logoutButtons = document.querySelectorAll('#logoutBtn, #logoutBtnMobile');
  let actor;

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    loginView.style.display = 'flex';
    mainAppView.style.display = 'none';
  }

  loginButton.addEventListener('click', async () => {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => window.location.reload(),
    });
  });

  async function handleAuthenticated(client) {
    loginView.style.display = 'none';
    mainAppView.style.display = 'block';
    const identity = client.getIdentity();
    actor = createActor(identity);
    const handleLogout = async () => { await client.logout(); window.location.reload(); };
    logoutButtons.forEach(button => button.addEventListener('click', handleLogout));
    updateResults();
    document.querySelectorAll('.btn-vote').forEach(button => {
      button.addEventListener('click', (e) => submitVote(e.target.getAttribute('data-id')));
    });
  }
  
  async function submitVote(candidateId) {
    if (!actor || !candidateId) return;
    const button = document.querySelector(`.btn-vote[data-id="${candidateId}"]`);
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    try {
      const resultText = await actor.vote(candidateId);
      showNotification(resultText, resultText.includes("successfully") ? 'success' : 'error');
      if (resultText.includes("successfully")) {
        document.querySelectorAll('.btn-vote').forEach(btn => { btn.disabled = true; btn.textContent = 'You Have Voted'; });
        updateResults();
      } else {
        button.disabled = false;
        button.textContent = 'Vote';
      }
    } catch(err) {
      console.error("Vote submission failed:", err);
      showNotification('Vote failed. See console for details.', 'error');
      button.disabled = false;
      button.textContent = 'Vote';
    }
  }

  async function updateResults() {
    if (!actor) return;
    document.querySelectorAll('#mobile-result-list, #result-list').forEach(list => { list.innerHTML = "<li>Loading results...</li>"; });
    try {
      const results = await actor.getResults();
      const candidateNames = { "1": "Andra Wahyudi", "2": "Dekha Rohani", "3": "Davina Karamoy" };
      const resultHTML = results.map(([id, count]) => `<li>${candidateNames[id] || `Candidate ${id}`} : <span class="vote-count">${count}</span> votes</li>`).join('');
      document.querySelectorAll('#mobile-result-list, #result-list').forEach(list => { list.innerHTML = resultHTML || "<li>No votes yet.</li>"; });
    } catch (err) { 
      console.error('Failed to get results:', err); 
      document.querySelectorAll('#mobile-result-list, #result-list').forEach(list => { list.innerHTML = "<li>Failed to load results.</li>"; });
    }
  }
};

main();