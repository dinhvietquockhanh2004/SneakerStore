// Khai báo các biến toàn cục quản lý trạng thái ứng dụng
let productsData = [];
let cart = [];
let currentSelectedSize = null;
let activeModalProduct = null;

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    fetchProducts();
    setupSearch();
});

/* 1. HIỆU ỨNG CON TRỎ CHUỘT (CUSTOM CURSOR) */
function initCursor() {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Tạo hiệu ứng phóng to con trỏ khi tương tác các phần tử Clickable
    const clickables = document.querySelectorAll('a, button, .product-card, .brand-item');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
        item.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
}

/* 2. ĐỌC DỮ LIỆU TỪ FILE JSON */
function fetchProducts() {
    // Để chạy trực tiếp trên máy không cần Server Local, ta mock dữ liệu từ file JSON vào đây:
    productsData = [
        {
            "id": 1,
            "name": "Nike Air Max Pulse",
            "brand": "Nike",
            "price": 150,
            "oldPrice": 180,
            "badge": "SALE",
            "badgeClass": "sale-badge",
            "rating": 4.8,
            "reviews": 124,
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43],
            "desc": "Được trang bị hệ thống đệm Air thế hệ mới, Nike Air Max Pulse mang lại cảm giác êm ái vượt trội cùng thiết kế đậm chất đường phố."
        },
        {
            "id": 2,
            "name": "Adidas Ultraboost Light",
            "brand": "Adidas",
            "price": 190,
            "badge": "NEW",
            "badgeClass": "new-badge",
            "rating": 4.9,
            "reviews": 85,
            "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44],
            "desc": "Dòng sản phẩm chạy bộ huyền thoại với công nghệ đệm Boost nhẹ hơn 30%, tối ưu hóa khả năng hoàn trả năng lượng trên mỗi bước chạy."
        },
        {
            "id": 3,
            "name": "Puma RS-X Efekt Retro",
            "brand": "Puma",
            "price": 120,
            "oldPrice": 140,
            "badge": "TRENDING",
            "badgeClass": "sale-badge",
            "rating": 4.6,
            "reviews": 62,
            "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
            "sizes": [38, 39, 40, 41, 42],
            "desc": "Sự kết hợp hoàn hảo giữa phong cách tương lai và hơi hướng cổ điển, mang lại cá tính mạnh mẽ cho người mặc."
        },
        {
            "id": 4,
            "name": "Asics Gel-Kayano 30",
            "brand": "Asics",
            "price": 160,
            "rating": 4.7,
            "reviews": 95,
            "image": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
            "sizes": [41, 42, 43, 44],
            "desc": "Công nghệ 4D Guidance System đem lại sự ổn định tuyệt đối và lớp đệm FF BLAST™ PLUS ECO cho trải nghiệm êm ái đỉnh cao."
        }
    ];
    renderProducts(productsData);
}

/* 3. ĐỔ SẢN PHẨM RA HTML CHUYÊN NGHIỆP */
function renderProducts(products) {
    const container = document.getElementById('productGridContainer');
    container.innerHTML = '';

    if(products.length === 0) {
        container.innerHTML = `<p class="section-sub" style="grid-column: 1/-1; text-align: center;">Không tìm thấy sản phẩm nào phù hợp.</p>`;
        return;
    }

    products.forEach(prod => {
        const badgeHTML = prod.badge ? `<span class="product-badge ${prod.badgeClass}">${prod.badge}</span>` : '';
        const oldPriceHTML = prod.oldPrice ? `<span class="old-price">$${prod.oldPrice}</span>` : '';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHTML}
            <div class="product-img" onclick="openQuickView(${prod.id})">
                <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="product-info">
                <div class="product-brand">${prod.brand}</div>
                <div class="product-name" onclick="openQuickView(${prod.id})">${prod.name}</div>
                <div class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${prod.rating}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">${oldPriceHTML}$${prod.price}</div>
                    <button class="add-cart-btn" onclick="directAddToCart(${prod.id})">MUA</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/* 4. CHỨC NĂNG LỌC SẢN PHẨM */
function filterProducts(brandName) {
    // Đổi trạng thái active của Button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if(btn.textContent.trim() === brandName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (brandName === 'All') {
        renderProducts(productsData);
    } else {
        const filtered = productsData.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
        renderProducts(filtered);
    }
}

/* 5. TÌM KIẾM THEO TÊN GIÀY */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const results = productsData.filter(p => p.name.toLowerCase().includes(keyword) || p.brand.toLowerCase().includes(keyword));
        renderProducts(results);
    });
}

/* 6. POPUP XEM CHI TIẾT SẢN PHẨM (QUICK VIEW) */
function openQuickView(id) {
    const product = productsData.find(p => p.id === id);
    if(!product) return;

    activeModalProduct = product;
    currentSelectedSize = product.sizes[0]; // Mặc định chọn size đầu tiên

    document.getElementById('modalBrand').textContent = product.brand;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalRating').textContent = product.rating;
    document.getElementById('modalReviews').textContent = product.reviews;
    document.getElementById('modalPrice').textContent = '$' + product.price;
    document.getElementById('modalDesc').textContent = product.desc;
    document.getElementById('modalImg').src = product.image;

    // Hiển thị danh sách Size
    const sizeContainer = document.getElementById('modalSizesContainer');
    sizeContainer.innerHTML = '';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = `size-btn ${size === currentSelectedSize ? 'active' : ''}`;
        btn.textContent = size;
        btn.onclick = () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSelectedSize = size;
        };
        sizeContainer.appendChild(btn);
    });

    // Gán sự kiện nút add cart trong modal
    document.getElementById('modalAddToCartBtn').onclick = () => {
        addToCart(product.id, currentSelectedSize);
        closeModalDirect();
    };

    document.getElementById('modalOverlay').classList.add('open');
}

function closeModalDirect() {
    document.getElementById('modalOverlay').classList.remove('open');
}

function closeModal(e) {
    if(e.target === document.getElementById('modalOverlay')) {
        closeModalDirect();
    }
}

/* 7. XỬ LÝ LOGIC GIỎ HÀNG (CART LOGIC) */
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

function directAddToCart(id) {
    const product = productsData.find(p => p.id === id);
    addToCart(id, product.sizes[0]); // Lấy đại size đầu tiên khi mua nhanh ngoài grid
}

function addToCart(id, size) {
    const product = productsData.find(p => p.id === id);
    
    // Kiểm tra xem sản phẩm cùng size đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }

    updateCartUI();
    showToast();
}

function updateCartUI() {
    // Cập nhật số lượng trên Icon Badge
    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalQty;

    // Cập nhật danh sách item hiển thị trong Sidebar
    const cartContainer = document.getElementById('cartItemsContainer');
    cartContainer.innerHTML = '';

    if(cart.length === 0) {
        cartContainer.innerHTML = `<p class="section-sub" style="text-align:center; padding-top:40px;">Giỏ hàng của bạn đang trống.</p>`;
        document.getElementById('cartTotalPrice').textContent = '$0.00';
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} (Size: ${item.size})</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Xóa</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });

    document.getElementById('cartTotalPrice').textContent = '$' + totalPrice.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/* 8. HIỂN THỊ THÔNG BÁO TOAST */
function showToast() {
    const toast = document.getElementById('toastNotification');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function checkoutAlert() {
    if(cart.length === 0) {
        alert('Giỏ hàng trống! Hãy chọn sản phẩm trước khi thanh toán.');
        return;
    }
    alert('Cảm ơn bạn đã đặt hàng! Hệ thống đang xử lý hóa đơn.');
    cart = [];
    updateCartUI();
    toggleCart();
}