const books = [
  {
    id: 1,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    price: 499,
    rating: 4.9,
    description: 'A moving story about second chances, choices, and the lives we could have lived.',
    tag: 'Fiction'
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    price: 599,
    rating: 4.8,
    description: 'A practical guide to building better habits and breaking the routines that hold you back.',
    tag: 'Self-Help'
  },
  {
    id: 3,
    title: 'Wings of Dawn',
    author: 'Elena Hart',
    genre: 'Fantasy',
    price: 650,
    rating: 4.7,
    description: 'A magical quest through forgotten kingdoms, hidden powers, and impossible courage.',
    tag: 'Fantasy'
  },
  {
    id: 4,
    title: 'Silent Echoes',
    author: 'Ria Moren',
    genre: 'Mystery',
    price: 540,
    rating: 4.9,
    description: 'A suspenseful mystery filled with eerie clues, buried secrets, and a shocking twist.',
    tag: 'Mystery'
  },
  {
    id: 5,
    title: 'The Story of My Life',
    author: 'Helen Keller',
    genre: 'Biography',
    price: 470,
    rating: 4.6,
    description: 'An inspiring memoir of resilience, faith, and the human spirit overcoming extraordinary barriers.',
    tag: 'Biography'
  },
  {
    id: 6,
    title: 'Dreams of the Glass Sea',
    author: 'Nora Vale',
    genre: 'Fantasy',
    price: 610,
    rating: 4.8,
    description: 'A lyrical fantasy about lost memories, star-born legends, and a kingdom in search of hope.',
    tag: 'Fantasy'
  },
  {
    id: 7,
    title: 'The Last Witness',
    author: 'Alden Cross',
    genre: 'Mystery',
    price: 585,
    rating: 4.7,
    description: 'When a cold case suddenly reopens, one detective must trace the truth before it disappears again.',
    tag: 'Mystery'
  },
  {
    id: 8,
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    genre: 'Self-Help',
    price: 520,
    rating: 4.8,
    description: 'A timeless guide to inner peace, awareness, and living in the present moment.',
    tag: 'Self-Help'
  },
  {
    id: 9,
    title: 'The Hidden Door',
    author: 'Lina Frost',
    genre: 'Fiction',
    price: 560,
    rating: 4.6,
    description: 'A warm and intimate novel about love, belonging, and the friendships that shape us.',
    tag: 'Fiction'
  },
  {
    id: 10,
    title: 'Becoming',
    author: 'Michelle Obama',
    genre: 'Biography',
    price: 680,
    rating: 4.9,
    description: 'A deeply personal memoir reflecting on identity, family, leadership, and growth.',
    tag: 'Biography'
  }
];

const genreButtons = document.querySelectorAll('.genre-button');
const bookList = document.getElementById('book-list');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const panelItemCount = document.getElementById('panel-item-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatStatus = document.getElementById('chat-status');
const chatSend = document.getElementById('chat-send');

let selectedGenre = 'All';
let cart = [];
const conversation = [
  {
    role: 'system',
    content: 'You are BookGrow, a friendly reading companion. Help users discover books and discuss reading preferences. Keep recommendations thoughtful and concise.'
  }
];

function formatPrice(value) {
  return `₹${value}`;
}

function getFilteredBooks() {
  if (selectedGenre === 'All') return books;
  return books.filter((book) => book.genre === selectedGenre);
}

function renderBooks() {
  const filteredBooks = getFilteredBooks();

  if (!filteredBooks.length) {
    bookList.innerHTML = '<div class="empty-state">No books available in this genre right now.</div>';
    return;
  }

  bookList.innerHTML = filteredBooks
    .map(
      (book) => `
        <article class="book-card-item">
          <div class="book-cover">${book.title.slice(0, 2).toUpperCase()}</div>
          <div class="book-info">
            <div class="book-meta">
              <span class="book-genre">${book.genre}</span>
              <span class="book-rating">★ ${book.rating}</span>
            </div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-description">${book.description}</p>
            <div class="book-footer">
              <span class="price">${formatPrice(book.price)}</span>
              <div class="quantity-wrap">
                <label for="qty-${book.id}">Qty</label>
                <input id="qty-${book.id}" type="number" min="1" value="1" />
              </div>
            </div>
            <div class="actions">
              <button class="add-cart" data-id="${book.id}">Add to Cart</button>
              <button class="buy-now" data-id="${book.id}">Buy Now</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  cartCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  panelItemCount.textContent = totalItems;
  cartTotal.textContent = totalPrice;

  if (!cart.length) {
    cartItems.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <li>
          <div class="cart-item-details">
            <span class="cart-item-name">${item.title}</span>
            <span class="cart-item-meta">${item.quantity} × ${formatPrice(item.price)}</span>
          </div>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </li>
      `
    )
    .join('');
}

function addToCart(bookId, qty = 1) {
  const book = books.find((entry) => entry.id === Number(bookId));
  if (!book) return;

  const existing = cart.find((item) => item.id === Number(bookId));

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...book, quantity: qty });
  }

  updateCartUI();
}

function buyNow(bookId, qty = 1) {
  addToCart(bookId, qty);
  alert('Your book has been added to the cart. Proceed to checkout when ready.');
}

document.addEventListener('click', (event) => {
  const genreTarget = event.target.closest('.genre-button');
  if (genreTarget) {
    selectedGenre = genreTarget.dataset.genre;
    genreButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.genre === selectedGenre);
    });
    renderBooks();
    return;
  }

  const addBtn = event.target.closest('.add-cart');
  if (addBtn) {
    const id = Number(addBtn.dataset.id);
    const input = document.getElementById(`qty-${id}`);
    const quantity = Number(input.value) || 1;
    addToCart(id, quantity);
    return;
  }

  const buyBtn = event.target.closest('.buy-now');
  if (buyBtn) {
    const id = Number(buyBtn.dataset.id);
    const input = document.getElementById(`qty-${id}`);
    const quantity = Number(input.value) || 1;
    buyNow(id, quantity);
    return;
  }

  const removeBtn = event.target.closest('.remove-item');
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
  }
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty. Add a few books to continue.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  alert(`Checkout ready! Total amount: ₹${total}. Thank you for shopping at BookGrow.`);
});

function addChatMessage(role, content) {
  const message = document.createElement('div');
  message.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;

  const speaker = document.createElement('span');
  speaker.className = 'chat-speaker';
  speaker.textContent = role === 'user' ? 'You' : 'BookGrow';

  const text = document.createElement('p');
  text.textContent = content;

  message.append(speaker, text);
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return text;
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = chatInput.value.trim();
  if (!content || chatSend.disabled) return;

  addChatMessage('user', content);
  conversation.push({ role: 'user', content });
  chatInput.value = '';
  chatSend.disabled = true;
  chatInput.disabled = true;
  chatStatus.textContent = 'Waiting for llama3.2...';
  const pendingText = addChatMessage('assistant', 'Thinking...');

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: conversation,
        stream: false
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || `Ollama returned HTTP ${response.status}.`);
    }

    const reply = result.message?.content?.trim();
    if (!reply) throw new Error('Ollama returned an empty response.');

    pendingText.textContent = reply;
    conversation.push({ role: 'assistant', content: reply });
    chatStatus.textContent = 'Ready · llama3.2';
  } catch (error) {
    conversation.pop();
    pendingText.textContent = `I couldn't reach Ollama: ${error.message} Make sure Ollama is running, the llama3.2 model is available, and this page is allowed by Ollama's browser-origin settings.`;
    chatStatus.textContent = 'Ollama connection error';
  } finally {
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

renderBooks();
updateCartUI();
